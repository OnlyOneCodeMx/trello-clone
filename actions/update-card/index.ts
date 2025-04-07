/**
 * Update Card Action
 *
 * This server action handles the update of an existing card.
 * It validates user permissions and updates the card fields
 * in the database.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateCard } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Update Card action
 *
 * Updates the card with the provided fields after validating
 * user permissions and organization ownership.
 *
 * @param {InputType} data - The input data containing card ID, board ID and updated values
 * @returns {Promise<ReturnType>} Promise resolving to the updated card or an error message
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id, boardId, ...values } = data;
  let card;

  try {
    // Update the card fields in the database
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId: orgId!,
          },
        },
      },
      data: {
        ...values,
      },
    });

    // Log the card update in the audit system
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    });
  } catch {
    return {
      error: 'Failed to update',
    };
  }

  // Revalidate the board path to reflect changes in UI
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

// Export the action wrapped in validation logic
export const updateCard = createSafeAction(UpdateCard, handler);
