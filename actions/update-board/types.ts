/**
 * Types for Update Board Action
 *
 * Defines the types used in the update board action, including the input
 * and return types. The `InputType` is derived from the `UpdateBoard` schema,
 * and the `ReturnType` is an `ActionState` that wraps the `Board` entity.
 */
import { z } from 'zod';
import { Board } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { UpdateBoard } from './schema';

export type InputType = z.infer<typeof UpdateBoard>;
export type ReturnType = ActionState<InputType, Board>;
