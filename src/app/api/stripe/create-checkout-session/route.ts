import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Stripe with your secret key
// Ensure your STRIPE_SECRET_KEY is set in your .env.local file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use the latest API version
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, customerEmail } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // You can create or retrieve a Stripe customer ID here if needed
    // For simplicity, we'll pass the email directly to the checkout session
    // or use an existing customer ID if you have one.

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // If you have a Stripe customer ID, you can pass it here:
      // customer: existingStripeCustomerId,
      // Otherwise, Stripe can create a customer or use the email:
      customer_email: customerEmail, 
      success_url: `${req.nextUrl.origin}/dashboard/subscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/pricing?canceled=true`,
      // You can add metadata if needed, e.g., userId from your application
      // metadata: {
      //   userId: 'your_internal_user_id',
      // },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error: unknown) {
    console.error('Stripe Checkout Session Error:', error);
        if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
