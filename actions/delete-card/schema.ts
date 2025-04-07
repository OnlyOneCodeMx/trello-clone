/**
 * Delete Card Schema
 *
 * Defines the validation schema for the input data needed to delete a card.
 * It ensures that both `id` (card ID) and `boardId` (the board the card belongs to) are valid strings.
 */

import { z } from 'zod';

export const DeleteCard = z.object({
  id: z.string(),
  boardId: z.string(),
});
