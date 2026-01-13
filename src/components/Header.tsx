'use client';

import Link from 'next/link';
import { Sandwich, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import Cart from '@/components/Cart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sandwich className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline text-lg">
            SnackDash
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
              <SheetHeader className="px-6">
                <SheetTitle>Seu Carrinho</SheetTitle>
                <SheetDescription>
                  Revise os itens e prossiga para o checkout.
                </SheetDescription>
              </SheetHeader>
              <Cart />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
