
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to check if layout is RTL based on language
export function isRTL(language: string): boolean {
  return language === 'ar';
}
