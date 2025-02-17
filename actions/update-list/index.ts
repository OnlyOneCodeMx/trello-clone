'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateList } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = await auth();

  const { title, id, boardId } = data;
  let list;

  try {
    list = await db.list.update({
      where: {
        id,
        boardId: boardId!,
        board: {
          orgId: orgId!,
        },
      },
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to update',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);
