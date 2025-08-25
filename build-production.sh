#!/bin/bash

# Production Build Script
echo "🚀 Building for production..."

# Ensure production environment
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://api.medh.co

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf out

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Verify the build
echo "✅ Build completed!"
echo "📊 Build size:"
du -sh .next

echo "🌐 API URL configured: https://api.medh.co"
echo "🚀 Ready for deployment!"
