#!/bin/bash

set -e

echo "========================================"
echo " Installing PostgreSQL"
echo "========================================"

sudo apt update

sudo apt install -y postgresql postgresql-contrib

sudo systemctl enable postgresql

sudo systemctl start postgresql

echo ""
echo "Checking PostgreSQL..."

sudo systemctl status postgresql --no-pager

echo ""
echo "Creating SkyGrid Database..."

sudo -u postgres psql <<EOF
CREATE DATABASE skygrid_vendo;
EOF

echo ""
echo "========================================"
echo " PostgreSQL Installed Successfully"
echo "========================================"

psql --version