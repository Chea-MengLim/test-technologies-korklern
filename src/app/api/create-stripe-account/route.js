// app/api/create-stripe-account/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email;

    // 1. Create connected account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email,
    });

    console.log("account", account);


    // 2. Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/return`,
      type: 'account_onboarding',
    });

    

    return Response.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create account' }), {
      status: 500,
    });
  }
}
