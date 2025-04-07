/**
 * Types for Update Card Order Action
 *
 * Defines the types used in the update card order action, including the input
 * and return types. The `InputType` is derived from the `UpdateCardOrder` schema,
 * and the `ReturnType` is an `ActionState` that wraps an array of `Card` entities.
 */
import { z } from 'zod';
import { Card } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { UpdateCardOrder } from './schema';

export type InputType = z.infer<typeof UpdateCardOrder>;
export type ReturnType = ActionState<InputType, Card[]>;
