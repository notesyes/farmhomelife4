# Stripe Webhook Setup Guide

This guide will walk you through setting up Stripe webhooks for your farm management application.

## Step 1: Access Stripe Dashboard

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign in to your Stripe account
3. Make sure you're in **Live mode** (not Test mode) since you're using live keys

## Step 2: Navigate to Webhooks

1. In the left sidebar, click **Developers**
2. Click **Webhooks**
3. You'll see a list of your existing webhooks (if any)

## Step 3: Create a New Webhook (if needed)

If you don't already have a webhook for your application:

1. Click **+ Add endpoint**
2. Enter your webhook URL: `https://farmhomelife.com/api/stripe/webhooks`
3. Click **Select events**

## Step 4: Configure Webhook Events

Select these specific events that your application needs:

### Required Events:

- ✅ `checkout.session.completed` - When a customer completes payment
- ✅ `invoice.paid` - When a subscription payment succeeds
- ✅ `invoice.payment_failed` - When a subscription payment fails
- ✅ `customer.subscription.deleted` - When a subscription is canceled
- ✅ `customer.subscription.updated` - When subscription details change

### How to Select Events:

1. In the event selection screen, use the search box to find each event
2. Check the box next to each required event
3. Click **Add events** when done
4. Click **Add endpoint** to create the webhook

## Step 5: Get Your Webhook Secret

1. After creating the webhook (or if you already have one), click on the webhook endpoint
2. You'll see a page with webhook details
3. Look for the **Signing secret** section
4. Click **Reveal** to show the secret
5. Copy the entire secret (it starts with `whsec_`)

## Step 6: Add Environment Variable

### In Your Deployment Platform (Coolify):

1. Go to your application configuration
2. Navigate to **Environment Variables**
3. Add a new environment variable:
   - **Name**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_your_actual_signing_secret_here`
4. Save the configuration

### Example:

```
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef1234567890abcdef1234567890abcdef
```

## Step 7: Test Your Webhook

### Option 1: Use Stripe CLI (Recommended)

1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Test webhook: `stripe trigger checkout.session.completed`

### Option 2: Create a Test Transaction

1. Go to your application's pricing page
2. Create a test subscription
3. Complete the payment process
4. Check your application logs to see if webhook events are received

## Step 8: Monitor Webhook Activity

1. In Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Check the **Attempts** tab to see webhook delivery attempts
4. Look for successful (200) responses

## Troubleshooting

### Common Issues:

#### 1. Webhook Returns 400 Error

- **Cause**: Missing or incorrect `STRIPE_WEBHOOK_SECRET`
- **Solution**: Double-check the webhook secret is correctly set

#### 2. Webhook Returns 500 Error

- **Cause**: Application error in webhook handler
- **Solution**: Check your application logs for specific error details

#### 3. Events Not Being Processed

- **Cause**: Wrong events selected or webhook URL incorrect
- **Solution**: Verify webhook URL and selected events

### Webhook URL Format:

```
https://farmhomelife.com/api/stripe/webhooks
```

### Environment Variables Checklist:

- ✅ `STRIPE_PUBLISHABLE_KEY` (pk*live*...)
- ✅ `STRIPE_SECRET_KEY` (sk*live*...)
- ✅ `STRIPE_WEBHOOK_SECRET` (whsec\_...) ← **This is what you need to add**

## Step 9: Deploy and Test

1. After adding the webhook secret, redeploy your application
2. The webhook endpoint should now properly verify incoming events
3. Test with a real subscription to ensure everything works

## Security Notes

- Never share your webhook secret publicly
- The webhook secret is different from your API keys
- Each webhook endpoint has its own unique signing secret
- Webhook secrets start with `whsec_` for live mode and `whsec_test_` for test mode

## What Happens After Setup

Once properly configured, your webhook will:

1. Receive events when customers subscribe/cancel
2. Update subscription status in your database
3. Grant/revoke access to premium features
4. Handle failed payments automatically

Your farm management application will then properly manage user subscriptions and access control.
