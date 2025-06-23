#!/bin/bash

# Git Repository Cleanup Script
# This script cleans up large files from git history and optimizes the repository

set -e

echo "🧹 Starting Git Repository Cleanup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository!"
    exit 1
fi

# Show current repository size
echo "📊 Current repository size:"
du -sh .git

# 1. Clean up untracked files and directories
print_status "Cleaning untracked files..."
git clean -fd

# 2. Remove deleted files from index
print_status "Removing deleted files from index..."
git add -A

# 3. Find and remove large files from git history
print_status "Finding large files in git history..."
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -20

# 4. Clean up large video files specifically
print_status "Removing large video files from git history..."
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch public/video/*.mp4' \
  --prune-empty --tag-name-filter cat -- --all

# Alternative method using git-filter-repo if available
if command -v git-filter-repo &> /dev/null; then
    print_status "Using git-filter-repo for advanced cleanup..."
    git filter-repo --path public/video/ --invert-paths --force
else
    print_warning "git-filter-repo not found. Using git filter-branch instead."
fi

# 5. Clean up reflogs
print_status "Cleaning up reflogs..."
git reflog expire --expire=now --all

# 6. Garbage collect with aggressive optimization
print_status "Running aggressive garbage collection..."
git gc --aggressive --prune=now

# 7. Repack repository
print_status "Repacking repository..."
git repack -ad

# 8. Clean up backup refs created by filter-branch
print_status "Cleaning up backup references..."
rm -rf .git/refs/original/
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d 2>/dev/null || true

# 9. Force update remote tracking branches
print_status "Updating remote tracking branches..."
git remote prune origin

# 10. Show final repository size
echo "📊 Final repository size:"
du -sh .git

# 11. Show size reduction
print_status "Repository cleanup completed!"
echo "🎉 You can now push your changes with:"
echo "   git push --force-with-lease origin main"

print_warning "IMPORTANT: This operation rewrites git history."
print_warning "All team members will need to re-clone the repository or reset their local copies." 