#!/bin/bash

echo "Configuring firewall..."

sudo systemctl enable nftables

sudo systemctl start nftables

echo "Firewall enabled."