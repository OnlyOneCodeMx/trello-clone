/**
 * List Container Component
 *
 * This component manages the board's lists with drag and drop functionality:
 * - Horizontal list reordering
 * - Card dragging between lists
 * - Real-time order updates
 * - Optimistic UI updates
 * - Server state synchronization
 *
 * Features include:
 * - List and card reordering persistence
 * - Drag and drop context management
 * - Toast notifications for user feedback
 * - New list creation capability
 *
 * @param data - Array of lists with their cards
 * @param boardId - Unique identifier of the current board
 */

'use client';

import { toast } from 'sonner';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';

import { ListWithCards } from '@/types';
import { useAction } from '@/hooks/use-action';
import { updateListOrder } from '@/actions/update-list-order';
import { updateCardOrder } from '@/actions/update-card-order';

import { ListForm } from './list-form';
import { ListItem } from './list-item';

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

// Utility function to reorder items in an array
function reorder<t>(list: t[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  // State to track the ordered lists and cards
  const [orderedData, setOrderedData] = useState(data);

  // Action to update list order in the database
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success('List reordered');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Action to update card order in the database
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success('Card reordered');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Update local state when data from props changes
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  // Handle the end of a drag operation
  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Return if dropped outside a valid droppable area
    if (!destination) {
      return;
    }

    // Return if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle list reordering
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // Handle card reordering
    if (type === 'card') {
      const newOrderedData = [...orderedData];

      // Find source and destination lists
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );
      if (!sourceList || !destList) {
        return;
      }

      // Initialize cards arrays if they don't exist
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destList.cards) {
        destList.cards = [];
      }

      // Handle reordering within the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ boardId: boardId, items: reorderedCards });
      } else {
        // Handle moving card between different lists
        const [moveCard] = sourceList.cards.splice(source.index, 1);

        // Update the listId of the moved card
        moveCard.listId = destination.droppableId;

        // Insert card at the destination position
        destList.cards.splice(destination.index, 0, moveCard);

        // Update order for all cards in both lists
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: destList.cards,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full">
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
