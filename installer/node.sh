#!/bin/bash

set -e

echo "========================================"
echo " Installing Node.js 22 LTS"
echo "========================================"

# Install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

echo ""
echo "========================================"
echo " Node.js Installation Complete"
echo "========================================"

echo ""
echo "Installed Versions:"
echo "----------------------------"

node -v
npm -v

echo "----------------------------"