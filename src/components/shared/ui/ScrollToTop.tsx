"use client";

import { useScrollToTop, useScrollVisibility } from "@/hooks/useScrolling";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const scrollToTop = useScrollToTop();
  const isVisible = useScrollVisibility(500); // 500px scroll threshold

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      } z-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
      aria-label="Scroll to top"
      title="Scroll to top (Alt+↑)"
      style={{ 
        // Prevent button from taking space when invisible
        pointerEvents: isVisible ? 'auto' : 'none' 
      }}
    >
      <ChevronUp className="w-6 h-6" aria-hidden="true" />
    </button>
  );
} 