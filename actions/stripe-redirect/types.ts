import { z } from 'zod';
import { ActionState } from '@/lib/create-safe-action';

import { StripeRedirect } from './schema';

/**
 * Type definitions for the Stripe redirect action
 *
 * InputType: The input parameters for the action (empty object)
 * ReturnType: The return value structure, containing either data (URL string) or an error message
 */
export type InputType = z.infer<typeof StripeRedirect>;
export type ReturnType = ActionState<InputType, string>;
