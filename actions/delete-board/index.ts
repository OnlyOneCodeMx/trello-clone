/**
 * Delete Board Action
 *
 * This server action handles the deletion of a board within an organization.
 * It ensures the user is authenticated and authorized to delete the board.
 * The action also updates the available count for non-Pro users.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { decreaseAvailableCount } from '@/lib/org-limite';

import { DeleteBoard } from './schema';
import { InputType, ReturnType } from './types';
import { redirect } from 'next/navigation';
import { checkSubscription } from '@/lib/suscription';

/**
 * Handler function for deleting a board from the organization
 *
 * Validates user authentication, verifies board existence, and deletes the board.
 * If the user is not on a Pro subscription, it decreases the available count for the user.
 *
 * @param {InputType} data - The input data for deleting the board, including board id
 * @returns {Promise<ReturnType>} Promise resolving to the deleted board or an error message
 */

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  // Check if the user has a Pro subscription
  const isPro = await checkSubscription();

  const { id } = data;

  let board;

  try {
    // Find and delete the board from the database
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });

    // If the user is not Pro, decrease the available count for boards
    if (!isPro) {
      await decreaseAvailableCount();
    }

    // Log the board deletion in the audit system
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch {
    return {
      error: 'Failed to delete',
    };
  }

  // Revalidate board path to reflect UI changes
  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

// Export the action wrapped in validation logic
export const deleteBoard = createSafeAction(DeleteBoard, handler);
