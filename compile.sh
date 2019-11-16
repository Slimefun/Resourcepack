#!/bin/bash

echo "Creating resource pack..."
node generate.js

echo "Moving LICENSE..."
mv LICENSE pack/
