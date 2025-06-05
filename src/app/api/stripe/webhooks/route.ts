import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Ensure your STRIPE_SECRET_KEY is set for initializing Stripe client
// and STRIPE_WEBHOOK_SECRET is set for verifying webhook signatures.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil" as Stripe.LatestApiVersion,
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const buf = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    console.error("Webhook Error: Missing stripe-signature header");
    return NextResponse.json(
      { error: "Webhook Error: Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: Fulfill the purchase (e.g., grant access to subscription features)
      // Retrieve subscription details, update your database with user's subscription status.
      // This is where you would link session.customer (Stripe Customer ID)
      // and session.subscription (Stripe Subscription ID) to your internal user record.
      console.log(`Checkout session completed for session ID: ${session.id}`);
      if (session.customer) {
        console.log(`Customer ID: ${session.customer}`);
      }
      if (session.subscription) {
        console.log(`Subscription ID: ${session.subscription}`);
        // IMPORTANT: Store session.subscription and session.customer in your database
        // associated with your application's user ID.
      }
      // Example: await grantSubscriptionAccess(session.metadata?.userId, session.subscription, session.customer);
      break;

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      let actualSubscriptionId: string | null = null;

      // Defensively check for subscription property and its type
      if ("subscription" in invoice && invoice.subscription !== null) {
        const sub = invoice.subscription;
        if (typeof sub === "string") {
          actualSubscriptionId = sub;
        } else if (typeof sub === "object" && sub && "id" in sub) {
          // It's an expanded Stripe.Subscription object
          actualSubscriptionId = (sub as { id: string }).id;
        }
      }
      console.log(
        `Invoice paid: ${invoice.id}, Subscription ID: ${
          actualSubscriptionId || "N/A (from webhook)"
        }`
      );
      // TODO: Handle successful recurring payment. Use actualSubscriptionId if available.
      // Example: if (actualSubscriptionId) { await ensureSubscriptionActive(actualSubscriptionId); }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      let actualSubscriptionId: string | null = null;

      // Defensively check for subscription property and its type
      if ("subscription" in invoice && invoice.subscription !== null) {
        const sub = invoice.subscription;
        if (typeof sub === "string") {
          actualSubscriptionId = sub;
        } else if (typeof sub === "object" && sub && "id" in sub) {
          // It's an expanded Stripe.Subscription object
          actualSubscriptionId = (sub as { id: string }).id;
        }
      }
      console.log(
        `Invoice payment failed: ${invoice.id}, Subscription ID: ${
          actualSubscriptionId || "N/A (from webhook)"
        }`
      );
      // TODO: Handle failed payment. Use actualSubscriptionId if available.
      // Example: if (actualSubscriptionId) { await handleFailedPayment(actualSubscriptionId); }
      break;
    }

    case "customer.subscription.deleted": // Occurs when a subscription is canceled by you or the user
      const subscriptionDeleted = event.data.object as Stripe.Subscription;
      // TODO: Handle subscription cancellation (e.g., revoke access at period end)
      // Note: Stripe sends this event when the subscription is actually deleted (e.g., at the end of the billing period if canceled prior).
      console.log(
        `Subscription canceled/deleted: ${subscriptionDeleted.id}, Status: ${subscriptionDeleted.status}`
      );
      // Example: await revokeSubscriptionAccess(subscriptionDeleted.id);
      break;

    case "customer.subscription.updated":
      const subscriptionUpdated = event.data.object as Stripe.Subscription;
      // TODO: Handle subscription updates (e.g., plan changes, status changes like 'trialing', 'active', 'past_due', 'canceled')
      // This is a crucial event for managing subscription lifecycle.
      console.log(
        `Subscription updated: ${subscriptionUpdated.id}, Status: ${subscriptionUpdated.status}`
      );
      // Example: await updateSubscriptionStatus(subscriptionUpdated.id, subscriptionUpdated.status, subscriptionUpdated.items.data[0].price.id);
      break;

    // Add other event types critical for your business logic:
    // case 'customer.subscription.trial_will_end':
    //   // Handle upcoming trial end, perhaps send a reminder email.
    //   break;

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
