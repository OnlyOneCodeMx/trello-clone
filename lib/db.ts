// Import PrismaClient for database interaction.
import { PrismaClient } from '@prisma/client';

// Declare a global 'prisma' to persist the instance during hot reloads.
declare global {
  var prisma: PrismaClient | undefined;
}

// Use an existing global PrismaClient instance or create a new one.
export const db = globalThis.prisma || new PrismaClient();

// In non-production, save the instance globally to avoid duplicates during hot reloads.
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
