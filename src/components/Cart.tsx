'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItem from './CartItem';
import { Separator } from './ui/separator';
import { ShoppingCart } from 'lucide-react';
import AISuggestions from './AISuggestions';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function Cart() {
  const { state, totalPrice, shippingCost, setShippingCost } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground/30" />
        <h3 className="mt-6 text-xl font-semibold">Seu carrinho está vazio</h3>
        <p className="mt-2 text-muted-foreground">
          Adicione alguns lanches deliciosos para começar!
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-grow">
        <div className="pr-6">
          {state.items.map((item, index) => (
            <div key={item.id}>
              <CartItem item={item} />
              {index < state.items.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t px-6">
        <div className="py-4">
           <AISuggestions />
        </div>
        <Separator />
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between font-semibold">
            <span>Subtotal</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-semibold">Taxa de entrega</span>
            <RadioGroup
              defaultValue={String(shippingCost)}
              onValueChange={(value) => setShippingCost(Number(value))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="pickup" />
                <Label htmlFor="pickup" className="text-sm font-normal flex justify-between w-full">
                  <span>Retirar na loja</span>
                  <span>Grátis</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0.2" id="delivery" />
                <Label htmlFor="delivery" className="text-sm font-normal flex justify-between w-full">
                  <span>Delivery</span>
                  <span>{formatCurrency(0.2)}</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-lg font-bold text-primary">
            <span>Total</span>
            <span>{formatCurrency(totalPrice + shippingCost)}</span>
          </div>
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">Finalizar Compra</Link>
        </Button>
      </div>
    </div>
  );
}
