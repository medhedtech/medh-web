#!/bin/bash

# Simple Build Script with Babel Fallback
# This script forces Next.js to use Babel instead of SWC

set -e

echo "🔧 Building with Babel fallback (no SWC)..."

# Set environment variables to disable SWC
export NEXT_FORCE_SWC=false
export SWC_DISABLE_NEXT_SWC=1
export NODE_OPTIONS="--max-old-space-size=6144"
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export CI=true

echo "Environment variables set:"
echo "NEXT_FORCE_SWC=$NEXT_FORCE_SWC"
echo "SWC_DISABLE_NEXT_SWC=$SWC_DISABLE_NEXT_SWC"
echo "NODE_OPTIONS=$NODE_OPTIONS"

# Clean any existing build
echo "🧹 Cleaning previous build..."
rm -rf .next || true

# Run the build
echo "🚀 Starting Next.js build with Babel..."
npm run build

# Verify build
if [ -d ".next" ] && [ -f ".next/package.json" ]; then
    echo "✅ Build completed successfully!"
    ls -la .next/
else
    echo "❌ Build failed - .next directory not found or incomplete"
    exit 1
fi

echo "✅ Build with Babel fallback completed!" 