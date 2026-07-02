#!/bin/bash

echo "Installing required packages..."

sudo apt install -y \
curl \
git \
wget \
unzip \
build-essential \
postgresql \
postgresql-contrib \
hostapd \
dnsmasq \
nftables \
bridge-utils \
net-tools \
network-manager

echo ""
echo "Installing Node.js..."

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

sudo apt install -y nodejs

echo ""
echo "Installed Versions"

node -v

npm -v