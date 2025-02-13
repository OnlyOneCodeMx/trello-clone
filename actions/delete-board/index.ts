'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { DeleteBoard } from './schema';
import { InputType, ReturnType } from './types';
import { redirect } from 'next/navigation';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = await auth();

  const { id } = data;

  try {
    await db.board.delete({
      where: {
        id,
        orgId: orgId!,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to delete',
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
