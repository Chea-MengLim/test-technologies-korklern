import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { amount } = await request.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            transfer_data: {
                destination: "acct_1RLH2gB28GjdxTpf", // your test connected account
              },
        });

        console.log("Payment Intent", paymentIntent);

        // const accountId = "acct_1RLHGqB6pxpLxnAM"; // hardcoded for test

        // const loginLink = await stripe.accounts.createLoginLink(accountId);
        // console.log("Generated Login Link:", loginLink.url);

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}