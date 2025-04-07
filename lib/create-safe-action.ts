/**
 * Create Safe Action Utility
 *
 * This utility provides a wrapper for server actions that handles validation
 * and error handling in a consistent way across the application.
 * It validates input data against a schema before passing it to the handler.
 */
import { z } from 'zod';

/**
 * Field errors type for validation failures
 *
 * Maps each field of the input type to an array of error messages
 * @template T - The input data type
 */
export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

/**
 * Action state type for server action responses
 *
 * Represents either a successful operation with data or a failed operation with errors
 * @template TInput - The input data type
 * @template TOutput - The expected output data type on success
 */
export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

/**
 * Creates a safe server action with input validation
 *
 * Wraps a handler function with Zod schema validation to ensure
 * that only valid data is processed. Returns field-specific errors
 * when validation fails.
 *
 * @template TInput - The input data type
 * @template TOutput - The expected output data type on success
 * @param {z.Schema<TInput>} schema - The Zod schema to validate input against
 * @param {function} handler - The function that processes validated data
 * @returns {function} A wrapped function that validates input before processing
 */
export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    // Validate the input data against the schema
    const validationResult = schema.safeParse(data);

    // If validation fails, return the field errors
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    // If validation succeeds, process the data with the handler
    return handler(validationResult.data);
  };
};
