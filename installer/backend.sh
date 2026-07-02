#!/bin/bash

set -e

echo "========================================"
echo " Installing SkyGrid Backend"
echo "========================================"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_DIR/server"

echo ""
echo "Installing NPM packages..."

npm install

echo ""
echo "Generating Prisma Client..."

npx prisma generate

echo ""
echo "Running Prisma Migration..."

npx prisma migrate deploy

echo ""
echo "Building Backend..."

npm run build

echo ""
echo "========================================"
echo " Backend Installed Successfully"
echo "========================================"