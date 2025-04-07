/**
 * Types for Create List Action
 *
 * Defines the types used in the create list action, including the input
 * and return types. The `InputType` is derived from the `CreateList` schema,
 * and the `ReturnType` is an `ActionState` that wraps the `List` entity.
 */

import { z } from 'zod';
import { List } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { CreateList } from './schema';

export type InputType = z.infer<typeof CreateList>;
export type ReturnType = ActionState<InputType, List>;
