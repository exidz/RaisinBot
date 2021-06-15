#!/bin/bash

echo "Installing Dependencies"
sudo apt update
sudo apt upgrade -y

sudo apt-get install curl -y
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - 
sudo apt-get install nodejs -y
node -v
sudo apt install git -y
cd $HOME
git clone https://github.com/exidz/RaisinBot.git
cd RaisinBot
npm install
npm audit fix --force
echo "Install all dependency sucessfully"
