#!/bin/bash
# Amplify build script

# Print environment variables (without sensitive values)
echo "Environment variables:"
env | grep -v "SECRET\|KEY\|PASSWORD\|TOKEN" | sort

# Check if .env.production exists
if [ -f .env.production ]; then
  echo "Using .env.production file"
  cp .env.production .env
else
  echo "No .env.production file found, using .env.local if available"
  if [ -f .env.local ]; then
    cp .env.local .env
  fi
fi

# Install dependencies
echo "Installing dependencies..."
npm ci --cache .npm --prefer-offline

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build completed successfully!"
else
  echo "Build failed!"
  exit 1
fi 