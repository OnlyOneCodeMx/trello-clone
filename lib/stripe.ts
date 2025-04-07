/**
 * Stripe Integration
 *
 * This file initializes the Stripe client with the provided API key and API version.
 * It allows you to make API calls to Stripe using the `stripe` instance created here.
 * The `STRIPE_API_KEY` environment variable must be set to connect to the Stripe API.
 */
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});
