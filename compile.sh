#!/bin/bash

echo "Creating resource pack..."
node install.js

echo "Moving LICENSE..."
mv LICENSE pack/

echo "Zipping..."
zip -r resource-pack.zip pack/*