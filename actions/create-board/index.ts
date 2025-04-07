/**
 * Create Board Action
 *
 * This server action handles the creation of a new board.
 * It validates user permissions, checks subscription status,
 * verifies image data, and creates the board in the database.
 */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { hasAvailableCount, incrementAvailableCount } from '@/lib/org-limite';

import { InputType, ReturnType } from './types';
import { CreateBoard } from './schema';
import { checkSubscription } from '@/lib/suscription';

/**
 * Handler function for the Create Board action
 *
 * Creates a new board with the specified title and image,
 * after verifying permissions and quota availability.
 *
 * @param {InputType} data - The input data containing board title and image
 * @returns {Promise<ReturnType>} Promise resolving to the new board or an error message
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = await auth();

  // Verify user authentication and organization membership
  if (!orgId || !userId) {
    return {
      error: 'Unauthorized',
    };
  }

  // Check if the user can create a new board based on quota
  const canCreate = await hasAvailableCount();
  const isPro = await checkSubscription();

  // Return error if free quota is exceeded and user is not on Pro plan
  if (!canCreate && !isPro) {
    return {
      error:
        'You have reached your limit of free boards. Please upgrade to create more.',
    };
  }

  const { title, image } = data;

  // Parse the image string to extract components
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split('|');

  // Validate that all image data is present
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageUserName ||
    !imageLinkHTML
  ) {
    return {
      error: 'Missing fields. Failed to create board.',
    };
  }

  let board;

  try {
    // Create the board in the database
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      },
    });

    // Increment the board count for free tier users
    if (!isPro) {
      await incrementAvailableCount();
    }

    // Log the board creation in the audit system
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: 'Failed to create.',
    };
  }

  // Revalidate board path to reflect UI changes
  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

// Export the action wrapped in validation logic
export const createBoard = createSafeAction(CreateBoard, handler);
