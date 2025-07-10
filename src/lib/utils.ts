import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format large numbers with appropriate units (K, M, B)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string
 */
export function formatLargeNumber(num: number, decimals: number = 1): string {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1000000000) {
    return `${sign}${(absNum / 1000000000).toFixed(decimals)}B`;
  } else if (absNum >= 1000000) {
    return `${sign}${(absNum / 1000000).toFixed(decimals)}M`;
  } else if (absNum >= 1000) {
    return `${sign}${(absNum / 1000).toFixed(decimals)}K`;
  } else {
    return `${sign}${absNum.toFixed(0)}`;
  }
}

/**
 * Format currency with appropriate units
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = '$', decimals: number = 1): string {
  return `${currency}${formatLargeNumber(amount, decimals)}`;
}
