/**
 * Delete Card Action
 *
 * This server action handles the deletion of a card within a board list.
 * It ensures the user is authenticated and authorized to delete a card
 * and logs the deletion event in the audit log.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { DeleteCard } from './schema';
import { InputType, ReturnType } from './types';

/**
 * Handler function for the Delete Card action
 *
 * Deletes a card from a list and logs the event in the audit system.
 * Ensures the user has permission to delete the card.
 *
 * @param {InputType} data - The input data containing card and board IDs
 * @returns {Promise<ReturnType>} Promise resolving to the deleted card or an error message
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
    // Delete the card and ensure it belongs to the user's organization
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId: orgId!,
          },
        },
      },
    });

    // Log the card deletion in the audit system
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE,
    });
  } catch {
    return {
      error: 'Failed to delete',
    };
  }

  // Revalidate board path to reflect UI changes
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

// Export the action wrapped in validation logic
export const deleteCard = createSafeAction(DeleteCard, handler);
