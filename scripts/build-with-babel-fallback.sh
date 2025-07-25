#!/bin/bash

# Simple Build Script with Babel Fallback
# This script forces Next.js to use Babel instead of SWC

set -e

echo "🔧 Building with Babel fallback (no SWC)..."

# Set environment variables to disable SWC completely
export NEXT_FORCE_SWC=false
export SWC_DISABLE_NEXT_SWC=1
export DISABLE_SWC=true
export USE_SWC=false
export NODE_OPTIONS="--max-old-space-size=16384"
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export CI=true

# Ensure npm allows optional packages
npm config set optional true
npm config set legacy-peer-deps true

echo "Environment variables set:"
echo "NEXT_FORCE_SWC=$NEXT_FORCE_SWC"
echo "SWC_DISABLE_NEXT_SWC=$SWC_DISABLE_NEXT_SWC"
echo "NODE_OPTIONS=$NODE_OPTIONS"

# Clean any existing build
echo "🧹 Cleaning previous build..."
rm -rf .next || true

# Run the build with explicit Babel configuration
echo "🚀 Starting Next.js build with Babel..."
npm run build:babel

# Verify build
if [ -d ".next" ] && [ -f ".next/package.json" ]; then
    echo "✅ Build completed successfully!"
    ls -la .next/
else
    echo "❌ Build failed - .next directory not found or incomplete"
    exit 1
fi

echo "✅ Build with Babel fallback completed!" 