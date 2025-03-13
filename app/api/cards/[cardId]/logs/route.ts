import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    const { cardId } = await params;

    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error('[CARD_LOGS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
