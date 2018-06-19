#include <MoistureSensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <TaskScheduler.h>
#include <Statistic.h>
#include <aREST.h>

#define DHT_PIN 26
#define DHT_TYPE 25
#define RE_IN_PIN1 17
#define RE_IN_PIN2 16
#define RE_IN_PIN3 27
#define RE_IN_PIN4 14
#define FERTILITY_PIN 4
#define MOISTURE_PIN 2
#define LISTEN_PORT 80

const char *SSID = "aisfibre_2.4G";
const char *SSID_PASSWORD = "molena01";
const int waterPump = 1;
const int fertilizerPump = 2;
const int moisturePump = 3;

int moisture = 0;
int moisturePercent = 0;
String sensorData;
int fertility;
float humidity, temperature;
int inputLitre;

byte sensorInterrupt = 0;
byte sensorPin = 0;
float calibrationFactor = 4.5;
volatile byte pulseCount;
float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;
unsigned long oldTime;

aREST rest = aREST();
Statistic fertilityStats;
Statistic humidityStats;
Statistic moistureStats;
Statistic temperatureStats;
DynamicJsonBuffer jsonBuffer;
DHT dht(DHT_PIN, DHT_TYPE);
Scheduler runner;

WiFiServer server(LISTEN_PORT);

void sendData();
void checkLitre();
Task sendDataTask(15000, TASK_FOREVER, &sendData);
Task checkLitreTask(2000, TASK_FOREVER, &checkLitre);

void setup(void)
{
        Serial.begin(115200);
        chat.begin(57600);

        pinMode(MOISTURE_PIN, INPUT);
        pinMode(RE_IN_PIN1, OUTPUT);
        pinMode(RE_IN_PIN2, OUTPUT);
        pinMode(RE_IN_PIN3, OUTPUT);
        pinMode(RE_IN_PIN4, OUTPUT);

        pinMode(sensorPin, INPUT);
        digitalWrite(sensorPin, HIGH);

        digitalWrite(RE_IN_PIN1, HIGH);
        digitalWrite(RE_IN_PIN2, HIGH);
        digitalWrite(RE_IN_PIN3, HIGH);
        digitalWrite(RE_IN_PIN4, HIGH);

        pulseCount = 0;
        flowRate = 0.0;
        flowMilliLitres = 0;
        totalMilliLitres = 0;
        oldTime = 0;

        rest.function("waterPump", waterPumpControl);
        rest.function("fertilizerPump", fertilizerPumpControl);
        rest.function("moisturePump", moisturePumpControl);
        rest.function("manualWater", manualWaterPump);
        rest.function("manualFertilizer", manualFertilizerPump);
        rest.function("manualMoisture", manualMoisturePump);
        rest.set_id("10000001");
        rest.set_name("esp8266");

        WiFi.mode(WIFI_STA);
        IPAddress ip(192, 168, 1, 12);
        IPAddress dns(8, 8, 8, 8);
        IPAddress gateway(192, 168, 1, 2);
        IPAddress subset(255, 255, 255, 0);
        WiFi.begin(SSID, SSID_PASSWORD);
        WiFi.config(ip, dns, gateway, subset);

        while (WiFi.status() != WL_CONNECTED)
        {
                delay(500);
                Serial.print(".");
        }
        Serial.println("");
        Serial.println("WiFi is Connected!");
        Serial.println(WiFi.localIP());

        server.begin();
        attachInterrupt(sensorInterrupt, pulseCounter, FALLING);

        runner.init();
        runner.addTask(sendData);
        sendDataTask.enable();

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
        String temp = chat.readString();

        if (isnan(dht.readTemperature()) || isnan(dht.readTemperature()))
        {
                return;
        }

        if ((millis() - oldTime) > 1000)
        {
                detachInterrupt(sensorInterrupt);
                flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / calibrationFactor;
                oldTime = millis();
                flowMilliLitres = (flowRate / 60) * 1000;
                totalMilliLitres += flowMilliLitres;

                Serial.print("Output Liquid Quantity: ");
                Serial.print(totalMilliLitres);
                Serial.println("mL");
                Serial.print("\t"); // Print tab space
                Serial.print(totalMilliLitres / 1000);
                Serial.println("L");

                pulseCount = 0;
                attachInterrupt(sensorInterrupt, pulseCounter, FALLING);
        }

        fertility = temp.toInt();
        humidity = dht.readHumidity();
        temperature = dht.readTemperature();
        Serial.println(moisture);
        moisturePercent = convertToPercent(moisture);
        humidityStats.add(humidity);
        temperatureStats.add(temperature);
        moistureStats.add(moisturePercent);
        fertilityStats.add(fertility);

        sensorData = String(makeJSON(temperature, humidity, fertility, moisturePercent));

        Serial.println("-----------------JSON-----------------");
        Serial.println(sensorData);
}

void pulseCounter()
{
        pulseCount++;
}

int convertToPercent(int value)
{
        int percentValue = 0;
        percentValue = map(value, 730, 400, 0, 100);
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

int read_fertility()
{
        int i, fertility;
        fertility = 0;
        for (i = 0; i < 10; i++)
        {
                fertility = fertility + analogRead(fertility_pin);
                delay(1);
        }
        fertility = fertility / 10;
        if (fertility >= 480)
        {
                fertility = ((fertility - 480) / 10) + 93;
        }
        else if (fertility >= 360)
        {
                fertility = ((fertility - 360) / 7.5) + 77;
        }
        else if (fertility >= 275)
        {
                fertility = ((fertility - 275) / 5) + 59;
        }
        else if (fertility >= 200)
        {
                fertility = ((fertility - 200) / 6.25) + 47;
        }
        else if (fertility >= 125)
        {
                fertility = ((fertility - 125) / 5.3) + 31;
        }
        else if (fertility >= 65)
        {
                fertility = ((fertility - 65) / 4) + 16;
        }
        else if (fertility >= 0)
        {
                fertility = ((fertility - 0) / 3.75) + 0;
        }
        return (fertility);
}

void manualOnPump(int pumpType, int litre)
{
        totalMilliLitres = 0;
        digitalWrite(RE_IN_PIN1, 0);
        checkLitreTask.enable();
}

void checkLitre()
{
        if ((totalMilliLitres / 1000) > litre)
        {
                digitalWrite(RE_IN_PIN4, 1);
                checkLitreTask.disable();
                runner.deleteTask(checkLitreTask);
        }
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
        int litre = inputLitre.toInt();
        manualOnPump(waterPump, litre);
        return 1;
}

int manualFertilizerPump(String inputLitre)
{
        int litre = inputLitre.toInt();
        manualOnPump(fertilizerPump, litre);
        return 1;
}

int manualMoisturePump(String inputLitre)
{
        int litre = inputLitre.toInt();
        manualOnPump(moisturePump, litre);
        return 1;
}