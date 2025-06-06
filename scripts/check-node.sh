#!/bin/bash
# Node.js version check script

echo "=== Node.js Environment Check ==="
echo ""

# Check if .nvmrc exists
if [ -f .nvmrc ]; then
  REQUIRED_VERSION=$(cat .nvmrc)
  echo "Required Node.js version (from .nvmrc): v$REQUIRED_VERSION"
else
  echo "❌ No .nvmrc file found"
  exit 1
fi

# Check current Node.js version
if command -v node >/dev/null 2>&1; then
  CURRENT_VERSION=$(node -v)
  echo "Current Node.js version: $CURRENT_VERSION"
else
  echo "❌ Node.js is not installed or not in PATH"
  exit 1
fi

# Check if versions match (roughly)
CURRENT_MAJOR=$(echo $CURRENT_VERSION | sed 's/v//' | cut -d. -f1)
REQUIRED_MAJOR=$(echo $REQUIRED_VERSION | cut -d. -f1)

if [ "$CURRENT_MAJOR" = "$REQUIRED_MAJOR" ]; then
  echo "✅ Node.js major version matches (v$REQUIRED_MAJOR)"
else
  echo "⚠️  Node.js major version mismatch: required v$REQUIRED_MAJOR, current v$CURRENT_MAJOR"
  
  # Check if nvm is available
  if command -v nvm >/dev/null 2>&1; then
    echo ""
    echo "💡 To fix this, run:"
    echo "   nvm install $REQUIRED_VERSION"
    echo "   nvm use $REQUIRED_VERSION"
  else
    echo ""
    echo "💡 To fix this:"
    echo "   1. Install Node.js v$REQUIRED_VERSION from https://nodejs.org/"
    echo "   2. Or install nvm and run: nvm install $REQUIRED_VERSION && nvm use $REQUIRED_VERSION"
  fi
fi

# Check npm version
if command -v npm >/dev/null 2>&1; then
  NPM_VERSION=$(npm -v)
  echo "npm version: v$NPM_VERSION"
else
  echo "⚠️  npm is not available"
fi

# Check package.json engines
if [ -f package.json ]; then
  echo ""
  echo "=== Package.json engines constraint ==="
  node -e "
    const pkg = require('./package.json');
    if (pkg.engines && pkg.engines.node) {
      console.log('Node.js constraint:', pkg.engines.node);
    } else {
      console.log('No Node.js constraint found in package.json');
    }
  " 2>/dev/null || echo "Could not read package.json engines"
fi

echo ""
echo "=== Environment Status ==="
if [ "$CURRENT_MAJOR" = "$REQUIRED_MAJOR" ]; then
  echo "✅ Environment is ready for development"
else
  echo "❌ Environment needs Node.js version update"
  exit 1
fi 