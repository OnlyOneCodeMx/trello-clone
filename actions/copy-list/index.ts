/**
 * Copy List Action
 *
 * This server action handles duplicating a list within a board.
 * It copies the list's title and its associated cards, appending "- Copy"
 * to the new list's title and placing it at the end of the board.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { CopyList } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Copy List action
 *
 * Duplicates an existing list and all its cards, assigning a new title
 * and placing it at the end of the board.
 *
 * @param {InputType} data - The input data containing list and board IDs
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

  const { id, boardId } = data;

  let list;

  try {
    // Fetch the list to copy, including its cards
    // Ensures the list belongs to the authenticated user's organization
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId: boardId!,
        board: {
          orgId: orgId!,
        },
      },
      include: {
        cards: true,
      },
    });

    if (!listToCopy) {
      return {
        error: 'List not found',
      };
    }

    // Get the list with the highest order to determine new list position
    const lastList = await db.list.findFirst({
      where: {
        boardId: boardId,
      },
      orderBy: {
        order: 'desc',
      },
      select: { order: true },
    });

    // Assign order one higher than the last list found
    const newOrder = lastList ? lastList.order + 1 : 1;

    // Create the new list with the copied title and cards
    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });

    // Log the list creation in the audit system
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: 'Failed to copy',
    };
  }

  // Revalidate board path to reflect UI changes
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

// Export the action wrapped in validation logic
export const copyList = createSafeAction(CopyList, handler);
