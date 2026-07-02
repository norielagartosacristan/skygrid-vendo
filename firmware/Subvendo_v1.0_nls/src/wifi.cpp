#include "wifi.h"

#include <ESP8266WiFi.h>
#include <WiFiManager.h>

bool setupWiFi()
{
    Serial.println();
    Serial.println("==============================");
    Serial.println(" SkyGrid SubVendo Boot");
    Serial.println("==============================");

    WiFiManager wm;

    wm.setConfigPortalTimeout(180);

    String mac = WiFi.macAddress();
    mac.replace(":", "");

    String apName = "SkyGrid-";

    apName += WiFi.macAddress();
    apName.replace(":", "");

    bool connected = wm.autoConnect(apName.c_str());

    if (!connected)
    {
        Serial.println("Unable to connect.");

        return false;
    }

    Serial.println();
    Serial.println("WiFi Connected!");

    Serial.print("SSID : ");
    Serial.println(WiFi.SSID());

    Serial.print("IP   : ");
    Serial.println(WiFi.localIP());

    Serial.print("MAC  : ");
    Serial.println(WiFi.macAddress());

    return true;
}