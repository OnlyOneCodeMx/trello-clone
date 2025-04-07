/**
 * Create Board Types
 *
 * Type definitions for the create board action.
 * Provides proper typing for input parameters and return values.
 */
import { z } from 'zod';
import { Board } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { CreateBoard } from './schema';

export type InputType = z.infer<typeof CreateBoard>;
export type ReturnType = ActionState<InputType, Board>;
