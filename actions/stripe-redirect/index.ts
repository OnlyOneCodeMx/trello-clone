'use server';

/**
 * Stripe Redirect Action
 *
 * This server action handles the redirection to Stripe for subscription management.
 * It creates either a checkout session for new subscriptions or a billing portal
 * session for existing subscribers.
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { createSafeAction } from '@/lib/create-safe-action';
import { absoluteUrl } from '@/lib/utils';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

import { StripeRedirect } from './schema';
import { ReturnType } from './types';

/**
 * Handler function for the Stripe redirect action
 *
 * Note: This action doesn't use any input parameters as the schema is empty
 * @returns Promise resolving to either a URL string or an error message
 */
const handler = async (): Promise<ReturnType> => {
  // Authenticate the user and get organization ID
  const { userId, orgId } = await auth();
  const user = await currentUser();

  // Verify authentication
  if (!userId || !orgId || !user) {
    return {
      error: 'Unauthorized',
    };
  }

  // Generate the return URL for after Stripe interaction
  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url = '';

  try {
    // Check if the organization already has a subscription
    const orgSubscription = await db.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      // For existing subscribers, create a billing portal session
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      url = stripeSession.url;
    } else {
      // For new subscribers, create a checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Planify Pro',
                description: 'Unlimited boards for your organization',
              },
              unit_amount: 2000, // $20.00 USD
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId, // Store organization ID for webhook processing
        },
      });

      url = stripeSession.url || '';
    }
  } catch (error) {
    // Handle any errors during Stripe API calls
    console.error('Stripe session creation error:', error);
    return {
      error: 'Something went wrong',
    };
  }

  // Refresh the organization page to reflect subscription changes
  revalidatePath(`/organization/${orgId}`);
  return { data: url };
};

// Export the action with validation
export const stripeRedirect = createSafeAction(StripeRedirect, handler);
