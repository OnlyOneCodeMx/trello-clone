/**
 * Schema for Delete List Action
 *
 * Defines the input schema required to delete a list.
 * Ensures both `id` (list ID) and `boardId` (parent board ID) are valid strings.
 */
import { z } from 'zod';

export const DeleteList = z.object({
  id: z.string(),
  boardId: z.string(),
});
