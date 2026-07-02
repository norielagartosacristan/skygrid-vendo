#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

clear

echo "========================================"
echo "      SkyGrid OS Installer v1.0"
echo "========================================"
echo ""

echo "[1/10] Updating Ubuntu..."
sudo apt update
sudo apt upgrade -y

echo ""
echo "[2/10] Installing Requirements..."
bash "$SCRIPT_DIR/requirements.sh"

echo ""
echo "[3/10] Installing Node.js..."
bash "$SCRIPT_DIR/node.sh"

echo ""
echo "[4/10] Installing PostgreSQL..."
bash "$SCRIPT_DIR/postgres.sh"

echo ""
echo "[5/10] Installing Backend..."
bash "$SCRIPT_DIR/backend.sh"

echo ""
echo "[6/10] Installing Dashboard..."
bash "$SCRIPT_DIR/frontend.sh"

echo ""
echo "[7/10] Configuring Nginx..."
bash "$SCRIPT_DIR/nginx.sh"

echo ""
echo "[8/10] Configuring Network..."
bash "$SCRIPT_DIR/network.sh"

echo ""
echo "[9/10] Configuring Firewall..."
bash "$SCRIPT_DIR/firewall.sh"

echo ""
echo "[10/10] Creating SkyGrid Service..."
bash "$SCRIPT_DIR/service.sh"

echo ""
echo "========================================"
echo " SkyGrid Installation Complete!"
echo "========================================"
echo ""
echo "Please reboot your Mini PC."