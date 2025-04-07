/**
 * Update Board Action
 *
 * This server action handles the update of an existing board.
 * It validates user permissions and updates the board title
 * in the database.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateBoard } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Update Board action
 *
 * Updates the board with the provided title after validating
 * user permissions and organization ownership.
 *
 * @param {InputType} data - The input data containing board ID and new title
 * @returns {Promise<ReturnType>} Promise resolving to the updated board or an error message
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, id } = data;
  let board;

  try {
    // Update the board title in the database
    board = await db.board.update({
      where: {
        id,
        orgId: orgId!,
      },
      data: {
        title,
      },
    });

    // Log the board update in the audit system
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
    });
  } catch {
    return {
      error: 'Failed to update',
    };
  }

  // Revalidate the board path to reflect changes in UI
  revalidatePath(`/board/${id}`);
  return { data: board };
};

// Export the action wrapped in validation logic
export const updateBoard = createSafeAction(UpdateBoard, handler);
