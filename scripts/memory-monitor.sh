#!/bin/bash
# Memory monitoring script for build processes

# Function to log memory usage
log_memory() {
  local stage="$1"
  echo "=== Memory Status: $stage ==="
  echo "Timestamp: $(date)"
  
  # Memory information
  if command -v free >/dev/null 2>&1; then
    echo "Memory usage:"
    free -h
  else
    echo "Memory info not available (free command not found)"
  fi
  
  # Disk usage
  echo "Disk usage:"
  df -h . | head -2
  
  # Process memory if available
  if command -v ps >/dev/null 2>&1; then
    echo "Top memory-consuming processes:"
    ps aux --sort=-%mem | head -6
  fi
  
  echo "----------------------------------------"
}

# Function to force garbage collection
force_gc() {
  if command -v node >/dev/null 2>&1; then
    echo "Forcing garbage collection..."
    node -e "
      if (global.gc) { 
        global.gc(); 
        console.log('✅ Garbage collection completed'); 
      } else { 
        console.log('⚠️ Garbage collection not available (use --expose-gc flag)'); 
      }
    " 2>/dev/null || echo "⚠️ Could not run garbage collection"
  fi
}

# Function to clean up build caches
cleanup_caches() {
  echo "=== Cleaning up build caches ==="
  
  # Next.js cache
  if [ -d .next/cache ]; then
    echo "Cleaning Next.js cache..."
    rm -rf .next/cache/*
    echo "✅ Next.js cache cleaned"
  fi
  
  # Node modules cache
  if [ -d node_modules/.cache ]; then
    echo "Cleaning node_modules cache..."
    rm -rf node_modules/.cache/*
    echo "✅ Node modules cache cleaned"
  fi
  
  # NPM cache
  if [ -d ~/.npm/_cacache ]; then
    echo "Cleaning NPM cache..."
    rm -rf ~/.npm/_cacache/* 2>/dev/null || true
    echo "✅ NPM cache cleaned"
  fi
  
  # PNPM store pruning
  if command -v pnpm >/dev/null 2>&1; then
    echo "Pruning PNPM store..."
    pnpm store prune 2>/dev/null || true
    echo "✅ PNPM store pruned"
  fi
  
  force_gc
}

# Function to check memory availability
check_memory_requirements() {
  echo "=== Checking Memory Requirements ==="
  
  if command -v free >/dev/null 2>&1; then
    # Get available memory in MB
    AVAILABLE_MB=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    TOTAL_MB=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    
    echo "Total memory: ${TOTAL_MB}MB"
    echo "Available memory: ${AVAILABLE_MB}MB"
    
    # Check if we have enough memory (recommend at least 8GB available)
    if [ "$AVAILABLE_MB" -lt 8192 ]; then
      echo "⚠️ WARNING: Low available memory (${AVAILABLE_MB}MB < 8GB)"
      echo "   Consider closing other applications or using a larger instance"
      
      if [ "$AVAILABLE_MB" -lt 4096 ]; then
        echo "❌ CRITICAL: Very low memory (${AVAILABLE_MB}MB < 4GB)"
        echo "   Build may fail due to insufficient memory"
        return 1
      fi
    else
      echo "✅ Sufficient memory available (${AVAILABLE_MB}MB >= 8GB)"
    fi
  else
    echo "⚠️ Cannot check memory requirements (free command not available)"
  fi
  
  return 0
}

# Function to monitor build process
monitor_build() {
  local build_command="$1"
  local pid
  
  echo "=== Starting Build Monitor ==="
  log_memory "Pre-Build"
  
  # Start build in background
  eval "$build_command" &
  pid=$!
  
  echo "Build process started with PID: $pid"
  
  # Monitor every 30 seconds
  while kill -0 $pid 2>/dev/null; do
    sleep 30
    log_memory "During Build"
  done
  
  # Wait for build to complete and get exit code
  wait $pid
  local exit_code=$?
  
  log_memory "Post-Build"
  
  if [ $exit_code -eq 0 ]; then
    echo "✅ Build completed successfully"
  else
    echo "❌ Build failed with exit code: $exit_code"
  fi
  
  return $exit_code
}

# Main execution
case "${1:-help}" in
  "log")
    log_memory "${2:-Current}"
    ;;
  "gc")
    force_gc
    ;;
  "cleanup")
    cleanup_caches
    ;;
  "check")
    check_memory_requirements
    ;;
  "monitor")
    shift
    monitor_build "$*"
    ;;
  "help"|*)
    echo "Memory Monitor Script"
    echo "Usage: $0 {log|gc|cleanup|check|monitor|help}"
    echo ""
    echo "Commands:"
    echo "  log [stage]     - Log current memory usage"
    echo "  gc              - Force garbage collection"
    echo "  cleanup         - Clean up build caches"
    echo "  check           - Check memory requirements"
    echo "  monitor <cmd>   - Monitor build command execution"
    echo "  help            - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 log 'Before Build'"
    echo "  $0 cleanup"
    echo "  $0 monitor 'npm run build'"
    ;;
esac 