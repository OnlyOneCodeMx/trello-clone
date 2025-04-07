/**
 * Delete Board Schema
 *
 * This schema is used to validate the input data for deleting a board.
 * It ensures that the `id` of the board to be deleted is a valid string.
 */

import { z } from 'zod';

export const DeleteBoard = z.object({
  id: z.string(),
});
