#!/bin/bash

# Fix SWC Build Script for AWS CodeBuild
# This script ensures proper SWC binary installation and handles fallbacks

set -e

echo "🔧 Starting SWC Build Fix for AWS CodeBuild..."

# Function to check if SWC binaries are available
check_swc_binaries() {
    echo "🔍 Checking for SWC binaries..."
    
    local swc_found=false
    
    # Check for Linux x64 GNU binary
    if [ -f "node_modules/@next/swc-linux-x64-gnu/next-swc.linux-x64-gnu.node" ]; then
        echo "✅ Found @next/swc-linux-x64-gnu binary"
        swc_found=true
    fi
    
    # Check for Linux x64 MUSL binary
    if [ -f "node_modules/@next/swc-linux-x64-musl/next-swc.linux-x64-musl.node" ]; then
        echo "✅ Found @next/swc-linux-x64-musl binary"
        swc_found=true
    fi
    
    # Check for fallback packages
    if [ -d "node_modules/next/next-swc-fallback" ]; then
        echo "✅ Found Next.js SWC fallback directory"
    fi
    
    if [ "$swc_found" = false ]; then
        echo "⚠️  No SWC binaries found, will attempt installation"
        return 1
    else
        echo "✅ SWC binaries are available"
        return 0
    fi
}

# Function to install SWC binaries
install_swc_binaries() {
    echo "📦 Installing SWC binaries for Linux x64..."
    
    # Try to install the specific SWC binaries
    npm install --no-save --no-audit --prefer-offline @next/swc-linux-x64-gnu@$(npm list next --depth=0 --json | jq -r '.dependencies.next.version') || {
        echo "⚠️  Failed to install @next/swc-linux-x64-gnu, trying alternative..."
        npm install --no-save --no-audit @next/swc-linux-x64-musl@$(npm list next --depth=0 --json | jq -r '.dependencies.next.version') || {
            echo "⚠️  Failed to install SWC binaries, Next.js will use Babel fallback"
        }
    }
}

# Function to verify build environment
verify_environment() {
    echo "🔍 Verifying build environment..."
    
    echo "Node.js version: $(node -v)"
    echo "npm version: $(npm -v)"
    echo "Next.js version: $(npm list next --depth=0 2>/dev/null | grep next || echo 'Not found')"
    echo "Architecture: $(uname -m)"
    echo "OS: $(uname -s)"
    echo "Platform: $(node -p 'process.platform')"
    echo "Architecture (Node): $(node -p 'process.arch')"
    
    # Check available memory
    if command -v free >/dev/null 2>&1; then
        echo "Memory info:"
        free -h
    fi
    
    # Check disk space
    echo "Disk space:"
    df -h . || true
}

# Function to set build environment variables
set_build_env() {
    echo "🔧 Setting build environment variables..."
    
    export NODE_ENV=production
    export NODE_OPTIONS="--max-old-space-size=6144"
    export NEXT_TELEMETRY_DISABLED=1
    export CI=true
    
    # Disable SWC if binaries are not available
    if ! check_swc_binaries; then
        echo "⚠️  Disabling SWC due to missing binaries"
        export NEXT_FORCE_SWC=false
        export SWC_DISABLE_NEXT_SWC=1
    fi
    
    echo "Environment variables set:"
    echo "NODE_ENV=$NODE_ENV"
    echo "NODE_OPTIONS=$NODE_OPTIONS"
    echo "NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED"
    echo "CI=$CI"
    echo "NEXT_FORCE_SWC=${NEXT_FORCE_SWC:-not set}"
    echo "SWC_DISABLE_NEXT_SWC=${SWC_DISABLE_NEXT_SWC:-not set}"
}

# Function to run the build with retries
build_with_retries() {
    echo "🚀 Starting Next.js build with retries..."
    
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "📦 Build attempt $attempt of $max_attempts..."
        
        if npm run build; then
            echo "✅ Build successful on attempt $attempt!"
            
            # Verify build output
            if [ -d ".next" ]; then
                echo "✅ .next directory created"
                ls -la .next/ | head -10
                
                # Check for essential build files
                if [ -f ".next/package.json" ] && [ -d ".next/static" ]; then
                    echo "✅ Build appears complete with all necessary files"
                    return 0
                else
                    echo "⚠️  Build directory exists but may be incomplete"
                fi
            else
                echo "❌ .next directory not found after build"
                return 1
            fi
            
            return 0
        else
            echo "❌ Build attempt $attempt failed"
            
            if [ $attempt -lt $max_attempts ]; then
                echo "🔄 Retrying in 5 seconds..."
                sleep 5
                
                # Try to install SWC binaries before retry
                if [ $attempt -eq 1 ]; then
                    install_swc_binaries
                fi
                
                # Clear Next.js cache before retry
                echo "🧹 Clearing Next.js cache..."
                rm -rf .next/cache || true
            fi
        fi
        
        attempt=$((attempt + 1))
    done
    
    echo "❌ All build attempts failed!"
    return 1
}

# Main execution
main() {
    echo "🚀 Starting SWC Build Fix Script..."
    
    # Verify environment
    verify_environment
    
    # Check and install SWC binaries if needed
    if ! check_swc_binaries; then
        install_swc_binaries
    fi
    
    # Set environment variables
    set_build_env
    
    # Run build with retries
    build_with_retries
    
    echo "✅ SWC Build Fix Script completed successfully!"
}

# Run main function
main "$@" 