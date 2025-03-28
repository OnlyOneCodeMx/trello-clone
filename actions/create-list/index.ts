'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';

import { CreateList } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = await auth();

  const { title, boardId } = data;
  let list;

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId: orgId!,
      },
    });

    if (!board) {
      return {
        error: 'Board not found',
      };
    }

    const lastList = await db.list.findFirst({
      where: {
        boardId: boardId,
      },
      orderBy: {
        order: 'desc',
      },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        title,
        boardId: boardId!,
        order: newOrder,
      },
    });

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: 'Failed to create',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const createList = createSafeAction(CreateList, handler);
