/**
 * Update List Order Action
 *
 * This server action handles reordering lists within a board.
 * It verifies user authentication and organization ownership,
 * then updates the order field for each list in a transaction.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateListOrder } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Update List Order action
 *
 * Updates the `order` field of multiple lists in a board to reflect
 * their new position after a drag-and-drop operation.
 *
 * @param {InputType} data - Contains the board ID and an array of reordered lists
 * @returns {Promise<ReturnType>} - Promise with updated lists or error
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { items, boardId } = data;
  let lists;

  try {
    // Prepare update operations for each list in the new order
    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            orgId: orgId!,
          },
        },
        data: {
          order: list.order,
        },
      })
    );

    // Execute all updates as a single transaction
    lists = await db.$transaction(transaction);
  } catch {
    return {
      error: 'Failed to reorder',
    };
  }

  // Revalidate the board path to reflect the updated order in the UI
  revalidatePath(`/board/${boardId}`);
  return { data: lists };
};

// Export the action wrapped in validation logic
export const updateListOrder = createSafeAction(UpdateListOrder, handler);
