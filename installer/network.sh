#!/bin/bash

set -e

echo "========================================"
echo " SkyGrid Network Configuration"
echo "========================================"

echo ""
echo "Detecting network interfaces..."

INTERFACES=$(ip -o link show | awk -F': ' '{print $2}' | grep -v lo)

echo ""
echo "Available Interfaces:"
echo "----------------------------"

echo "$INTERFACES"

echo "----------------------------"

WAN=""

for iface in $INTERFACES
do
    if [[ "$iface" != "lo" ]]; then
        WAN=$iface
        break
    fi
done

echo ""
echo "Selected WAN Interface: $WAN"

echo ""
echo "Default LAN Configuration"

echo "IP Address : 10.0.0.1"
echo "Subnet     : 255.255.255.0"
echo "DHCP Start : 10.0.0.100"
echo "DHCP End   : 10.0.0.254"

echo ""
echo "Network configuration completed."