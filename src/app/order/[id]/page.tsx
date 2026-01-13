'use client';

import { useEffect } from 'react';
import OrderTracker from "@/components/OrderTracker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';

export default function OrderPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { dispatch } = useCart();

  useEffect(() => {
    console.log('[OrderPage] Página carregada.');
    // This effect runs when the user is redirected back from Stripe 3D Secure.
    const url = new URL(window.location.href);
    const clientSecret = url.searchParams.get('payment_intent_client_secret');
    
    if (clientSecret) {
      console.log(`[OrderPage] Encontrado payment_intent_client_secret na URL: ${clientSecret}`);
      toast({
        title: 'Pagamento aprovado!',
        description: 'Seu pedido está sendo preparado.',
        variant: 'default',
      });
      console.log('[OrderPage] Limpando o carrinho.');
      dispatch({ type: 'CLEAR_CART' });
    } else {
      console.log('[OrderPage] Nenhum payment_intent_client_secret encontrado na URL.');
    }
  }, [dispatch, toast]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-secondary/50">
          <CardTitle className="text-2xl font-headline">Oba, seu pedido foi confirmado!</CardTitle>
          <CardDescription>
            ID do Pedido: <span className="font-mono font-medium text-primary">{params.id}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="mb-6 text-lg font-semibold">Acompanhe seu lanche:</h3>
          <OrderTracker />
        </CardContent>
      </Card>
    </div>
  );
}
