/**
 * LocalStorage utility functions for managing return requests
 */

import { OrderDetailsItem } from "@/types";

const RETURN_REQUEST_PREFIX = "return_request_";

/**
 * Save return request items to localStorage
 */
export function saveReturnRequest(
  orderId: string | number,
  items: OrderDetailsItem[]
): void {
  try {
    const storageKey = `${RETURN_REQUEST_PREFIX}${orderId}`;
    if (items.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(items));
      console.log(
        `✅ Saved ${items.length} items to localStorage for order ${orderId}`
      );
    } else {
      localStorage.removeItem(storageKey);
      console.log(
        `🗑️ Removed return request from localStorage for order ${orderId}`
      );
    }
  } catch (error) {
    console.error("Error saving return request:", error);
  }
}

/**
 * Load return request items from localStorage
 */
export function loadReturnRequest(
  orderId: string | number
): OrderDetailsItem[] {
  try {
    const storageKey = `${RETURN_REQUEST_PREFIX}${orderId}`;
    const savedItems = localStorage.getItem(storageKey);

    if (savedItems) {
      const parsedItems = JSON.parse(savedItems) as OrderDetailsItem[];
      console.log(
        `📦 Loaded ${parsedItems.length} items from localStorage for order ${orderId}`
      );
      return parsedItems;
    }

    return [];
  } catch (error) {
    console.error("Error loading return request:", error);
    // Clear corrupted data
    clearReturnRequest(orderId);
    return [];
  }
}

/**
 * Clear return request from localStorage
 */
export function clearReturnRequest(orderId: string | number): void {
  try {
    const storageKey = `${RETURN_REQUEST_PREFIX}${orderId}`;
    localStorage.removeItem(storageKey);
    console.log(`🧹 Cleared return request for order ${orderId}`);
  } catch (error) {
    console.error("Error clearing return request:", error);
  }
}

/**
 * Get all return requests from localStorage
 */
export function getAllReturnRequests(): Record<string, OrderDetailsItem[]> {
  try {
    const returnRequests: Record<string, OrderDetailsItem[]> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(RETURN_REQUEST_PREFIX)) {
        const orderId = key.replace(RETURN_REQUEST_PREFIX, "");
        const items = loadReturnRequest(orderId);
        if (items.length > 0) {
          returnRequests[orderId] = items;
        }
      }
    }

    return returnRequests;
  } catch (error) {
    console.error("Error getting all return requests:", error);
    return {};
  }
}

/**
 * Clear all return requests from localStorage
 */
export function clearAllReturnRequests(): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(RETURN_REQUEST_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    console.log(`🧹 Cleared ${keysToRemove.length} return requests`);
  } catch (error) {
    console.error("Error clearing all return requests:", error);
  }
}

/**
 * Check if there's a pending return request for an order
 */
export function hasReturnRequest(orderId: string | number): boolean {
  const storageKey = `${RETURN_REQUEST_PREFIX}${orderId}`;
  return localStorage.getItem(storageKey) !== null;
}
