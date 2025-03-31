"use client";

import CartContextProvider from "@/contexts/CartContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { StorageProvider } from "@/contexts/StorageContext";
import { PlacementFormProvider } from "@/context/PlacementFormContext";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="medh-theme"
      >
        <StorageProvider>
          <CookieConsentProvider>
            <CurrencyProvider>
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
            </CurrencyProvider>
          </CookieConsentProvider>
        </StorageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 