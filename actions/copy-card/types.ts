/**
 * Copy Card Types
 *
 * Defines the input and return types for the Copy Card action.
 * Uses Zod schema inference for input validation and ActionState
 * to standardize the result structure.
 */
import { z } from 'zod';
import { Card } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { CopyCard } from './schema';

export type InputType = z.infer<typeof CopyCard>;
export type ReturnType = ActionState<InputType, Card>;
