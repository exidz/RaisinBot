#!/bin/bash

echo "Installing Dependencies"
sudo apt update
sudo apt upgrade -y

sudo apt-get install curl -y
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - 
sudo apt-get install nodejs -y
node -v
npm install
npm audit fix --force
echo "Install all dependency sucessfully"
