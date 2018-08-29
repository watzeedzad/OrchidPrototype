#include <dht.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <TaskScheduler.h>
#include <Statistic.h>
#include <aREST.h>

#define DHT22_PIN 26
#define RE_IN_PIN1 25
#define RE_IN_PIN2 17
#define RE_IN_PIN3 16
#define RE_IN_PIN4 27
#define MOISTURE_PIN 39
#define LISTEN_PORT 80

const char *SSID = "Pi_dhcp";
const char *SSID_PASSWORD = "molena01";

aREST rest = aREST();
Statistic fertilityStats;
Statistic humidityStats;
Statistic moistureStats;
Statistic temperatureStats;
DynamicJsonBuffer jsonBuffer;
dht DHT;
Scheduler runner;
WiFiServer server(LISTEN_PORT);

void sendData();
void checkWaterLitre();
void checkFertilizerLitre();
Task sendDataTask(75000, TASK_FOREVER, &sendData);
Task checkWaterLitreTask(500, TASK_FOREVER, &checkWaterLitre);
Task checkFertilizerLitreTask(500, TASK_FOREVER, &checkFertilizerLitre);

int inputLitre;
int moisture = 0;
int moisturePercent = 0;
String sensorData;
int fertility = 30;
float humidity, temperature;

byte waterFlowSensorInterrupt = 0;
byte waterFlowSensorPin = 19;
byte fertilizerFlowSensorInterrupt = 0;
byte fertilizerFlowSensorPin = 18;
float calibrationFactor = 7.5;
volatile byte waterPulseCount;
volatile byte fertilizerPulseCount;
float waterFlowRate;
float fertilizerFlowRate;
unsigned int waterFlowMilliLitres;
unsigned int fertilizerFlowMilliLitres;
unsigned long waterFlowTotalMilliLitres;
unsigned long fertilizerFlowTotalMilliLitres;
unsigned long waterFlowOldTime;
unsigned long fertilizerFlowOldTime;

IPAddress ip(192, 168, 1, 12);
IPAddress subnet(255, 255, 255, 0);
IPAddress gateway(192, 168, 1, 2);
IPAddress primaryDns(8, 8, 8, 8);
IPAddress secondaryDns(8, 8, 4, 4);

void setup(void)
{
        Serial.begin(115200);

        pinMode(MOISTURE_PIN, INPUT);
        pinMode(FERTILITY_PIN, INPUT);
        pinMode(RE_IN_PIN1, OUTPUT);
        pinMode(RE_IN_PIN2, OUTPUT);
        pinMode(RE_IN_PIN3, OUTPUT);
        pinMode(RE_IN_PIN4, OUTPUT);

        pinMode(waterFlowSensorPin, INPUT);
        digitalWrite(waterFlowSensorPin, HIGH);

        digitalWrite(RE_IN_PIN1, HIGH);
        digitalWrite(RE_IN_PIN2, HIGH);
        digitalWrite(RE_IN_PIN3, HIGH);
        digitalWrite(RE_IN_PIN4, HIGH);

        waterPulseCount = 0;
        waterFlowRate = 0.0;
        waterFlowMilliLitres = 0;
        waterFlowTotalMilliLitres = 0;
        waterFlowOldTime = 0;
        fertilizerPulseCount = 0;
        fertilizerFlowRate = 0.0;
        fertilizerFlowMilliLitres = 0;
        fertilizerFlowTotalMilliLitres = 0;
        fertilizerFlowOldTime = 0;

        rest.function("waterPump", waterPumpControl);
        rest.function("fertilizerPump", fertilizerPumpControl);
        rest.function("moisturePump", moisturePumpControl);
        rest.function("manualWater", manualWaterPump);
        rest.function("manualFertilizer", manualFertilizerPump);
        rest.function("manualMoisture", manualMoisturePump);
        rest.set_id("10000001");
        rest.set_name("esp32");

        WiFi.mode(WIFI_STA);
        WiFi.config(ip, gateway, subnet, primaryDns, secondaryDns);
        WiFi.begin(SSID, SSID_PASSWORD);

        while (WiFi.status() != WL_CONNECTED)
        {
                delay(500);
                Serial.print(".");
        }
        Serial.println("");
        Serial.println("WiFi is Connected!");
        Serial.println(WiFi.localIP());

        server.begin();
        attachInterrupt(waterFlowSensorInterrupt, waterPulseCounter, FALLING);
        attachInterrupt(fertilizerFlowSensorInterrupt, fertilizerPulseCounter, FALLING);

        runner.init();
        runner.addTask(checkWaterLitreTask);
        // runner.addTask(sendDataTask);
        // sendDataTask.enable();

        delay(100);
}

void loop(void)
{
        Serial.println("enter loop");
        WiFiClient client = server.available();
        if (client && client.available())
        {
                rest.handle(client);
        }

        delay(1000);

        moisture = analogRead(MOISTURE_PIN);

        if ((millis() - waterFlowOldTime) > 1000)
        {
                detachInterrupt(waterFlowSensorInterrupt);
                waterFlowRate = ((1000.0 / (millis() - waterFlowOldTime)) * waterPulseCount) / calibrationFactor;
                waterFlowOldTime = millis();
                waterFlowMilliLitres = (waterFlowRate / 60) * 1000;
                waterFlowTotalMilliLitres += waterFlowMilliLitres;

                Serial.print("(water) Output Liquid Quantity: ");
                Serial.print(waterFlowTotalMilliLitres);
                Serial.println("mL");
                Serial.print("\t"); // Print tab space
                Serial.print(waterFlowTotalMilliLitres / 1000);
                Serial.println("L");

                waterPulseCount = 0;
                attachInterrupt(waterFlowSensorInterrupt, waterPulseCounter, FALLING);
        }

        if ((millis() - fertilizerFlowOldTime) > 1000)
        {
                detachInterrupt(fertilizerFlowSensorInterrupt);
                fertilizerFlowRate = ((1000.0 / (millis() - fertilizerFlowOldTime)) * waterPulseCount) / calibrationFactor;
                fertilizerFlowOldTime = millis();
                fertilizerFlowMilliLitres = (fertilizerFlowRate / 60) * 1000;
                fertilizerFlowTotalMilliLitres += fertilizerFlowMilliLitres;

                Serial.print("(fertilizer) Output Liquid Quantity: ");
                Serial.print(waterFlowTotalMilliLitres);
                Serial.println("mL");
                Serial.print("\t"); // Print tab space
                Serial.print(waterFlowTotalMilliLitres / 1000);
                Serial.println("L");
        }

        DHT.read22(DHT22_PIN);
        humidity = DHT.humidity, 1;
        temperature = DHT.temperature, 1;
        Serial.println(analogRead(FERTILITY_PIN));
        Serial.println(moisture);
        moisturePercent = convertToPercent(moisture);

        humidityStats.add(humidity);
        temperatureStats.add(temperature);
        moistureStats.add(moisturePercent);
        fertilityStats.add(fertility);

        sensorData = String(makeJSON(temperature, humidity, fertility, moisturePercent));

        Serial.println("-----------------JSON-----------------");
        Serial.println(sensorData);

        runner.execute();
}

void waterPulseCounter()
{
        waterPulseCount++;
}

void fertilizerPulseCounter()
{
        fertilizerPulseCount++;
}

int convertToPercent(int value)
{
        int percentValue = 0;
        percentValue = map(value, 3000, 1700, 0, 100);
        if (percentValue == -1)
        {
                percentValue = 0;
        }
        if (percentValue >= 100)
        {
                percentValue = 100;
        }
        if (percentValue <= 0)
        {
                percentValue = 0;
        }
        return percentValue;
}

String makeJSON(float temperature, float humidity, int fertility, int moisturePercent)
{
        String jsonString = "{\"temperature\":33.60,\"humidity\":60.70,\"fertility\":29,\"moisture\":0}";
        JsonObject &root = jsonBuffer.parseObject(jsonString);

        root[String("temperature")] = temperature;
        root[String("humidity")] = humidity;
        root[String("fertility")] = fertility;
        root[String("moisture")] = moisturePercent;

        String jsonStringOut;
        root.printTo(jsonStringOut);
        jsonBuffer.clear();
        return jsonStringOut;
}

void sendData()
{
        Serial.println("Function \"sendData\" has been called.");
        Serial.print("Avg. of temperature : ");
        Serial.println(temperatureStats.average(), 2);
        Serial.print("Avg. of humidity : ");
        Serial.println(humidityStats.average(), 2);
        Serial.print("Avg. of fertility : ");
        Serial.println(fertilityStats.average(), 2);
        Serial.print("Avg. of moisture : ");
        Serial.println(moistureStats.average(), 2);

        StaticJsonBuffer<250> JSONbuffer1;
        JsonObject &JSONencoder = JSONbuffer1.createObject();
        JSONencoder["temperature"] = temperatureStats.average();
        JSONencoder["humidity"] = humidityStats.average();
        JSONencoder["soilMoisture"] = moistureStats.average();
        JSONencoder["ambientLight"] = 548.68;
        JSONencoder["ip"] = "crossbaronx.thddns.net:6064";
        char dataSet1[250];
        JSONencoder.prettyPrintTo(dataSet1, sizeof(dataSet1));
        Serial.println(dataSet1);

        HTTPClient http;
        http.setTimeout(10000);
        // http.begin("https://hello-api.careerity.me/sensorRoutes/greenHouseSensor", "EC:BB:33:AB:B4:F4:5B:A0:76:F3:F1:5B:FE:EC:BD:16:17:5C:22:47");
        http.begin("http://192.168.1.151:3001/sensorRoutes/greenHouseSensor");
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST(dataSet1);
        String payload = http.getString();
        Serial.print("http result: ");
        Serial.println(httpCode);
        Serial.println(String(http.errorToString(httpCode)));
        Serial.print("Payload: ");
        Serial.println(payload);
        http.end();

        StaticJsonBuffer<250> JSONbuffer2;
        JsonObject &JSONencoder2 = JSONbuffer2.createObject();
        JSONencoder2["soilFertilizer"] = fertilityStats.average();
        JSONencoder2["ip"] = "crossbaronx.thddns.net:6064";
        char dataSet2[250];
        JSONencoder2.prettyPrintTo(dataSet2, sizeof(dataSet2));
        Serial.println(dataSet2);

        http.setTimeout(10000);
        // http.begin("https://hello-api.careerity.me/sensorRoutes/projectSensor", "EC:BB:33:AB:B4:F4:5B:A0:76:F3:F1:5B:FE:EC:BD:16:17:5C:22:47");
        http.begin("http://192.168.1.151:3001/sensorRoutes/projectSensor");
        http.addHeader("Content-Type", "application/json");
        httpCode = http.POST(dataSet2);
        payload = http.getString();
        Serial.print("http result: ");
        Serial.println(httpCode);
        Serial.println(String(http.errorToString(httpCode)));
        Serial.print("Payload: ");
        Serial.println(payload);
        http.end();

        temperatureStats.clear();
        humidityStats.clear();
        fertilityStats.clear();
        moistureStats.clear();
}

void checkWaterLitre()
{
        if (waterFlowTotalMilliLitres > (inputLitre * 1000))
        {
                Serial.println("true");
                digitalWrite(RE_IN_PIN1, 1);
                checkWaterLitreTask.disable();
        }
        else
        {
                Serial.println("false");
        }
}

void checkFertilizerLitre()
{
}

int waterPumpControl(String command)
{
        int state = command.toInt();
        digitalWrite(RE_IN_PIN1, state);
        return 1;
}

int fertilizerPumpControl(String command)
{
        int state = command.toInt();
        digitalWrite(RE_IN_PIN2, state);
        return 1;
}

int moisturePumpControl(String command)
{
        int state = command.toInt();
        digitalWrite(RE_IN_PIN4, state);
        return 1;
}

int manualWaterPump(String inputLitre)
{
        inputLitre = inputLitre.toInt();
        waterFlowTotalMilliLitres = 0;
        digitalWrite(RE_IN_PIN1, 0);
        checkWaterLitreTask.enable();
        return 1;
}

int manualFertilizerPump(String inputLitre)
{
        int litre = inputLitre.toInt();
        return 1;
}

int manualMoisturePump(String inputLitre)
{
        int litre = inputLitre.toInt();
        return 1;
}