/**
 * Update Card Order Action
 *
 * This server action handles the reordering and repositioning of cards
 * within or across lists. It validates user permissions and performs
 * the updates in a single database transaction.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateCardOrder } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Update Card Order action
 *
 * Updates the order and list position of each card provided in the input.
 * Ensures the user has access to the organization and performs the updates
 * in a transaction for atomicity.
 *
 * @param {InputType} data - The input data containing an array of card updates and the board ID
 * @returns {Promise<ReturnType>} Promise resolving to the updated cards or an error message
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
  let updatedCards;

  try {
    // Build a transaction with card updates for order and list changes
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId: orgId!,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    // Execute all updates in a single transaction
    updatedCards = await db.$transaction(transaction);
  } catch {
    return {
      error: 'Failed to reorder',
    };
  }

  // Revalidate the board path to reflect UI changes
  revalidatePath(`/board/${boardId}`);
  return { data: updatedCards };
};

// Export the action wrapped in validation logic
export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
