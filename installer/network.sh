#!/bin/bash

set -e

echo "========================================"
echo " SkyGrid Network Configuration"
echo "========================================"

echo ""
echo "Detecting WAN interface..."

WAN=$(ip route | awk '/default/ {print $5; exit}')

echo "Selected WAN Interface: $WAN"

echo ""
echo "Creating default Management VLAN..."

MGMT_VLAN=22
MGMT_IF="${WAN}.${MGMT_VLAN}"

# Create VLAN if not exists
if ip link show "$MGMT_IF" >/dev/null 2>&1; then
    echo "[WARN] VLAN already exists: $MGMT_IF"
else
    ip link add link "$WAN" name "$MGMT_IF" type vlan id "$MGMT_VLAN"
fi

ip link set "$MGMT_IF" up

ip addr flush dev "$MGMT_IF" || true
ip addr add 10.0.0.1/24 dev "$MGMT_IF"

echo ""
echo "Management Interface Created"
echo "----------------------------"
echo "Interface : $MGMT_IF"
echo "VLAN ID   : 22"
echo "IP Address: 10.0.0.1/24"
echo "----------------------------"

echo ""
echo "Enabling IPv4 Forwarding..."

sysctl -w net.ipv4.ip_forward=1

if ! grep -q "net.ipv4.ip_forward=1" /etc/sysctl.conf; then
    echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
fi