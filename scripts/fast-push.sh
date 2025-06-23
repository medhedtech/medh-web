#!/bin/bash

# Fast Git Push Script
# Optimized for large repositories with better performance

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    print_status "Staging changes..."
    git add .
    
    # Get commit message from user or use default
    if [ -z "$1" ]; then
        COMMIT_MSG="chore: auto-commit changes $(date '+%Y-%m-%d %H:%M')"
    else
        COMMIT_MSG="$1"
    fi
    
    print_status "Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
fi

# Optimize git configuration for large pushes
print_status "Optimizing git configuration for large pushes..."
git config http.postBuffer 524288000  # 500MB buffer
git config http.maxRequestBuffer 100M
git config core.compression 0         # Disable compression for speed
git config pack.compression 0
git config pack.deltaCacheSize 2047m
git config pack.packSizeLimit 2047m
git config pack.windowMemory 2047m

# Check if we're ahead of remote
AHEAD=$(git rev-list --count HEAD ^origin/$CURRENT_BRANCH 2>/dev/null || echo "0")

if [ "$AHEAD" -gt 0 ]; then
    print_status "Pushing $AHEAD commits to origin/$CURRENT_BRANCH..."
    
    # Use parallel processing for faster push
    git -c push.default=current push origin $CURRENT_BRANCH --progress
    
    if [ $? -eq 0 ]; then
        print_status "Successfully pushed to origin/$CURRENT_BRANCH"
    else
        print_error "Push failed. Trying with force-with-lease..."
        git push --force-with-lease origin $CURRENT_BRANCH --progress
    fi
else
    print_warning "No commits to push. Already up to date with origin/$CURRENT_BRANCH"
fi

# Reset git configuration to defaults
print_status "Resetting git configuration..."
git config --unset http.postBuffer || true
git config --unset http.maxRequestBuffer || true
git config core.compression 1
git config --unset pack.compression || true
git config --unset pack.deltaCacheSize || true
git config --unset pack.packSizeLimit || true
git config --unset pack.windowMemory || true

print_status "Push completed successfully! 🚀" 