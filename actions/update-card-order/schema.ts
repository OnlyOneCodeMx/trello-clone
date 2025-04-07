/**
 * Schema for Update Card Order Action
 *
 * Defines the input schema required to update the order of cards.
 */
import { z } from 'zod';

export const UpdateCardOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  boardId: z.string(),
});
