#pragma once

#include <Arduino.h>

struct DeviceConfig
{
    String chipId;

    String machineName;

    String parentInterface;

    uint16_t vlanId;

    String ipMode;

    String ipAddress;

    String subnetMask;

    String gateway;

    String dns1;

    String dns2;

    uint16_t clientStartIp;

    uint16_t clientEndIp;

    String bandwidthProfile;

    String portal;

    bool enabled;
};

extern DeviceConfig config;