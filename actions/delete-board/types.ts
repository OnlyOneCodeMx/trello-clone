/**
 * Types for Delete Board Action
 *
 * Defines the types used in the delete board action, including the input
 * and return types. The `InputType` is derived from the `DeleteBoard` schema,
 * and the `ReturnType` is an `ActionState` that wraps the `Board` entity.
 */

import { z } from 'zod';
import { Board } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { DeleteBoard } from './schema';

export type InputType = z.infer<typeof DeleteBoard>;
export type ReturnType = ActionState<InputType, Board>;
