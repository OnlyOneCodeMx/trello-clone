/**
 * Create Card Action
 *
 * This server action handles the creation of a new card within a specific list.
 * It assigns the card to the given list and places it at the end based on order.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { CreateCard } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Create Card action
 *
 * Creates a new card in the specified list, assigning it the next available order.
 *
 * @param {InputType} data - Input containing title, listId, and boardId
 * @returns {Promise<ReturnType>} Promise resolving to the created card or an error
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, boardId, listId } = data;
  let card;

  try {
    // Verify the list exists and belongs to the current organization
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId: orgId!,
        },
      },
    });
    if (!list) {
      return {
        error: 'List not found',
      };
    }

    // Find the last card in the list to determine the next order value
    const lastCard = await db.card.findFirst({
      where: {
        listId: listId,
      },
      orderBy: {
        order: 'desc',
      },
      select: { order: true },
    });

    // Assign the new card an order value after the last card (or 1 if none exist)
    const newOrder = lastCard ? lastCard.order + 1 : 1;

    // Create the new card with the provided title and computed order
    card = await db.card.create({
      data: {
        title,
        listId: listId,
        order: newOrder,
      },
    });

    // Log the board creation in the audit system
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: 'Failed to create',
    };
  }

  // Revalidate board path to reflect UI changes
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

// Export the action wrapped in validation logic
export const createCard = createSafeAction(CreateCard, handler);
