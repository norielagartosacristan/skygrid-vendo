#!/bin/bash

set -e

echo "========================================"
echo " Installing SkyGrid Dashboard"
echo "========================================"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_DIR/client"

echo ""
echo "Installing NPM packages..."

npm install

echo ""
echo "Building React Dashboard..."

npm run build

echo ""
echo "========================================"
echo " Dashboard Build Complete"
echo "========================================"