'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import React from 'react';


function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function CheckoutForm() {
  const { state, totalPrice, shippingCost, dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = React.useState(false);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: 'Erro no Pagamento',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Payment succeeded
    const orderId = Math.random().toString(36).substr(2, 9);
    toast({
      title: 'Pagamento aprovado!',
      description: 'Seu pedido está sendo preparado.',
      variant: 'default',
    });
    dispatch({ type: 'CLEAR_CART' });
    router.push(`/order/${orderId}`);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      <div>
        <h3 className="mb-6 text-xl font-semibold">Resumo do Pedido</h3>
        <div className="space-y-3">
          {state.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxa de Entrega</span>
            <span>{shippingCost > 0 ? formatCurrency(shippingCost) : 'Grátis'}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalPrice + shippingCost)}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-xl font-semibold">Informações de Pagamento</h3>
         <PaymentElement />
          <Button type="submit" className="w-full mt-6" size="lg" disabled={isLoading || !stripe || !elements}>
            {isLoading ? 'Processando...' : `Pagar ${formatCurrency(totalPrice + shippingCost)}`}
          </Button>
      </div>
    </div>
    </form>
  );
}
