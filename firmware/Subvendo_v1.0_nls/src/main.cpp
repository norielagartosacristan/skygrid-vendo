#include <Arduino.h>

#include "wifi.h"

void setup()
{
    Serial.begin(115200);

    delay(1000);

    setupWiFi();
}

void loop()
{

}