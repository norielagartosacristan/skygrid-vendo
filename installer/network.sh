#!/bin/bash

echo "Preparing network services..."

sudo systemctl enable NetworkManager

sudo systemctl start NetworkManager

echo "NetworkManager started."