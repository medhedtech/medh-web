"use client";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Scrollup from "../others/Scrollup";
import CartContextProvider from "@/contexts/CartContext";
import WishlistContextProvider from "@/contexts/WshlistContext";
import { useState, useEffect } from "react";

const PageWrapper = ({ children }) => {
  const [pageLoaded, setPageLoaded] = useState(false);
  
  useEffect(() => {
    // Function to handle scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' for refresh to avoid animation
      });
    };

    // Scroll to top on component mount (refresh)
    scrollToTop();

    // Handle scroll on page load
    const handleLoad = () => {
      scrollToTop();
      setPageLoaded(true);
    };

    // Add event listeners
    window.addEventListener('load', handleLoad);
    
    // Simulate a small delay for smoother transitions
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    // Cleanup
    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <CartContextProvider>
        {/* header */}
        <Header />

        {/* main */}
        <main className={`flex-grow transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <WishlistContextProvider>
            <div className="animate-fadeIn">
              {children}
            </div>
          </WishlistContextProvider>
        </main>
      </CartContextProvider>

      {/* footer */}
      <Footer />

      {/* scroll up */}
      <Scrollup />
    </div>
  );
};

export default PageWrapper;
