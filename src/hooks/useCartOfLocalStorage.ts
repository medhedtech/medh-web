"use client";

import { useEffect, useState } from "react";

export interface CartItem {
  id: string | number;
  [key: string]: any;
}

export interface UseCartStorageResult {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (itemId: string | number) => void;
  updateCartItem: (itemId: string | number, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  saveCart: (items: CartItem[]) => void;
}

/**
 * Custom hook to manage cart items in local storage
 * @param storageKey - Key to use for storing cart data in localStorage
 * @returns Object with cart state and methods to manipulate it
 */
export const useCartOfLocalStorage = (
  storageKey: string = "cart"
): UseCartStorageResult => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Initialize cart from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const storedCart = localStorage.getItem(storageKey);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCartItems([]);
    }
  }, [storageKey]);

  // Save the current cart to localStorage
  const saveCart = (items: CartItem[]): void => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  // Add a new item to the cart
  const addItemToCart = (item: CartItem): void => {
    const updatedCart = [...cartItems];
    
    // Check if the item already exists
    const existingItemIndex = updatedCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    
    if (existingItemIndex >= 0) {
      // If item exists, update it (for example, increase quantity)
      const existingItem = updatedCart[existingItemIndex];
      updatedCart[existingItemIndex] = {
        ...existingItem,
        ...item,
        quantity: (existingItem.quantity || 0) + (item.quantity || 1)
      };
    } else {
      // Otherwise, add the new item
      updatedCart.push({
        ...item,
        quantity: item.quantity || 1
      });
    }
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Remove an item from the cart
  const removeItemFromCart = (itemId: string | number): void => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Update an existing cart item
  const updateCartItem = (
    itemId: string | number, 
    updates: Partial<CartItem>
  ): void => {
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Clear the entire cart
  const clearCart = (): void => {
    setCartItems([]);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  };

  return {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    updateCartItem,
    clearCart,
    saveCart
  };
};

export default useCartOfLocalStorage; 