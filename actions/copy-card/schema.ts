/**
 * Copy Card Schema
 *
 * Validation schema for the copy card action.
 * Defines the required parameters for copying a card.
 */

import { z } from 'zod';

export const CopyCard = z.object({
  id: z.string(),
  boardId: z.string(),
});
