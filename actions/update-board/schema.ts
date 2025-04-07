/**
 * Schema for Update Board Action
 *
 * Defines the input schema required to update a board.
 */
import { z } from 'zod';

export const UpdateBoard = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title is required',
    })
    .min(3, {
      message: 'Title is too short',
    }),
  id: z.string(),
});
