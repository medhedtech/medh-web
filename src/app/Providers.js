"use client";

import CartContextProvider from "@/contexts/CartContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
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
        <CartContextProvider>
          {children}
        </CartContextProvider>
      </CookieConsentProvider>
    </ThemeProvider>
  );
} 