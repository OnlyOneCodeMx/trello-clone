/**
 * Types for Update List Action
 *
 * Defines the types used in the update list action, including the input
 * and return types. The `InputType` is derived from the `UpdateList` schema,
 * and the `ReturnType` is an `ActionState` that wraps the `List` entity.
 */
import { z } from 'zod';
import { List } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { UpdateList } from './schema';

export type InputType = z.infer<typeof UpdateList>;
export type ReturnType = ActionState<InputType, List>;
