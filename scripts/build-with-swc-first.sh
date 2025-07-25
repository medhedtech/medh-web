#!/bin/bash

# Build Script with SWC First, Babel Fallback
# This script tries SWC first, falls back to Babel if SWC fails

set -e

echo "🚀 Building with SWC first, Babel fallback if needed..."

# Set environment variables for SWC-first approach
export NODE_OPTIONS="--max-old-space-size=16384"
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export CI=true

# Try SWC first (default Next.js behavior)
echo "🎯 Attempting build with SWC (default)..."

# Package manager configuration - keep npm configs for compatibility
npm config set optional true
npm config set legacy-peer-deps true

echo "Environment variables set:"
echo "NODE_OPTIONS=$NODE_OPTIONS"
echo "NODE_ENV=$NODE_ENV"

# Clean any existing build
echo "🧹 Cleaning previous build..."
rm -rf .next || true

# Function to try SWC build first
try_swc_build() {
    echo "🎯 Attempting build with SWC..."
    if pnpm run build; then
        echo "✅ SWC build succeeded!"
        return 0
    else
        echo "❌ SWC build failed, will try Babel fallback..."
        return 1
    fi
}

# Function for Babel fallback
try_babel_build() {
    echo "🔧 Falling back to Babel build..."
    # Set environment variables to disable SWC
    export NEXT_FORCE_SWC=false
    export SWC_DISABLE_NEXT_SWC=1
    export DISABLE_SWC=true
    
    echo "Babel fallback environment variables:"
    echo "NEXT_FORCE_SWC=$NEXT_FORCE_SWC"
    echo "SWC_DISABLE_NEXT_SWC=$SWC_DISABLE_NEXT_SWC"
    
    # Clean and try with Babel
    rm -rf .next || true
    pnpm run build:babel
}

# Try SWC first, fallback to Babel if needed
if try_swc_build; then
    echo "🚀 Build completed successfully with SWC!"
else
    echo "⚠️ SWC failed, trying Babel fallback..."
    if try_babel_build; then
        echo "🚀 Build completed successfully with Babel fallback!"
    else
        echo "❌ Both SWC and Babel builds failed!"
        exit 1
    fi
fi

# Verify build
if [ -d ".next" ] && [ -f ".next/package.json" ]; then
    echo "✅ Build completed successfully!"
    ls -la .next/
else
    echo "❌ Build failed - .next directory not found or incomplete"
    exit 1
fi

echo "✅ Build with Babel fallback completed!" 