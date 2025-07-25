# SWC Build Fix for AWS CodeBuild

## Problem

Next.js 15.4.3 uses SWC (Speedy Web Compiler) for fast compilation and minification. However, in AWS CodeBuild environments, the required SWC binary packages for Linux x64 architecture are sometimes not installed correctly, leading to build failures with errors like:

```
⚠ Attempted to load @next/swc-linux-x64-gnu, but it was not installed
⚠ Attempted to load @next/swc-linux-x64-musl, but it was not installed
⨯ Failed to load SWC binary for linux/x64
```

## Solution

We've implemented a comprehensive fix that includes:

### 1. Updated `buildspec.yml`
- Simplified build process using a dedicated script
- Proper environment setup for AWS CodeBuild
- Clean dependency installation

### 2. SWC Build Fix Script (`scripts/fix-swc-build.sh`)
- **Automatic SWC Binary Detection**: Checks for required SWC binaries
- **Intelligent Installation**: Attempts to install missing SWC binaries
- **Graceful Fallback**: Configures Next.js to use Babel if SWC fails
- **Build Retries**: Attempts build up to 3 times with different strategies
- **Environment Verification**: Comprehensive environment diagnostics

### 3. Next.js Configuration (`next.config.js`)
- Disabled SWC minification as fallback option
- Added compiler configuration for graceful degradation
- Maintains performance while ensuring build reliability

## How It Works

1. **Pre-build Phase**:
   - Install dependencies normally
   - Make the fix script executable

2. **Build Phase**:
   - Run the comprehensive SWC fix script
   - Script automatically handles SWC binary issues
   - Falls back to Babel if SWC is unavailable

3. **Build Script Process**:
   ```bash
   # Check environment
   verify_environment()
   
   # Check for SWC binaries
   check_swc_binaries()
   
   # Install if missing
   install_swc_binaries()
   
   # Set proper environment variables
   set_build_env()
   
   # Build with retries
   build_with_retries()
   ```

## Environment Variables Set

The script automatically configures:
- `NODE_ENV=production`
- `NODE_OPTIONS="--max-old-space-size=6144"`
- `NEXT_TELEMETRY_DISABLED=1`
- `CI=true`
- `NEXT_FORCE_SWC=false` (if SWC binaries unavailable)
- `SWC_DISABLE_NEXT_SWC=1` (if SWC binaries unavailable)

## Local Usage

If you encounter SWC issues locally, you can run:

```bash
npm run build:fix-swc
```

This will use the same comprehensive fix script used in AWS CodeBuild.

## Benefits

1. **Reliability**: Build succeeds even when SWC binaries are missing
2. **Performance**: Still uses SWC when available for optimal performance
3. **Diagnostics**: Comprehensive logging for troubleshooting
4. **Retry Logic**: Handles transient build failures
5. **Fallback Strategy**: Graceful degradation to Babel when needed

## Monitoring

The script provides detailed logging for:
- Environment verification
- SWC binary availability
- Build attempts and failures
- Performance metrics
- Build output verification

This ensures that build issues can be quickly diagnosed and resolved. 