#!/bin/bash

echo "Installing Backend..."

cd ../server

npm install

npx prisma generate

npm run build