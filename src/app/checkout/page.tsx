'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "@/components/CheckoutForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPaymentIntent } from '@/lib/actions';
import { useCart } from '@/context/CartContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const { totalPrice, shippingCost } = useCart();
  const amount = Math.round((totalPrice + shippingCost) * 100);

  useEffect(() => {
    if (amount > 0) {
      createPaymentIntent(amount)
        .then(data => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            }
        });
    }
  }, [amount]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
            <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Finalizar Pedido</CardTitle>
            </CardHeader>
            <CardContent>
                {clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                ) : (
                    <div className='text-center'>Carregando informações de pagamento...</div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
