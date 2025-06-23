#!/bin/bash

# Fast Git Push Script for Medh Web
# Optimizes git operations for faster pushes

set -e

echo "🚀 Starting fast git push process..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Function to optimize git config for speed
optimize_git_config() {
    echo "⚡ Optimizing git configuration..."
    git config --local core.preloadindex true
    git config --local core.fscache true
    git config --local core.autocrlf false
    git config --local pack.threads 0
    git config --local core.compression 9
    git config --local gc.auto 256
    git config --local push.default simple
    git config --local http.postBuffer 524288000
    git config --local http.version HTTP/2
    echo "✅ Git configuration optimized"
}

# Function to stage files efficiently
stage_files() {
    echo "📦 Staging files efficiently..."
    
    # Add only specific file types to avoid large files
    git add "*.ts" "*.tsx" "*.js" "*.jsx" "*.json" "*.md" "*.css" "*.scss" "*.html" "*.yml" "*.yaml" 2>/dev/null || true
    git add ".gitattributes" ".gitignore" 2>/dev/null || true
    git add "src/" "scripts/" 2>/dev/null || true
    
    # Add other important files
    git add "package.json" "package-lock.json" "tsconfig.json" "next.config.js" "tailwind.config.js" 2>/dev/null || true
    
    echo "✅ Files staged efficiently"
}

# Function to commit with optimized message
commit_changes() {
    local commit_msg="${1:-feat: optimize codebase and improve performance}"
    
    echo "💾 Committing changes..."
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        echo "ℹ️  No changes to commit"
        return 0
    fi
    
    git commit -m "$commit_msg" --quiet
    echo "✅ Changes committed successfully"
}

# Function to push with optimizations
push_changes() {
    echo "🌐 Pushing to remote repository..."
    
    # Get current branch
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    # Push with optimizations
    git push origin "$current_branch" --no-verify --quiet
    
    echo "✅ Successfully pushed to origin/$current_branch"
}

# Main execution
main() {
    local commit_message="$1"
    
    echo "Starting fast push for branch: $(git rev-parse --abbrev-ref HEAD)"
    
    # Run optimizations
    optimize_git_config
    stage_files
    commit_changes "$commit_message"
    push_changes
    
    echo "🎉 Fast push completed successfully!"
    echo "📊 Repository status:"
    git status --porcelain | wc -l | xargs echo "   Untracked files:"
    git log --oneline -1 | xargs echo "   Latest commit:"
}

# Run the script
main "$@" 