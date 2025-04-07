/**
 * Update List Action
 *
 * This server action handles updating the title of a list.
 * It verifies user permissions and organization membership
 * before performing the update and logging the action.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateList } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Update List action
 *
 * Updates the title of a specified list, ensuring the list
 * belongs to the authenticated user's organization.
 *
 * @param {InputType} data - The input data containing the list ID, board ID, and new title
 * @returns {Promise<ReturnType>} Promise resolving to the updated list or an error message
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, id, boardId } = data;
  let list;

  try {
    // Update the list with the new title, ensuring it belongs to the correct board and organization
    list = await db.list.update({
      where: {
        id,
        boardId: boardId!,
        board: {
          orgId: orgId!,
        },
      },
      data: {
        title,
      },
    });

    // Log the update action in the audit system
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.UPDATE,
    });
  } catch {
    return {
      error: 'Failed to update',
    };
  }

  // Revalidate the board path to reflect UI changes
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

// Export the action wrapped in validation logic
export const updateList = createSafeAction(UpdateList, handler);
