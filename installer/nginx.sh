#!/bin/bash

set -e

echo "========================================"
echo " Installing Nginx"
echo "========================================"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ""
echo "Installing Nginx..."

sudo apt install -y nginx

echo ""
echo "Creating Web Directory..."

sudo mkdir -p /var/www/skygrid

echo ""
echo "Copying React Build..."

sudo rm -rf /var/www/skygrid/*
sudo cp -r "$PROJECT_DIR/client/dist/"* /var/www/skygrid/

echo ""
echo "Copying Nginx Configuration..."

sudo cp "$PROJECT_DIR/installer/nginx.conf" /etc/nginx/sites-available/skygrid

sudo rm -f /etc/nginx/sites-enabled/default

sudo ln -sf /etc/nginx/sites-available/skygrid /etc/nginx/sites-enabled/skygrid

echo ""
echo "Testing Nginx Configuration..."

sudo nginx -t

echo ""
echo "Restarting Nginx..."

sudo systemctl enable nginx
sudo systemctl restart nginx

echo ""
echo "========================================"
echo " Nginx Installed Successfully"
echo "========================================"