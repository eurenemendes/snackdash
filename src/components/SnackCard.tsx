'use client';

import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import type { Snack } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

interface SnackCardProps {
  snack: Snack;
  className?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function SnackCard({ snack, className }: SnackCardProps) {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: snack });
  };

  return (
    <Card className={cn('flex flex-col overflow-hidden transition-all hover:shadow-lg', className)}>
      <CardHeader className="p-0">
        <div className="relative aspect-[3/2] w-full">
          <Image
            src={snack.imageUrl}
            alt={snack.name}
            fill
            className="object-cover"
            data-ai-hint={snack.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="font-headline text-xl">{snack.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{snack.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-xl font-bold text-primary">
          {formatCurrency(snack.price)}
        </p>
        <Button onClick={handleAddToCart}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}
