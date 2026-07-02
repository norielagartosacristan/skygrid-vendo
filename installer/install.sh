#!/bin/bash

echo "======================================="
echo "        SkyGrid Installer v1.0"
echo "======================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "Updating Ubuntu..."

sudo apt update
sudo apt upgrade -y

echo ""
echo "Installing requirements..."

bash "$SCRIPT_DIR/requirements.sh"

echo ""
echo "Configuring firewall..."

bash "$SCRIPT_DIR/firewall.sh"

echo ""
echo "Preparing network..."

bash "$SCRIPT_DIR/network.sh"

echo ""
echo "SkyGrid installation completed."
echo ""
echo "Next step:"
echo "Install Backend"
echo "Install Dashboard"
echo "Configure PostgreSQL"