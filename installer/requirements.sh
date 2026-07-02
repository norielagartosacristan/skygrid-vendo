#!/bin/bash

set -e

echo "========================================"
echo "Installing SkyGrid Requirements..."
echo "========================================"

sudo apt install -y \
curl \
wget \
git \
unzip \
zip \
build-essential \
software-properties-common \
ca-certificates \
gnupg \
lsb-release \
nano \
net-tools \
bridge-utils \
network-manager \
dnsmasq \
hostapd \
nftables \
openssl

echo ""
echo "========================================"
echo "Requirements Installed Successfully!"
echo "========================================"