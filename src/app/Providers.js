"use client";

import CartContextProvider from "@/contexts/CartContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="medh-theme"
      >
        <CookieConsentProvider>
          <CurrencyProvider>
            <CartContextProvider>
              {children}
            </CartContextProvider>
          </CurrencyProvider>
        </CookieConsentProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 