'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { InputType, ReturnType } from './types';
import { CreateBoard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = await auth();

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split('|');

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageUserName ||
    !imageLinkHTML
  ) {
    return {
      error: 'Missing fields. Faild to create board.',
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        orgId: orgId!,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to create.',
    };
  }

  revalidatePath(`/board.${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
