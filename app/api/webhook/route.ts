/**
 * Stripe Webhook Handler
 *
 * This endpoint processes webhook events from Stripe, specifically handling:
 * - New subscription creation (checkout.session.completed)
 * - Subscription renewal (invoice.payment_succeeded)
 *
 * @param req - Incoming webhook request from Stripe
 */

import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  // Get the raw body and Stripe signature from headers
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') as string;

  // Validate Stripe signature presence
  if (!signature) {
    console.error('No se encontró la firma de Stripe');
    return new NextResponse('No Stripe signature found', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook event using Stripe's signing secret
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    // Return error if signature verification fails
    return new NextResponse('Webhook error', { status: 400 });
  }

  // Extract session data from the event
  const session = event.data.object as Stripe.Checkout.Session;

  // Handle successful checkout completion
  if (event.type === 'checkout.session.completed') {
    // Retrieve the full subscription details
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Validate organization ID presence
    if (!session?.metadata?.orgId) {
      return new NextResponse('Organization ID is required', { status: 400 });
    }

    // Create new subscription record in database
    await db.orgSubscription.create({
      data: {
        orgId: session?.metadata?.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // Handle successful subscription renewal
  if (event.type === 'invoice.payment_succeeded') {
    // Retrieve updated subscription details
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update subscription record with new period end date
    await db.orgSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse('Webhook processed successfully', { status: 200 });
}
