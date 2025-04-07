/**
 * Custom Hook to Handle Actions with Error and Success Handling
 *
 * This hook is designed to handle asynchronous actions, providing
 * state management for success, error, loading, and field errors.
 * It facilitates error handling, success callbacks, and loading states
 * for actions that return data or errors.
 */
import { useState, useCallback } from 'react';

import { ActionState, FieldErrors } from '@/lib/create-safe-action';

// Defines the structure of the Action function
type Action<TInput, TOutput> = (
  data: TInput
) => Promise<ActionState<TInput, TOutput>>;

// Defines the structure of options for success, error, and completion callbacks
interface UseActionOption<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

/**
 * Custom Hook for Handling Action Execution, Errors, and State Management
 *
 * This hook encapsulates the execution of asynchronous actions and manages
 * their state, including data, errors, field validation errors, and loading state.
 * It provides convenient ways to handle success, error, and completion events.
 *
 * @param {Action<TInput, TOutput>} action - The asynchronous action to be executed
 * @param {UseActionOption<TOutput>} options - Optional callbacks for handling success, error, and completion
 * @returns {object} - Returns an object containing the action execution state, field errors, and callbacks
 */

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOption<TOutput> = {}
) => {
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<TInput> | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Function to execute the provided action with the given input
   *
   * This function triggers the action, updates state based on the result,
   * and calls the provided callbacks (onSuccess, onError, onComplete).
   *
   * @param {TInput} input - The input data to be passed to the action
   */

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);

      try {
        const result = await action(input); // Execute the action with the input

        if (!result) {
          return;
        }

        setFieldErrors(result.fieldErrors);

        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }
        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }
      } finally {
        setIsLoading(false);
        options.onComplete?.();
      }
    },
    [action, options]
  );

  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading,
  };
};
