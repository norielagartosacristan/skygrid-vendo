#pragma once
#include <Arduino.h>

struct DeviceConfig
{
    String chipId;          // Auto-generated ID ng ESP8266 para sa auto-detect ng server
    String machineName;     // Pangalan ng vendo (e.g., "Vendo-Node-1")

    // WiFi Settings para makakonekta sa Main AP ng server
    String ssid;
    String password;

    // SkyGrid Controller (Dito isesend ang coin/pulse signals)
    String serverIP;
    uint16_t serverPort;

    bool enabled;
};

extern DeviceConfig config;