import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Create a Supabase client specifically for route handlers
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current authenticated user
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the user's profile which contains subscription information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // If the user doesn't have a subscription
    if (!profile.stripe_subscription_id) {
      return NextResponse.json({ subscription: null, message: 'No active subscription found.' });
    }

    // Format the subscription data
    const subscriptionData = {
      userId: profile.id,
      plan: profile.plan_type || 'Monthly',
      status: profile.stripe_subscription_status || 'inactive',
      price: profile.plan_type === 'Annual' ? '$69.99' : '$6.99',
      billingPeriod: profile.plan_type === 'Annual' ? 'yearly' : 'monthly',
      // For a real app, you would calculate this from the subscription data
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      stripeSubscriptionId: profile.stripe_subscription_id,
      stripeCustomerId: profile.stripe_customer_id,
    };

    // If a checkout session ID is passed, it means the user just completed a checkout
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      return NextResponse.json({ 
        subscription: subscriptionData, 
        message: 'Subscription activated successfully!' 
      });
    }

    return NextResponse.json({ subscription: subscriptionData });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
