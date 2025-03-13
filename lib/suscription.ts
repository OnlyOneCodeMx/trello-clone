/**
 * Organization Subscription Manager
 *
 * Handles subscription status validation for organizations:
 * - Validates current subscription in database
 * - Checks subscription expiration date
 * - Includes grace period of one day after expiration
 * - Returns boolean indicating subscription validity
 */

import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';

// Milliseconds in a day for grace period calculations
const DAY_IN_MS = 86_400_000;

/**
 * Validates the current organization's subscription status
 *
 * @returns {Promise<boolean>} True if subscription is valid and not expired (including grace period)
 */
export const checkSubscription = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return false;
  }

  const orgSubscription = await db.orgSubscription.findUnique({
    where: {
      orgId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!orgSubscription) {
    return false;
  }

  // Check if subscription is valid and not expired (including grace period)
  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd &&
    orgSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

  return !!isValid;
};
