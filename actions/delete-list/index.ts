'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { DeleteList } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = await auth();

  const { id, boardId } = data;

  let list;

  try {
    list = await db.list.delete({
      where: {
        id,
        boardId: boardId!,
        board: {
          orgId: orgId!,
        },
      },
    });
  } catch (error) {
    return {
      error: 'Failed to delete',
    };
  }

  revalidatePath(`/board/${orgId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
