/**
 * Types for Update Card Action
 *
 * Defines the types used in the update card action, including the input
 * and return types. The `InputType` is derived from the `UpdateCard` schema,
 * and the `ReturnType` is an `ActionState` that wraps the `Card` entity.
 */
import { z } from 'zod';
import { Card } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { UpdateCard } from './schema';

export type InputType = z.infer<typeof UpdateCard>;
export type ReturnType = ActionState<InputType, Card>;
