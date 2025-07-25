#!/bin/bash

# Build Optimization Script for AWS Amplify
# This script helps manage memory usage during the build process

echo "🚀 Starting build optimization..."

# Set memory limits
export NODE_OPTIONS="--max-old-space-size=14336 --max-semi-space-size=512"
export GENERATE_SOURCEMAP=false
export DISABLE_ESLINT_PLUGIN=true
export CI=true
export NEXT_TELEMETRY_DISABLED=1

# Clean up before build
echo "🧹 Cleaning up build artifacts..."
rm -rf .next/cache/**/* 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

# Monitor memory usage during build
echo "💾 Current memory usage:"
free -h 2>/dev/null || echo "Memory info not available"

# Run the build
echo "🔨 Starting Next.js build..."
npm run build

# Clean up memory-intensive binaries after build
echo "🧹 Cleaning up post-build..."
rm -f node_modules/@swc/core-linux-x64-gnu/swc.linux-x64-gnu.node 2>/dev/null || true
rm -f node_modules/@swc/core-linux-x64-musl/swc.linux-x64-musl.node 2>/dev/null || true
rm -f node_modules/@esbuild/linux-x64/bin/esbuild 2>/dev/null || true

echo "✅ Build optimization complete!" 