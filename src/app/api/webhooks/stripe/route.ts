import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Webhook secret for verifying the event
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      // Verify the event with the webhook secret
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const error = err as Error;
      console.error(`Webhook signature verification failed: ${error.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get the customer ID from the subscription
        const customerId = subscription.customer as string;
        
        // Find the user with this Stripe customer ID
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        
        if (userError || !users) {
          console.error('User not found for Stripe customer:', customerId);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        // Update the user's subscription status
        const { error: updateError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: users.id,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            price_id: subscription.items.data[0]?.price.id,
            quantity: subscription.items.data[0]?.quantity || 1,
            cancel_at_period_end: subscription.cancel_at_period_end,
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            // @ts-expect-error - Stripe types might be outdated
            current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : new Date().toISOString(),
            // @ts-expect-error - Stripe types might be outdated
            current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : new Date().toISOString(),
            created: new Date(subscription.created * 1000).toISOString(),
            ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          });
        
        if (updateError) {
          console.error('Error updating subscription:', updateError);
          return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
        }
        break;
        
      case 'invoice.payment_succeeded':
        // Handle successful payment
        const invoice = event.data.object as Stripe.Invoice;
        // @ts-expect-error - Stripe types might be outdated
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          // Update payment status in your database
          console.log('Payment succeeded for subscription:', subscriptionId);
        }
        break;
        
      case 'invoice.payment_failed':
        // Handle failed payment
        const failedInvoice = event.data.object as Stripe.Invoice;
        // @ts-expect-error - Stripe types might be outdated
        const failedSubscriptionId = failedInvoice.subscription;
        if (failedSubscriptionId) {
          // Update payment status in your database
          console.log('Payment failed for subscription:', failedSubscriptionId);
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook error: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Disable body parsing, we need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
