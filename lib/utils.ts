/**
 * Utility Functions for Class Handling and URL Generation
 *
 * This file contains utility functions to manage class names with Tailwind CSS
 * and to generate absolute URLs for the application.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
