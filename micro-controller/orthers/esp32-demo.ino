#include <WiFi.h>
#include <HTTPClient.h>
#include <TaskScheduler.h>
#include <Statistic.h>
#include <aREST.h>

#define LISTEN_PORT 80

const char *SSID = "aisfibre_2.4G";
const char *SSID_PASSWORD = "molena01";

aREST rest = aREST();
Scheduler runner;
WiFiServer server(LISTEN_PORT);

void sendData();

Task t1(5000, TASK_FOREVER, &sendData);

void setup(void)
{
        Serial.begin(115200);

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

        runner.init();
        runner.addTask(t1);
        t1.enable();

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
        runner.execute();
}

void sendData()
{
        Serial.println("Function \"sendData\" has been called.");
}
