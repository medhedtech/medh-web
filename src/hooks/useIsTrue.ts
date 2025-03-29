"use client";

import { usePathname } from "next/navigation";

export interface PathMatchOptions {
  /**
   * Whether to perform exact or partial matching
   */
  exact?: boolean;
  /**
   * Case sensitivity for the comparison
   */
  caseSensitive?: boolean;
  /**
   * Whether to match based on path segments (split by /)
   */
  segmentMatch?: boolean;
  /**
   * Whether to consider trailing slashes in the matching logic
   */
  ignoreTrailingSlash?: boolean;
}

/**
 * Enhanced hook to check if the current path matches a given path with various matching options
 * Renamed from useIsTrue to usePathMatch to better reflect its purpose
 * 
 * @param targetPath - The path to check against
 * @param options - Path matching options
 * @returns Whether the current path matches the target path
 * 
 * @example
 * // Basic exact match
 * const isHomePage = usePathMatch('/');
 * 
 * // Partial matching (checks if current path starts with '/blog')
 * const isBlogSection = usePathMatch('/blog', { exact: false });
 * 
 * // Case-insensitive matching
 * const isAboutPage = usePathMatch('/about', { caseSensitive: false });
 */
function usePathMatch(
  targetPath: string | string[],
  options: PathMatchOptions = {}
): boolean {
  const pathname = usePathname();
  
  if (!pathname || !targetPath) return false;
  
  const {
    exact = true,
    caseSensitive = true,
    segmentMatch = false,
    ignoreTrailingSlash = true
  } = options;

  // Process any target paths and current pathname
  const normalizePath = (path: string): string => {
    let processedPath = path;
    
    // Handle trailing slashes if specified
    if (ignoreTrailingSlash) {
      processedPath = path.endsWith('/') && path.length > 1
        ? path.slice(0, -1)
        : path;
    }
    
    // Handle case sensitivity
    if (!caseSensitive) {
      processedPath = processedPath.toLowerCase();
    }
    
    return processedPath;
  };

  const normalizedPathname = normalizePath(pathname);
  
  // If multiple paths are provided, check if any match
  if (Array.isArray(targetPath)) {
    return targetPath.some(path => 
      checkPathMatch(normalizePath(path), normalizedPathname)
    );
  }
  
  return checkPathMatch(normalizePath(targetPath), normalizedPathname);
  
  // Helper function to check path matching based on options
  function checkPathMatch(targetPathNormalized: string, pathnameNormalized: string): boolean {
    if (segmentMatch) {
      // Match by path segments
      const targetSegments = targetPathNormalized.split('/').filter(Boolean);
      const pathnameSegments = pathnameNormalized.split('/').filter(Boolean);
      
      if (exact) {
        if (targetSegments.length !== pathnameSegments.length) return false;
        return targetSegments.every((segment, index) => segment === pathnameSegments[index]);
      } else {
        if (targetSegments.length > pathnameSegments.length) return false;
        return targetSegments.every((segment, index) => segment === pathnameSegments[index]);
      }
    } else {
      // Match by string comparison
      if (exact) {
        return targetPathNormalized === pathnameNormalized;
      } else {
        return pathnameNormalized.startsWith(targetPathNormalized);
      }
    }
  }
}

/**
 * Custom hook to check if the current pathname matches a given path or paths
 * @param paths - A path string or array of path strings to match against the current path
 * @param exact - Whether to match exactly or allow partial path matching
 * @returns Boolean indicating if the current path matches any of the provided paths
 */
export const useIsTrue = (
  paths: string | string[],
  exact: boolean = true
): boolean => {
  const pathname = usePathname();
  
  if (!pathname) return false;
  
  // Handle both single path and array of paths
  const pathsToCheck = Array.isArray(paths) ? paths : [paths];
  
  if (exact) {
    return pathsToCheck.includes(pathname);
  } else {
    // For partial matching, check if the current path starts with any of the paths
    return pathsToCheck.some(path => pathname.startsWith(path));
  }
};

export { usePathMatch }; // Export the new name as named export
export default useIsTrue; // Keep the old name as default export for backward compatibility 