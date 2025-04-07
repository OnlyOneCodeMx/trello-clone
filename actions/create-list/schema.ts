/**
 * Create List Schema
 *
 * Validation schema for the create list action.
 * Defines and validates the required fields for list creation.
 */
import { z } from 'zod';

export const CreateList = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title is required',
    })
    .min(2, {
      message: 'Title is too short',
    }),
  boardId: z.string(),
});
