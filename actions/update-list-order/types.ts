/**
 * Types for Update List Order Action
 *
 * Defines the types used in the update list order action, including the input
 * and return types. The `InputType` is derived from the `UpdateListOrder` schema,
 * and the `ReturnType` is an `ActionState` that wraps an array of `List` entities.
 */
import { z } from 'zod';
import { List } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { UpdateListOrder } from './schema';

export type InputType = z.infer<typeof UpdateListOrder>;
export type ReturnType = ActionState<InputType, List[]>;
