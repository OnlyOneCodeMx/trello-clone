import { z } from 'zod';

/**
 * Schema for Stripe redirect action
 * This action doesn't require any input parameters, hence the empty object
 */
export const StripeRedirect = z.object({});
