'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  cardNumber: z.string().length(16, 'Número do cartão inválido'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Data de validade inválida (MM/AA)'),
  cvc: z.string().length(3, 'CVC inválido'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function CheckoutForm() {
  const { state, totalPrice, dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    toast({
      title: 'Processando pagamento...',
      description: 'Aguarde enquanto finalizamos seu pedido.',
    });

    // Simulate payment processing
    setTimeout(() => {
      const orderId = Math.random().toString(36).substr(2, 9);
      toast({
        title: 'Pagamento aprovado!',
        description: 'Seu pedido está sendo preparado.',
        variant: 'default',
      });
      dispatch({ type: 'CLEAR_CART' });
      router.push(`/order/${orderId}`);
    }, 2000);
  };

  return (
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
            <span>{formatCurrency(5)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalPrice + 5)}</span>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Informações de Entrega e Pagamento</h3>
            <div className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl><Input placeholder="Seu nome" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço de Entrega</FormLabel>
                    <FormControl><Input placeholder="Sua rua, número e bairro" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl><Input placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-4">
            <FormField control={form.control} name="cardNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Cartão</FormLabel>
                  <FormControl><Input placeholder="**** **** **** ****" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField control={form.control} name="expiryDate" render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Validade</FormLabel>
                    <FormControl><Input placeholder="MM/AA" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="cvc" render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CVC</FormLabel>
                    <FormControl><Input placeholder="***" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Processando...' : `Pagar ${formatCurrency(totalPrice + 5)}`}
          </Button>
        </form>
      </Form>
    </div>
  );
}
