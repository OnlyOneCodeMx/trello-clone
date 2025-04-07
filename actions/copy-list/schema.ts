/**
 * Copy List Schema
 *
 * Validation schema for the copy list action.
 * Ensures the required fields are present when copying a list.
 */
import { z } from 'zod';

export const CopyList = z.object({
  id: z.string(),
  boardId: z.string(),
});
