#!/bin/bash

set -e

echo "========================================"
echo " Installing SkyGrid Service"
echo "========================================"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ""
echo "Creating Installation Directory..."

sudo mkdir -p /opt/skygrid

echo ""
echo "Copying Backend..."

sudo rm -rf /opt/skygrid/server

sudo cp -r "$PROJECT_DIR/server" /opt/skygrid/

echo ""
echo "Installing systemd Service..."

sudo cp "$PROJECT_DIR/installer/skygrid.service" \
/etc/systemd/system/

echo ""
echo "Reloading systemd..."

sudo systemctl daemon-reload

echo ""
echo "Enabling SkyGrid..."

sudo systemctl enable skygrid

echo ""
echo "Starting SkyGrid..."

sudo systemctl restart skygrid

echo ""
echo "Checking Service..."

sudo systemctl status skygrid --no-pager

echo ""
echo "========================================"
echo " SkyGrid Service Installed"
echo "========================================"