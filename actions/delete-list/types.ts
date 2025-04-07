/**
 * Types for Delete List Action
 *
 * Defines the types used in the delete list action, including the input
 * and return types. The `InputType` is derived from the `DeleteList` schema,
 * and the `ReturnType` is an `ActionState` that wraps the `List` entity.
 */
import { z } from 'zod';
import { List } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { DeleteList } from './schema';

export type InputType = z.infer<typeof DeleteList>;
export type ReturnType = ActionState<InputType, List>;
