/**
 * Create Card Types
 *
 * Defines the types for the input and return values of the create card action.
 * This type mapping is based on the CreateCard schema and ActionState.
 */

import { z } from 'zod';
import { Card } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { CreateCard } from './schema';

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputType, Card>;
