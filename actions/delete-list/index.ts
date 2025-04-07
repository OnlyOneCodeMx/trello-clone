/**
 * Delete List Action
 *
 * This server action handles the deletion of a list within a board.
 * It ensures the user is authenticated and authorized to delete the list.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { DeleteList } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Delete List action
 *
 * This function handles the deletion of a list within a board. It checks for
 * authentication and authorization before proceeding with the deletion.
 *
 * @param {InputType} data - The input data containing the list and board IDs
 * @returns {Promise<ReturnType>} Promise resolving to the deleted list or an error message
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id, boardId } = data;

  let list;

  try {
    // Delete the list only if it belongs to the user's organization
    list = await db.list.delete({
      where: {
        id,
        boardId: boardId!,
        board: {
          orgId: orgId!,
        },
      },
    });

    // Log the board deletion in the audit system
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    });
  } catch {
    return {
      error: 'Failed to delete',
    };
  }

  // Revalidate board path to reflect UI changes
  revalidatePath(`/board/${orgId}`);
  return { data: list };
};

// Export the action wrapped in validation logic
export const deleteList = createSafeAction(DeleteList, handler);
