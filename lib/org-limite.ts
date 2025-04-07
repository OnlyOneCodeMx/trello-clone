/**
 * Organization Limit Utility
 *
 * This utility manages the limits on board creation for organizations.
 * It checks if the organization has available quota for creating new boards,
 * increments or decreases the available count as needed, and checks the current limit.
 */
import { auth } from '@clerk/nextjs/server';

import { db } from './db';
import { MAX_FREE_BOARDS } from '@/constants/boards';

/**
 * Increments the available count of boards for the organization.
 *
 * This function checks if the organization exists in the database. If it does,
 * it increases the count of available boards by 1. If not, it creates a new record
 * with a count of 1.
 */

export const incrementAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  // Retrieve the organization's current board limit
  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  // If the organization exists, increment the available count by 1
  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count + 1 },
    });
  } else {
    // If no limit is found, create a new record with an initial count of 1
    await db.orgLimit.create({
      data: { orgId, count: 1 },
    });
  }
};

/**
 * Decreases the available count of boards for the organization.
 *
 * This function checks if the organization exists in the database. If it does,
 * it decreases the available count of boards by 1, ensuring it does not go below 0.
 * If the organization doesn't exist, it creates a new record with an initial count of 1.
 */

export const decreaseAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  // Retrieve the organization's current board limit
  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  // If the organization exists, decrease the available count by 1
  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
    });
  } else {
    // If no limit is found, create a new record with an initial count of 1
    await db.orgLimit.create({
      data: { orgId, count: 1 },
    });
  }
};

/**
 * Checks if the organization has available quota to create a new board.
 *
 * This function compares the organization's current board limit with the maximum
 * allowed for free boards (defined by `MAX_FREE_BOARDS`). It returns `true` if
 * the organization can create more boards or `false` if the limit is reached.
 *
 * @returns {boolean} Whether the organization can create more boards
 */

export const hasAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  // Retrieve the organization's current board limit
  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  // If no limit or if the count is less than the maximum allowed free boards, return true
  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

/**
 * Retrieves the current available count of boards for the organization.
 *
 * This function returns the current count of available boards for the organization
 * or `0` if no data is found.
 *
 * @returns {number} The current available count of boards for the organization
 */

export const getAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return 0;
  }

  // Retrieve the organization's current board limit
  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  // If no limit is found, return 0
  if (!orgLimit) {
    return 0;
  }

  // Return the current available count
  return orgLimit.count;
};
