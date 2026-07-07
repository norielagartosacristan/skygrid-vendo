#include <Arduino.h>
#include "wifi.h"
#include "api.h" // <- I-include ang bagong api header

const int COIN_PIN = D2; 
volatile int pulseCount = 0;
unsigned long lastPulseTime = 0;
const int PULSE_TIMEOUT = 500; 

ICACHE_RAM_ATTR void countPulse() {
    pulseCount++;
    lastPulseTime = millis();
}

void setup() {
    Serial.begin(115200);
    
    pinMode(COIN_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(COIN_PIN), countPulse, FALLING);

    // Patakbuhin ang WiFiManager mo
    if (!setupWiFi()) {
        Serial.println("WiFi Setup Failed. Restarting...");
        delay(3000);
        ESP.restart();
    }

    // Awtomatikong mag-register sa SkyGrid backend pagka-boot at pagka-konek sa WiFi
    registerSubvendo();
}

void loop() {
    if (pulseCount > 0 && (millis() - lastPulseTime > PULSE_TIMEOUT)) {
        int totalPulses = pulseCount;
        pulseCount = 0; 

        Serial.printf("Coin Pulse Detected: %d\n", totalPulses);
        
        // I-send ang signal sa Express API gamit ang nasa api.cpp
        sendCoinsToServer(totalPulses);
    }
}