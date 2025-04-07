/**
 * Schema for Update List Action
 *
 * Defines the input schema required to update a list.
 */
import { z } from 'zod';

export const UpdateList = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title is required',
    })
    .min(3, {
      message: 'Title is too short',
    }),
  id: z.string(),
  boardId: z.string(),
});
