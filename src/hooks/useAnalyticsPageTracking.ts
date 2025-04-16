"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as analytics from "@/utils/analytics";

/**
 * Custom hook to track page views in analytics
 * Tracks both initial page load and subsequent client-side navigation
 */
export function useAnalyticsPageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construct the full URL path including search params
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    
    // Track page view
    analytics.pageView(url);
  }, [pathname, searchParams]);
} 