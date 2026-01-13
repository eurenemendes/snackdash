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
    console.log('[CheckoutForm] handleSubmit acionado.');

    if (!stripe || !elements) {
      console.log('[CheckoutForm] Stripe.js ou Elements não carregado.');
      return;
    }

    setIsLoading(true);

    const orderId = Math.random().toString(36).substr(2, 9);
    const returnUrl = `${window.location.origin}/order/${orderId}`;
    console.log(`[CheckoutForm] ID do pedido gerado: ${orderId}`);
    console.log(`[CheckoutForm] URL de retorno: ${returnUrl}`);


    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error) {
       console.error('[CheckoutForm] Erro ao confirmar pagamento:', error);
       if (error.type === "card_error" || error.type === "validation_error") {
        toast({
            title: 'Erro no Pagamento',
            description: error.message,
            variant: 'destructive',
        });
       } else {
        toast({
            title: 'Erro Inesperado',
            description: 'Ocorreu um erro inesperado. Tente novamente.',
            variant: 'destructive',
        });
       }
      setIsLoading(false);
      return;
    }

    console.log('[CheckoutForm] Pagamento confirmado sem redirecionamento. Isso geralmente não acontece com 3D Secure.');
    // This point will only be reached if the payment succeeds without a redirect.
    // For payments that require a redirect (like 3D Secure), the user will be
    // sent to the `return_url` and this code will not be executed.
    // The logic is now on the order page.
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
