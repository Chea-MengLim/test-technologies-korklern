import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentIntentId, amount } = body;

    if (!paymentIntentId) {
      return new Response(JSON.stringify({ error: 'Missing paymentIntentId' }), {
        status: 400,
      });
    }

    // ✅ Use `latest_charge` directly — safer and simpler
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const chargeId = paymentIntent.latest_charge;

    if (!chargeId) {
      return new Response(
        JSON.stringify({ error: 'No charge found for this Payment Intent' }),
        { status: 404 }
      );
    }

    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount, // Optional: in cents, or omit for full refund
    });

    return new Response(JSON.stringify({ success: true, refund }), {
      status: 200,
    });
  } catch (error) {
    console.error('Stripe Refund Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
