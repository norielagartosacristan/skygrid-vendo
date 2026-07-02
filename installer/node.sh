#!/bin/bash

echo "Installing Node.js..."

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

sudo apt install -y nodejs

node -v

npm -v