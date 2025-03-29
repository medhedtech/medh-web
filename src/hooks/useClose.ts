"use client";

import { useEffect, useState } from "react";
import useCartOfLocalStorage, { CartItem } from "./useCartOfLocalStorage";

export interface UseCloseResult {
  items: CartItem[];
  removeItem: (id: string | number) => void;
  removeItemByIndex: (index: number) => void;
}

/**
 * Custom hook to manage removing items from a cart
 * @param initialItems - Optional initial cart items
 * @param storageKey - Key to use for localStorage
 * @returns Object with items and removal methods
 */
export const useClose = (
  initialItems?: CartItem[] | null,
  storageKey: string = "cart"
): UseCloseResult => {
  const [items, setItems] = useState<CartItem[]>(initialItems || []);
  const { cartItems, saveCart } = useCartOfLocalStorage(storageKey);

  // Sync with provided items or load from localStorage
  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    } else if (cartItems.length > 0) {
      setItems(cartItems);
    } else if (typeof window !== "undefined") {
      try {
        const storedItems = localStorage.getItem(storageKey);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          setItems(Array.isArray(parsedItems) ? parsedItems : []);
        }
      } catch (error) {
        console.error("Error loading items from localStorage:", error);
      }
    }
  }, [initialItems, cartItems, storageKey]);

  /**
   * Remove an item from the cart by its ID
   * @param id - The ID of the item to remove
   */
  const removeItem = (id: string | number): void => {
    if (!items) return;
    
    const filteredItems = items.filter(item => item.id !== id);
    setItems(filteredItems);
    saveCart(filteredItems);
  };

  /**
   * Remove an item from the cart by its index
   * @param index - The index of the item to remove
   */
  const removeItemByIndex = (index: number): void => {
    if (!items || index < 0 || index >= items.length) return;
    
    const filteredItems = items.filter((_, idx) => idx !== index);
    setItems(filteredItems);
    saveCart(filteredItems);
  };

  return {
    items,
    removeItem,
    removeItemByIndex
  };
};

export default useClose; 