/**
 * Create List Action
 *
 * This server action handles the creation of a new list within a board.
 * It ensures the user is authenticated and authorized to create a list.
 * The list is placed at the end of the current lists for the given board.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { CreateList } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for creating a new list within a board
 *
 * Validates user authentication, retrieves board data, and creates a new list.
 * The list is added at the end based on the current highest order value in the board.
 *
 * @param {InputType} data - The input data for creating the list, including title and boardId
 * @returns {Promise<ReturnType>} Promise resolving to the new list or an error message
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, boardId } = data;
  let list;

  try {
    // Check if the board exists and belongs to the user's organization
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId: orgId!,
      },
    });

    if (!board) {
      return {
        error: 'Board not found',
      };
    }

    // Find the last list in the board to determine the new list's order
    const lastList = await db.list.findFirst({
      where: {
        boardId: boardId,
      },
      orderBy: {
        order: 'desc',
      },
      select: { order: true },
    });

    // Set the new list's order (place at the end)
    const newOrder = lastList ? lastList.order + 1 : 1;

    // Create the new list with the given title and order
    list = await db.list.create({
      data: {
        title,
        boardId: boardId!,
        order: newOrder,
      },
    });

    // Log the board creation in the audit system
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: 'Failed to create',
    };
  }

  // Revalidate board path to reflect UI changes
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

// Export the action wrapped in validation logic
export const createList = createSafeAction(CreateList, handler);
