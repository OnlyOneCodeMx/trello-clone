'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

import { CreateCard } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = await auth();

  const { title, boardId, listId } = data;
  let card;

  try {
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

    const lastCard = await db.card.findFirst({
      where: {
        listId: listId,
      },
      orderBy: {
        order: 'desc',
      },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId: listId,
        order: newOrder,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to create',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);
