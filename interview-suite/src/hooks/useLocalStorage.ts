/**
 * Interview Question: Custom Hook - useLocalStorage
 * 
 * Objective:
 * Create a custom React hook that provides a convenient way to interact with browser's
 * localStorage. The hook should handle serialization/deserialization and provide
 * a familiar API similar to useState.
 * 
 * Requirements:
 * - Return a tuple similar to useState: [value, setValue]
 * - Automatically synchronize state with localStorage
 * - Handle JSON serialization and deserialization
 * - Support initializing with a value or a function
 * - Clean up event listeners to prevent memory leaks
 * - Handle cases where localStorage is not available (SSR)
 * - Support removing items from localStorage
 * 
 * Features to consider:
 * - What happens if the stored value is corrupted?
 * - How do you sync state across tabs/windows?
 * - How do you handle the initial load?
 * - What about TypeScript types?
 * 
 * Example Usage:
 * const [name, setName] = useLocalStorage<string>("name", "John");
 * const [count, setCount] = useLocalStorage<number>("count", 0);
 * 
 * const [todos, setTodos] = useLocalStorage<Todo[]>("todos", () => {
 *   return fetchInitialTodos();
 * });
 */

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // TODO: Implement the custom hook
  
  // Steps to implement:
  // 1. Create state for the value
  // 2. Initialize from localStorage on mount
  // 3. Handle the initialValue as either a value or function
  // 4. Create a setter that updates both state and localStorage
  // 5. Listen for storage changes from other tabs/windows
  // 6. Return [value, setValue, removeValue]
  
  /*
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue instanceof Function ? initialValue() : initialValue;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue instanceof Function ? initialValue() : initialValue;
      }

      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch custom event for other instances
        window.dispatchEvent(
          new Event("local-storage", { detail: { key, newValue: valueToStore } })
        );
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  // Function to remove from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
  */

  return [{} as T, () => {}, () => {}];
}

export default useLocalStorage;
