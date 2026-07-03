#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

clear

echo "========================================"
echo "      SkyGrid OS Installer v1.0"
echo "========================================"
echo ""

# Check root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root."
    echo "Example:"
    echo "sudo bash installer.sh"
    exit 1
fi

echo "[1/10] Updating Ubuntu..."
bash "$SCRIPT_DIR/update.sh"

echo "[2/10] Installing Requirements..."
bash "$SCRIPT_DIR/requirements.sh"

echo "[3/10] Installing Node.js..."
bash "$SCRIPT_DIR/node.sh"

echo "[4/10] Installing PostgreSQL..."
bash "$SCRIPT_DIR/postgres.sh"

echo "[5/10] Installing Backend..."
bash "$SCRIPT_DIR/backend.sh"

echo "[6/10] Installing Dashboard..."
bash "$SCRIPT_DIR/frontend.sh"

echo "[7/10] Configuring Nginx..."
bash "$SCRIPT_DIR/nginx.sh"

echo "[8/10] Configuring Network..."
bash "$SCRIPT_DIR/network.sh"

echo "[9/10] Configuring Firewall..."
bash "$SCRIPT_DIR/firewall.sh"

echo "[10/10] Creating Services..."
bash "$SCRIPT_DIR/service.sh"

echo ""
echo "========================================"
echo "   SkyGrid Installed Successfully!"
echo "========================================"
echo ""
echo "Dashboard : http://10.0.0.1/admin"
echo "API       : http://10.0.0.1/api"
echo ""
echo "Default Login"
echo "Email    : admin@skygrid.com"
echo "Password : NS?Formula@01"
echo ""
echo "Run:"
echo "reboot"
echo ""