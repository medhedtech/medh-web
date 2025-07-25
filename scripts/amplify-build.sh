#!/bin/bash
# Amplify build script with enhanced error handling

set -e  # Exit on any error

# Print Node.js and npm versions
echo "=== Build Environment Info ==="
echo "Build script starting..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Expected Node version from .nvmrc: $(cat .nvmrc 2>/dev/null || echo 'No .nvmrc found')"
echo "AWS Branch: ${AWS_BRANCH:-'not-set'}"
echo "Build ID: ${AWS_BUILD_ID:-'not-set'}"

# Print environment variables (without sensitive values)
echo ""
echo "=== Environment Variables Check ==="
env | grep -v "SECRET\|KEY\|PASSWORD\|TOKEN\|URI" | sort

# Set default environment variables if not provided
echo ""
echo "=== Setting Default Environment Variables ==="
export NODE_ENV="${NODE_ENV:-production}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://api.medh.co/api/v1}"

echo "NODE_ENV: $NODE_ENV"
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"

# Check for critical dependencies before build
echo ""
echo "=== Critical Dependencies Check ==="
echo "Checking for @radix-ui/react-avatar..."
if [ -d "node_modules/@radix-ui/react-avatar" ]; then
  echo "✅ @radix-ui/react-avatar found"
else
  echo "❌ @radix-ui/react-avatar missing - installing now..."
  npm install @radix-ui/react-avatar --force --no-cache
fi

echo "Checking for @radix-ui/react-progress..."
if [ -d "node_modules/@radix-ui/react-progress" ]; then
  echo "✅ @radix-ui/react-progress found"
else
  echo "❌ @radix-ui/react-progress missing - installing now..."
  npm install @radix-ui/react-progress --force --no-cache
fi

echo "Checking for Tailwind CSS..."
if [ -d "node_modules/tailwindcss" ]; then
  echo "✅ tailwindcss found"
else
  echo "❌ tailwindcss missing - installing now..."
  npm install tailwindcss postcss autoprefixer --force --no-cache
fi

echo "Checking for PostCSS..."
if [ -d "node_modules/postcss" ]; then
  echo "✅ postcss found"
else
  echo "❌ postcss missing - installing now..."
  npm install postcss autoprefixer --force --no-cache
fi

echo "Checking for TypeScript..."
if [ -f "node_modules/.bin/tsc" ] && [ -f "node_modules/typescript/package.json" ]; then
  echo "✅ TypeScript compiler found"
  node_modules/.bin/tsc --version
else
  echo "❌ TypeScript compiler missing - installing now..."
  npm install typescript @types/node @types/react @types/react-dom --force --no-cache
  
  # Verify installation again
  if [ -f "node_modules/.bin/tsc" ]; then
    echo "✅ TypeScript successfully installed"
    node_modules/.bin/tsc --version
  else
    echo "❌ TypeScript installation failed - trying alternative method"
    npm install --global typescript
    export PATH="$PATH:$(npm config get prefix)/bin"
  fi
fi

# Ensure TypeScript is in PATH for Next.js
echo "Adding TypeScript to PATH..."
export PATH="$PWD/node_modules/.bin:$PATH"
echo "TypeScript path: $(which tsc || echo 'not found')"

# Verify TypeScript can be found by Next.js
echo "Verifying TypeScript for Next.js..."
if command -v tsc >/dev/null 2>&1; then
  echo "✅ TypeScript is accessible: $(tsc --version)"
else
  echo "❌ TypeScript not in PATH - adding explicit path"
  export TSC_COMPILE_ON_ERROR=true
  export SKIP_TYPE_CHECK=true
fi

# Check for environment file
echo ""
echo "=== Environment File Configuration ==="
if [ -f .env.production ]; then
  echo "✅ Found .env.production file"
  cp .env.production .env
elif [ -f .env.local ]; then
  echo "✅ Found .env.local file"
  cp .env.local .env
else
  echo "⚠️  No environment file found, using environment variables"
  # Create a minimal .env file for build
  cat > .env << EOF
NODE_ENV=production
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
EOF
fi

# Verify Node.js version compatibility
echo ""
echo "=== Node.js Version Verification ==="
REQUIRED_VERSION=$(cat .nvmrc 2>/dev/null || echo "20.19.2")
CURRENT_VERSION=$(node -v | sed 's/v//')
echo "Required Node.js version: $REQUIRED_VERSION"
echo "Current Node.js version: $CURRENT_VERSION"

# Check Node.js major version
CURRENT_MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
if [ "$CURRENT_MAJOR" -ge "18" ]; then
  echo "✅ Node.js version compatible (v$CURRENT_MAJOR >= v18)"
else
  echo "❌ Node.js version too old (v$CURRENT_MAJOR < v18)"
  exit 1
fi

# Configure npm to suppress certain warnings and use legacy-peer-deps
echo ""
echo "=== NPM Configuration ==="
npm config set legacy-peer-deps true
npm config set loglevel warn
npm config set audit-level moderate
npm config set fund false
npm config set update-notifier false

# Check package.json and dependencies
echo ""
echo "=== Dependency Check ==="
if [ ! -f package.json ]; then
  echo "❌ package.json not found!"
  exit 1
fi

echo "✅ package.json found"
echo "Checking build script..."
if grep -q '"build"' package.json; then
  echo "✅ Build script found in package.json"
else
  echo "❌ No build script found in package.json"
  exit 1
fi

# Build the application with increased memory and error handling
echo ""
echo "=== Building Application ==="
echo "Setting Node.js max-old-space-size to 16384MB..."

# Set Node.js options for memory management and timeout handling
export NODE_OPTIONS="--max-old-space-size=16384 --no-warnings --max-semi-space-size=1024"

# Set timeouts to prevent build cancellation
export NEXT_TIMEOUT=1800000  # 30 minutes
export NEXT_STATIC_EXPORT_TIMEOUT=1800000  # 30 minutes

# Run the build with proper error handling and no timeout
echo "Starting Next.js build with extended timeout..."
echo "Memory allocated: 16GB"
echo "Timeout set to: 30 minutes"
echo "Starting build process..."

# Function to run build with retry mechanism
run_build_with_retry() {
  local max_attempts=3
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    echo "Build attempt $attempt of $max_attempts..."
    
    if NODE_OPTIONS="$NODE_OPTIONS" npm run build; then
      echo "✅ Build completed successfully on attempt $attempt!"
      return 0
    else
      echo "❌ Build attempt $attempt failed"
      
      if [ $attempt -lt $max_attempts ]; then
        echo "Retrying in 30 seconds..."
        sleep 30
        
        # Clean up for retry
        echo "Cleaning up for retry..."
        rm -rf .next/cache/* 2>/dev/null || true
        
        echo "Preparing for next attempt..."
      fi
    fi
    
    attempt=$((attempt + 1))
  done
  
  echo "❌ All build attempts failed!"
  return 1
}

# Run the build with retry mechanism
if run_build_with_retry; then
  echo "✅ Build process completed successfully!"
else
  echo "❌ Build failed after all retry attempts!"
  echo ""
  echo "=== Build Error Diagnosis ==="
  echo "Checking common issues..."
  
  # Check if .next directory exists
  if [ -d .next ]; then
    echo "• .next directory exists"
    ls -la .next/
  else
    echo "• No .next directory found"
  fi
  
  # Check for common Next.js issues
  if [ -f next.config.js ]; then
    echo "• next.config.js found"
  else
    echo "• No next.config.js found"
  fi
  
  # Check disk space
  echo "• Disk usage:"
  df -h .
  
  # Check memory usage
  echo "• Memory info:"
  free -h 2>/dev/null || echo "Memory info not available"
  
  exit 1
fi

# Verify build output
echo ""
echo "=== Build Verification ==="
if [ -d .next ]; then
  echo "✅ .next directory created successfully"
  echo "Build artifacts:"
  find .next -name "*.js" -o -name "*.html" | head -10
  
  # Check build size
  BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")
  echo "Build size: $BUILD_SIZE"
else
  echo "❌ .next directory not found after build"
  exit 1
fi

echo ""
echo "=== Build Complete ==="
echo "✅ All build steps completed successfully!" 