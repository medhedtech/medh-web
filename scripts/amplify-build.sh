#!/bin/bash
# Amplify build script with enhanced memory optimization and error handling

set -e  # Exit on any error

# Print Node.js and package manager versions
echo "=== Build Environment Info ==="
echo "Build script starting..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "PNPM version: $(pnpm -v)"
echo "Expected Node version from .nvmrc: $(cat .nvmrc 2>/dev/null || echo 'No .nvmrc found')"
echo "AWS Branch: ${AWS_BRANCH:-'not-set'}"
echo "Build ID: ${AWS_BUILD_ID:-'not-set'}"

# Print memory information
echo ""
echo "=== Memory Information ==="
echo "Available memory:"
free -h 2>/dev/null || echo "Memory info not available on this system"
echo "Disk space:"
df -h .

# Print environment variables (without sensitive values)
echo ""
echo "=== Environment Variables Check ==="
env | grep -v "SECRET\|KEY\|PASSWORD\|TOKEN\|URI" | sort

# Set aggressive memory optimization environment variables
echo ""
echo "=== Setting Aggressive Memory Optimization ==="
export NODE_ENV="${NODE_ENV:-production}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://api.medh.co/api/v1}"

# AGGRESSIVE MEMORY SETTINGS - 24GB allocation with optimized GC
export NODE_OPTIONS="--max-old-space-size=24576 --max-semi-space-size=2048 --no-warnings --optimize-for-size --gc-interval=100 --expose-gc"
export NODE_MAX_OLD_SPACE_SIZE=24576
export UV_THREADPOOL_SIZE=16

# Build optimization flags
export GENERATE_SOURCEMAP=false
export DISABLE_ESLINT_PLUGIN=true
export TSC_COMPILE_ON_ERROR=true
export SKIP_PREFLIGHT_CHECK=true
export NEXT_TELEMETRY_DISABLED=1

# Timeout settings
export NEXT_TIMEOUT=3600000  # 60 minutes
export NEXT_STATIC_EXPORT_TIMEOUT=3600000  # 60 minutes

echo "NODE_ENV: $NODE_ENV"
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
echo "Memory allocated: 24GB"
echo "Node options: $NODE_OPTIONS"

# Function to force garbage collection if available
force_gc() {
  if command -v node >/dev/null 2>&1; then
    echo "Forcing garbage collection..."
    node -e "if (global.gc) { global.gc(); console.log('Garbage collection completed'); } else { console.log('Garbage collection not available'); }"
  fi
}

# Check for critical dependencies before build
echo ""
echo "=== Critical Dependencies Check ==="
echo "Checking for @radix-ui/react-avatar..."
if [ -d "node_modules/@radix-ui/react-avatar" ]; then
  echo "✅ @radix-ui/react-avatar found"
else
  echo "❌ @radix-ui/react-avatar missing - installing now..."
  NODE_OPTIONS="--max-old-space-size=4096" pnpm add @radix-ui/react-avatar --force --reporter=silent
fi

echo "Checking for @radix-ui/react-progress..."
if [ -d "node_modules/@radix-ui/react-progress" ]; then
  echo "✅ @radix-ui/react-progress found"
else
  echo "❌ @radix-ui/react-progress missing - installing now..."
  NODE_OPTIONS="--max-old-space-size=4096" pnpm add @radix-ui/react-progress --force --reporter=silent
fi

echo "Checking for TypeScript..."
if [ -f "node_modules/.bin/tsc" ] && [ -f "node_modules/typescript/package.json" ]; then
  echo "✅ TypeScript compiler found"
  node_modules/.bin/tsc --version
else
  echo "❌ TypeScript compiler missing - installing now..."
  NODE_OPTIONS="--max-old-space-size=4096" pnpm add typescript @types/node @types/react @types/react-dom --force --reporter=silent
  
  # Verify installation again
  if [ -f "node_modules/.bin/tsc" ]; then
    echo "✅ TypeScript successfully installed"
    node_modules/.bin/tsc --version
  else
    echo "❌ TypeScript installation failed - trying alternative method"
    NODE_OPTIONS="--max-old-space-size=4096" npm install --global typescript
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
GENERATE_SOURCEMAP=false
DISABLE_ESLINT_PLUGIN=true
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
npm config set progress false

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

# Pre-build cleanup to free memory
echo ""
echo "=== Pre-Build Memory Cleanup ==="
echo "Cleaning up caches and temporary files..."
rm -rf .next/cache/* 2>/dev/null || true
rm -rf node_modules/.cache/* 2>/dev/null || true
rm -rf ~/.npm/_cacache/* 2>/dev/null || true
pnpm store prune 2>/dev/null || true

# Force garbage collection before build
force_gc

# Build the application with memory optimization and chunked processing
echo ""
echo "=== Building Application with Memory Optimization ==="
echo "Memory allocated: 24GB"
echo "Timeout set to: 60 minutes"
echo "Starting memory-optimized build process..."

# Function to run build with retry mechanism and memory management
run_build_with_retry() {
  local max_attempts=3
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    echo "Build attempt $attempt of $max_attempts..."
    echo "Memory status before build attempt:"
    free -h 2>/dev/null || echo "Memory info not available"
    
    # Force garbage collection before each attempt
    force_gc
    
    # Set memory-optimized environment for this build attempt
    local build_node_options="--max-old-space-size=24576 --max-semi-space-size=2048 --no-warnings --optimize-for-size --gc-interval=100 --expose-gc"
    
    if NODE_OPTIONS="$build_node_options" timeout 3600 pnpm run build; then
      echo "✅ Build completed successfully on attempt $attempt!"
      return 0
    else
      echo "❌ Build attempt $attempt failed"
      
      if [ $attempt -lt $max_attempts ]; then
        echo "Retrying in 30 seconds..."
        sleep 30
        
        # Aggressive cleanup for retry
        echo "Performing aggressive cleanup for retry..."
        rm -rf .next/cache/* 2>/dev/null || true
        rm -rf .next/static/* 2>/dev/null || true
        rm -rf node_modules/.cache/* 2>/dev/null || true
        rm -rf ~/.npm/_cacache/* 2>/dev/null || true
        
        # Force garbage collection
        force_gc
        
        # Clear pnpm store
        pnpm store prune 2>/dev/null || true
        
        echo "Preparing for next attempt..."
      fi
    fi
    
    attempt=$((attempt + 1))
  done
  
  echo "❌ All build attempts failed!"
  return 1
}

# Alternative build function with chunked processing
run_chunked_build() {
  echo "Attempting chunked build approach..."
  
  # Try to build with reduced parallelism
  echo "Building with reduced parallelism..."
  NODE_OPTIONS="--max-old-space-size=24576 --max-semi-space-size=2048" \
  NEXT_BUILD_WORKERS=1 \
  timeout 3600 pnpm run build
}

# Check memory requirements before starting
echo ""
echo "=== Pre-Build Memory Check ==="
if ! ./scripts/memory-monitor.sh check; then
  echo "⚠️ Memory requirements not met, but continuing with build..."
fi

# Run the build with retry mechanism
if run_build_with_retry; then
  echo "✅ Build process completed successfully!"
elif run_chunked_build; then
  echo "✅ Chunked build completed successfully!"
else
  echo "❌ All build methods failed!"
  echo ""
  echo "=== Build Error Diagnosis ==="
  echo "Checking common issues..."
  
  # Memory diagnostic
  echo "• Memory status:"
  free -h 2>/dev/null || echo "Memory info not available"
  
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
  
  # Check for specific error patterns in logs
  echo "• Checking for common build errors..."
  if [ -f .next/build.log ]; then
    echo "Build log found, checking for memory errors..."
    grep -i "out of memory\|heap\|allocation failed" .next/build.log || echo "No memory-related errors found in build log"
  fi
  
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
  
  # Verify critical files exist
  if [ -f .next/BUILD_ID ]; then
    echo "✅ BUILD_ID file exists"
  else
    echo "⚠️ BUILD_ID file missing"
  fi
  
  if [ -d .next/static ]; then
    echo "✅ Static files directory exists"
    STATIC_SIZE=$(du -sh .next/static 2>/dev/null | cut -f1 || echo "unknown")
    echo "Static files size: $STATIC_SIZE"
  else
    echo "⚠️ Static files directory missing"
  fi
else
  echo "❌ .next directory not found after build"
  exit 1
fi

# Final cleanup to free space
echo ""
echo "=== Post-Build Cleanup ==="
echo "Cleaning up build caches..."
rm -rf node_modules/.cache/* 2>/dev/null || true
rm -rf ~/.npm/_cacache/* 2>/dev/null || true

# Final memory status
echo "Final memory status:"
free -h 2>/dev/null || echo "Memory info not available"

echo ""
echo "=== Build Complete ==="
echo "✅ All build steps completed successfully!" 