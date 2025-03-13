/**
 * Database Client Configuration
 *
 * This module configures and exports the Prisma client instance:
 * - Handles hot reloading in development
 * - Ensures single instance in production
 * - Provides type-safe database access
 *
 * The client is cached in development to prevent multiple instances
 * during hot reloading, while in production a single instance is used.
 */

// Import PrismaClient for database interaction.
import { PrismaClient } from '@prisma/client';

// Declare a global 'prisma' to persist the instance during hot reloads.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use an existing global PrismaClient instance or create a new one.
export const db = globalThis.prisma || new PrismaClient();

// In non-production, save the instance globally to avoid duplicates during hot reloads.
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
