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
  console.log(`[actions.ts] Criando PaymentIntent para o valor: ${amount}`);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      payment_method_types: ['card', 'pix'],
    });

    console.log('[actions.ts] PaymentIntent criado com sucesso:', paymentIntent.id);
    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('[actions.ts] Erro ao criar PaymentIntent:', error);
    return { error: 'Could not create payment intent' };
  }
}
