/**
 * Copy List Types
 *
 * This file defines the input and return types for the Copy List action,
 * using Zod for schema inference and a custom ActionState utility for result typing.
 */
import { z } from 'zod';
import { List } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { CopyList } from './schema';

export type InputType = z.infer<typeof CopyList>;
export type ReturnType = ActionState<InputType, List>;
