/**
 * Types for Delete Card Action
 *
 * Defines the types used in the delete card action, including the input
 * and return types. The `InputType` is derived from the `DeleteCard` schema,
 * and the `ReturnType` is an `ActionState` that wraps the `Card` entity.
 */

import { z } from 'zod';
import { Card } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { DeleteCard } from './schema';

export type InputType = z.infer<typeof DeleteCard>;
export type ReturnType = ActionState<InputType, Card>;
