'use client'
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { convertToSubCurrency } from "../lib/ConvertToSubCurrency";
import { useEffect, useState } from "react";

export default function CheckoutPage({ amount }) {
    const stripe = useStripe();
    const elements = useElements();

    const [error, setErrorMessage] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/api/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: convertToSubCurrency(amount),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret);
            })
    }, [amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message);
            setIsLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
            }
        })

        if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
        } else {

        }
        setIsLoading(false);
    }

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        )
    }
    return (
        <form onSubmit={handleSubmit}>
            {clientSecret && <PaymentElement />}

            {error && <div>{error}</div>}
            <button
                disabled={!stripe || isLoading}
                className="text-whtie w-full p-5 bg-black mt-2 rounded-md font-bold disable:opacity-50 disabled:animate-pulse disabled:cursor-wait"
            >{!isLoading ? `Pay ${amount}` : "Processing"}</button>
        </form>
    )
}