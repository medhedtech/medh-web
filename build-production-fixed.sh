#!/bin/bash

# Production Build Script - Fixed Version
echo "🚀 Building for production (Fixed Version)..."

# Ensure production environment
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://api.medh.co

# Test config file syntax first
echo "🧪 Testing config file syntax..."
node test-config.js

if [ $? -ne 0 ]; then
    echo "❌ Config file syntax test failed!"
    exit 1
fi

echo "✅ Config file syntax is correct"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf out

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Verify environment variables
echo "🔧 Verifying environment variables..."
if [ "$NODE_ENV" != "production" ]; then
    echo "❌ NODE_ENV is not set to production"
    exit 1
fi

if [ "$NEXT_PUBLIC_API_URL" != "https://api.medh.co" ]; then
    echo "❌ NEXT_PUBLIC_API_URL is not set to production URL"
    exit 1
fi

echo "✅ Environment variables are correct"

# Build the application
echo "🔨 Building application..."
npm run build

# Check build result
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Verify the build
echo "✅ Build completed!"
echo "📊 Build size:"
du -sh .next

echo "🌐 API URL configured: https://api.medh.co"
echo "🚀 Ready for deployment!"

# Create a verification file
cat > .build-verification.txt << EOF
Build completed successfully at $(date)
NODE_ENV: $NODE_ENV
NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL
Build directory: .next
EOF

echo "📝 Build verification file created: .build-verification.txt"
