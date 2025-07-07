import type { LocalStorageComposable } from '../types/index.ts'

export function useLocalStorage(): LocalStorageComposable {
  const getItem = (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('Failed to get item from localStorage:', error)
      return null
    }
  }

  const setItem = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn('Failed to set item in localStorage:', error)
    }
  }

  const removeItem = (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove item from localStorage:', error)
    }
  }

  return {
    getItem,
    setItem,
    removeItem
  }
}
