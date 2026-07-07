#include "captive.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// I-set ang IP ng Orange Pi/Server mo rito at ang port ng Express backend mo
const String SERVER_IP = "10.0.0.1"; 
const String SERVER_PORT = "3000";
const String BASE_URL = "http://" + SERVER_IP + ":" + SERVER_PORT;

void registerSubvendo() {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        
        String url = BASE_URL + "/api/machine/register";
        String macAddr = WiFi.macAddress();
        // Payload base sa kailangan ng iyong Prisma/Backend schema
        String jsonPayload = "{\"macAddress\":\"" + macAddr + "\", \"type\":\"SUBVENDO\"}";

        Serial.println("[HTTP] Registering machine to server...");
        http.begin(client, url);
        http.addHeader("Content-Type", "application/json");
        
        int httpResponseCode = http.POST(jsonPayload);
        
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.printf("[HTTP] Registration Response: %d - %s\n", httpResponseCode, response.c_str());
        } else {
            Serial.printf("[HTTP] Registration Failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
        }
        http.end();
    } else {
        Serial.println("[HTTP] Cannot register, WiFi not connected.");
    }
}

void sendCoinsToServer(int pulses) {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        
        String url = BASE_URL + "/api/machine/insert-coin";
        String jsonPayload = "{\"macAddress\":\"" + WiFi.macAddress() + "\", \"pulses\":" + String(pulses) + "}";

        Serial.printf("[HTTP] Sending %d pulses to server...\n", pulses);
        http.begin(client, url);
        http.addHeader("Content-Type", "application/json");
        
        int httpResponseCode = http.POST(jsonPayload);
        
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.printf("[HTTP] Coin Sent Response: %d - %s\n", httpResponseCode, response.c_str());
        } else {
            Serial.printf("[HTTP] Failed to send coins, error: %s\n", http.errorToString(httpResponseCode).c_str());
        }
        http.end();
    } else {
        Serial.println("[HTTP] Disconnected from WiFi. Coin data not sent.");
    }
}