#include "api.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// --- SERVER CONFIGURATION ---
// I-set ang tamang IP ng Express backend mo (halimbawa ay 10.0.0.1)
const String SERVER_IP = "10.0.0.1"; 
const String SERVER_PORT = "3000";
const String BASE_URL = "http://" + SERVER_IP + ":" + SERVER_PORT;

void registerSubvendo() {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        
        String url = BASE_URL + "/api/machine/register";
        String macAddr = WiFi.macAddress();
        
        // Payload na babasahin ng Express/Prisma mo
        String jsonPayload = "{\"macAddress\":\"" + macAddr + "\", \"type\":\"SUBVENDO\"}";

        Serial.println("[API] Registering subvendo to server...");
        http.begin(client, url);
        http.addHeader("Content-Type", "application/json");
        
        int httpResponseCode = http.POST(jsonPayload);
        
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.printf("[API] Registration Response: %d - %s\n", httpResponseCode, response.c_str());
        } else {
            Serial.printf("[API] Registration Failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
        }
        http.end();
    } else {
        Serial.println("[API] Cannot register, WiFi not connected.");
    }
}

void sendCoinsToServer(int pulses) {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        
        String url = BASE_URL + "/api/machine/insert-coin";
        String jsonPayload = "{\"macAddress\":\"" + WiFi.macAddress() + "\", \"pulses\":" + String(pulses) + "}";

        Serial.printf("[API] Sending %d pulses to backend...\n", pulses);
        http.begin(client, url);
        http.addHeader("Content-Type", "application/json");
        
        int httpResponseCode = http.POST(jsonPayload);
        
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.printf("[API] Coin Sent Response: %d - %s\n", httpResponseCode, response.c_str());
        } else {
            Serial.printf("[API] Failed to send coins, error: %s\n", http.errorToString(httpResponseCode).c_str());
        }
        http.end();
    } else {
        Serial.println("[API] Disconnected from WiFi. Coin drop ignored by server.");
    }
}