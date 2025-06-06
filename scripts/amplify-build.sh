#!/bin/bash
# Amplify build script

# Print Node.js and npm versions
echo "Build script starting..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Expected Node version from .nvmrc: $(cat .nvmrc 2>/dev/null || echo 'No .nvmrc found')"

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

# Verify Node.js version compatibility
echo "Verifying Node.js version compatibility..."
REQUIRED_VERSION=$(cat .nvmrc 2>/dev/null || echo "20.19.2")
CURRENT_VERSION=$(node -v | sed 's/v//')
echo "Required Node.js version: $REQUIRED_VERSION"
echo "Current Node.js version: $CURRENT_VERSION"

# Configure npm to suppress certain warnings and use legacy-peer-deps
echo "Configuring npm settings..."
npm config set legacy-peer-deps true
npm config set loglevel warn

# Build the application with increased memory
echo "Building the application..."
echo "Setting Node.js max-old-space-size to 4096MB..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build completed successfully!"
else
  echo "Build failed!"
  exit 1
fi 