import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { ListContainer } from './_components/list-container';

interface BoardIdPageProps {
  params: Promise<{ boardId: string }>;
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { boardId } = await params;
  const { orgId } = await auth();

  const list = await db.list.findMany({
    where: {
      boardId: boardId,
      board: {
        orgId: orgId!,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={boardId} data={list} />
    </div>
  );
};

export default BoardIdPage;
