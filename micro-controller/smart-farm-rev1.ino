#include <MoistureSensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <Adafruit_Sensor.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <H4.h>
#include <Statistic.h>
#include <aREST.h>

#define DHT_PIN D4
#define DHT_TYPE DHT22
#define RE_IN_PIN1 D7
#define RE_IN_PIN2 D8
#define RE_IN_PIN3 D6
#define RE_IN_PIN4 D5
#define FERTILITY_PIN 5
#define MOISTURE_PIN A0
#define LISTEN_PORT 80
#define DEBUG_PRINT 1

const char *SSID = "ASUS";
const char *SSID_PASSWORD = "molena01";

int moisture = 0;
int moisturePercent = 0;
String sensorData;
int fertility;
float humidity, temperature;

aREST rest = aREST();
Statistic fertilityStats;
Statistic humidityStats;
Statistic moistureStats;
Statistic temperatureStats;
SoftwareSerial chat(D6, SW_SERIAL_UNUSED_PIN);
DynamicJsonBuffer jsonBuffer;
DHT dht(DHT_PIN, DHT_TYPE);
H4 caller;
ESP8266WiFiMulti WiFiMulti;
WiFiServer server(LISTEN_PORT);

void setup(void)
{
        Serial.begin(115200);
        chat.begin(57600);

        pinMode(MOISTURE_PIN, INPUT);
        pinMode(RE_IN_PIN1, OUTPUT);
        pinMode(RE_IN_PIN2, OUTPUT);
        pinMode(RE_IN_PIN3, OUTPUT);
        pinMode(RE_IN_PIN4, OUTPUT);

        digitalWrite(RE_IN_PIN1, HIGH);
        digitalWrite(RE_IN_PIN2, HIGH);
        digitalWrite(RE_IN_PIN3, HIGH);
        digitalWrite(RE_IN_PIN4, HIGH);

        rest.function("waterPump", waterPumpControl);
        rest.function("fertilityPump", fertilityPumpControl);
        rest.function("moisturePump", moisturePumpControl);
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

        //        WiFiMulti.addAP(SSID, SSID_PASSWORD);
        //
        //        while (WiFiMulti.run() != WL_CONNECTED)
        //        {
        //                delay(100);
        //                if (DEBUG_PRINT)
        //                {
        //                        Serial.print(". ");
        //                }
        //        }
        //        WiFi.config(IPAddress(192, 168, 1, 12), IPAddress(8, 8, 8, 8), IPAddress(192, 168, 1, 2), IPAddress(255, 255, 255, 0));
        //        if (DEBUG_PRINT)
        //        {
        //                Serial.println("\nconnected to network " + String(SSID) + "\n");
        //        }

        caller.every(30000, sendData);
        server.begin();

        delay(100);
}

void loop(void)
{
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
        fertility = temp.toInt();
        humidity = dht.readHumidity();
        temperature = dht.readTemperature();
        moisturePercent = convertToPercent(moisture);
        humidityStats.add(humidity);
        temperatureStats.add(temperature);
        moistureStats.add(moisturePercent);
        fertilityStats.add(fertility);

        sensorData = String(makeJSON(temperature, humidity, fertility, moisturePercent));

        Serial.println("-----------------JSON-----------------");
        Serial.println(sensorData);

        caller.loop();
}

int convertToPercent(int value)
{
        int percentValue = 0;
        percentValue = map(value, 110, 750, 0, 100);
        if (percentValue == -1)
        {
                percentValue = 0;
        }
        if (percentValue >= 100)
        {
                percentValue = 100;
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

        StaticJsonBuffer<150> JSONbuffer;
        JsonObject &JSONencoder = JSONbuffer.createObject();
        JSONencoder["temperature"] = temperatureStats.average();
        JSONencoder["humidity"] = humidityStats.average();
        // JSONencoder["fertility"] = fertilityStats.average();
        JSONencoder["soilMoisture"] = moistureStats.average();
        JSONencoder["ip"] = "crossbaronx.thddns.net:6064";
        JSONencoder["ambientLight"] = 2564;
        char JSONmessageBuffer[150];
        JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
        Serial.println(JSONmessageBuffer);

        HTTPClient http;
        http.setTimeout(20000);
        http.begin("https://hello-api.careerity.me/sensorRoutes/greenHouseSensor", "EC:BB:33:AB:B4:F4:5B:A0:76:F3:F1:5B:FE:EC:BD:16:17:5C:22:47");
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST(JSONmessageBuffer);
        String payload = http.getString();
        Serial.print("http result: ");
        Serial.println(httpCode);
        Serial.println(String(http.errorToString(httpCode)));
        Serial.print("Payload: ");
        Serial.println(payload);
        http.end();

        // HTTPClient http;
        // http.setTimeout(1000);
        // http.begin("http://192.168.1.151:3000/sensorRoutes/greenHouseSensor");
        // http.addHeader("Content-Type", "application/json");
        // int httpCode = http.POST(JSONmessageBuffer);
        // String payload = http.getString();
        // Serial.print("http result: ");
        // Serial.println(httpCode);
        // Serial.println(String(http.errorToString(httpCode)));
        // Serial.print("Payload: ");
        // Serial.println(payload);
        // http.end();

        temperatureStats.clear();
        humidityStats.clear();
        fertilityStats.clear();
        moistureStats.clear();
}

int waterPumpControl(String command)
{
        int state = command.toInt();
        digitalWrite(RE_IN_PIN4, state);
        return 1;
}

int fertilityPumpControl(String command)
{
        int state = command.toInt();
        digitalWrite(RE_IN_PIN2, state);
        return 1;
}

int moisturePumpControl(String command)
{
        int state = command.toInt();
        digitalWrite(RE_IN_PIN1, state);
        return 1;
}