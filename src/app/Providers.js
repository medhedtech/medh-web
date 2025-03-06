"use client";

import CartContextProvider from "@/contexts/CartContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
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
  );
} 