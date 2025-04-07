/**
 * Copy Card Action
 *
 * This server action handles copying a card within a board list.
 * It creates a duplicate of an existing card with the same content
 * and appends "- Copy" to the title.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { CopyCard } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Copy Card action
 *
 * Copies an existing card and places it at the end of the same list
 * with the title appended with "- Copy".
 *
 * @param {InputType} data - The input data containing card and board IDs
 * @returns {Promise<ReturnType>} Promise resolving to the new card or an error message
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

  let card;

  try {
    // Find the card to copy, ensuring it belongs to the user's organization
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId: orgId!,
          },
        },
      },
    });

    // Verify the card exist
    if (!cardToCopy) {
      return {
        error: 'Card not found',
      };
    }

    // Find the highest order value in the list to place the new card at the end
    const lastCard = await db.card.findFirst({
      where: {
        listId: cardToCopy.listId,
      },
      orderBy: {
        order: 'desc',
      },
      select: { order: true },
    });

    // Calculate the new order value (place at the end of the list)
    const newOrder = lastCard ? lastCard.order + 1 : 1;

    // Create the new card with copied data and modified title
    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      },
    });

    // Log the copy card creation in the audit system
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: 'Failed to copy',
    };
  }

  // Revalidate board path to reflect UI changes
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

// Export the action wrapped in validation logic
export const copyCard = createSafeAction(CopyCard, handler);
