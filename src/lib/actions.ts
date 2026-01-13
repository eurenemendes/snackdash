'use server';

import {
  suggestSnackCombinations,
  type SuggestSnackCombinationsInput,
} from '@/ai/flows/suggest-snack-combinations';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function getSnackSuggestions(
  input: SuggestSnackCombinationsInput
) {
  try {
    const result = await suggestSnackCombinations(input);
    return result.suggestions;
  } catch (error) {
    console.error('Error getting snack suggestions:', error);
    return ['Desculpe, não foi possível gerar sugestões no momento.'];
  }
}

export async function createPaymentIntent(amount: number) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { error: 'Could not create payment intent' };
  }
}
