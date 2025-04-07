/**
 * Create Card Schema
 *
 * Validation schema for the create card action.
 * Defines and validates the required fields for card creation.
 */
import { z } from 'zod';

export const CreateCard = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title is required',
    })
    .min(2, {
      message: 'Title is too short',
    }),
  boardId: z.string(),
  listId: z.string(),
});
