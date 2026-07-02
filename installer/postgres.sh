#!/bin/bash

echo "Installing PostgreSQL..."

sudo apt install -y postgresql postgresql-contrib

sudo systemctl enable postgresql

sudo systemctl start postgresql