"use client";

import CartContextProvider from "@/contexts/CartContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { StorageProvider } from "@/contexts/StorageContext";
import { PlacementFormProvider } from "@/context/PlacementFormContext";
import { ServerLoadingProvider } from "@/providers/ServerLoadingProvider";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import { ReactNode, useEffect } from "react";
import { showToast } from "@/utils/toastManager";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Initialize global showToast
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showToast = showToast;
      (globalThis as any).showToast = showToast;
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="medh-theme"
    >
      <StorageProvider>
        <CookieConsentProvider>
          <LoadingProvider>
            <ServerLoadingProvider 
              showGlobalIndicator={true}
              maxDisplayedStates={3}
              autoHideDelay={5000}
            >
              <CartContextProvider>
                <PlacementFormProvider>
                  {children}
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
                              </PlacementFormProvider>
              </CartContextProvider>
            </ServerLoadingProvider>
          </LoadingProvider>
        </CookieConsentProvider>
      </StorageProvider>
    </ThemeProvider>
  );
} 