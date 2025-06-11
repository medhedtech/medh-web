# Node.js Version Configuration Guide

## Overview

This project has been configured to work with **Node.js 20.x LTS** for optimal compatibility and long-term support. However, the build system is designed to be flexible and work with Node.js 18+ versions.

## Current Configuration

### Files Updated
- ✅ `.nvmrc` → `20.19.2` (Node.js 20.x LTS)
- ✅ `package.json` engines → `>=20.19.0 <21.0.0`
- ✅ `amplify.yml` → Flexible Node.js version handling
- ✅ `scripts/amplify-build.sh` → Enhanced version checking
- ✅ `scripts/check-node.sh` → Environment validation script

### Supported Node.js Versions
- **Recommended**: Node.js 20.19.2 (LTS)
- **Minimum**: Node.js 18.x
- **Compatible**: Node.js 18.x, 19.x, 20.x, 21.x, 22.x

## Quick Start

### 1. Check Your Environment
```bash
npm run check-env
```

### 2. If You Need to Switch Node.js Versions

#### Using nvm (Recommended)
```bash
# Install and use the project's Node.js version
nvm install $(cat .nvmrc)
nvm use $(cat .nvmrc)

# Or manually
nvm install 20.19.2
nvm use 20.19.2
```

#### Using Node.js Direct Install
Download and install Node.js 20.19.2 from [nodejs.org](https://nodejs.org/)

### 3. Install Dependencies
```bash
npm run install-deps
# or
npm ci --legacy-peer-deps
```

### 4. Start Development
```bash
npm run dev
```

## AWS Amplify Build Configuration

The project includes two Amplify configuration files:

### Primary: `amplify.yml`
- Attempts to use the exact Node.js version from `.nvmrc`
- Falls back gracefully if nvm is not available
- Requires minimum Node.js 18.x for compatibility

### Alternative: `amplify-runtime.yml`
- Runtime-focused configuration
- More verbose logging and error handling
- Better for debugging build issues

## Troubleshooting

### Issue: "Node.js version mismatch"
**Solution**: Use nvm to switch to the correct version:
```bash
nvm install 20.19.2
nvm use 20.19.2
```

### Issue: "nvm command not found"
**Solutions**:
1. Install nvm: https://github.com/nvm-sh/nvm#installation
2. Or install Node.js 20.19.2 directly from nodejs.org
3. Or use the compatible version you have (if 18+)

### Issue: AWS Amplify build fails with Node.js version
**Solutions**:
1. Try using `amplify-runtime.yml` instead of `amplify.yml`
2. Check Amplify console for Node.js version settings
3. Contact AWS support if Amplify doesn't support Node.js 20.x

### Issue: npm install fails with peer dependency warnings
**Solution**: The project is configured with `legacy-peer-deps`, run:
```bash
npm run install-deps
```

## Version History

| Version | Status | Support Until | Notes |
|---------|--------|---------------|-------|
| 18.x | End-of-Life | April 2025 | Previous project version |
| 20.x | **LTS** | April 2026 | **Current target** |
| 22.x | Current | TBD | Development compatible |

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run check-env` | Validate Node.js environment |
| `npm run check-node` | Quick version check |
| `npm run install-deps` | Install with correct settings |
| `bash scripts/check-node.sh` | Detailed environment check |

## Build Environment Compatibility

### Local Development
- ✅ Node.js 18.x, 19.x, 20.x, 21.x, 22.x
- ✅ npm 8+, 9+, 10+
- ✅ Works with nvm, fnm, volta

### AWS Amplify
- ✅ Node.js 18.x, 20.x, 22.x (based on Amplify support)
- ✅ Automatic fallback to available version
- ✅ Minimum compatibility checks

### CI/CD Systems
- ✅ GitHub Actions
- ✅ GitLab CI
- ✅ CircleCI
- ✅ Any system with Node.js 18+

## Next Steps

1. **Immediate**: Use `npm run check-env` to validate your setup
2. **Development**: Switch to Node.js 20.x for best compatibility
3. **Production**: Ensure deployment environment supports Node.js 20.x
4. **Future**: Monitor Node.js LTS releases for next major upgrade

## Support

If you encounter issues:
1. Run `npm run check-env` for diagnostic information
2. Check this guide for common solutions
3. Ensure you're using a supported Node.js version (18+)
4. For Amplify-specific issues, check AWS documentation 