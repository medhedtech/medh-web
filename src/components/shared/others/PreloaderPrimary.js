"use client";
import { useEffect, useState } from "react";
import Preloader from "./Preloader";

const PreloaderPrimary = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle page load event
    if (document.readyState === "complete") {
      handleComplete();
    } else {
      window.addEventListener("load", handleComplete);
    }

    return () => window.removeEventListener("load", handleComplete);
  }, []);

  const handleComplete = () => {
    // Add a slight delay to ensure smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isLoading ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <Preloader />
    </div>
  );
};

export default PreloaderPrimary;
