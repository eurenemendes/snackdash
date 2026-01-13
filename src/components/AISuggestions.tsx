'use client';

import { useState, useTransition } from 'react';
import { Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getSnackSuggestions } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function AISuggestions() {
  const { state } = useCart();
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleGetSuggestions = () => {
    startTransition(async () => {
      const cartItemNames = state.items.map((item) => item.name);
      const result = await getSnackSuggestions({ cartItems: cartItemNames });
      setSuggestions(result);
      setIsOpen(true);
    });
  };

  return (
    <div>
      <Button
        onClick={handleGetSuggestions}
        disabled={isPending}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {isPending ? 'Gerando sugestões...' : 'Sugestões da IA'}
      </Button>

      {suggestions.length > 0 && (
        <Accordion type="single" collapsible value={isOpen ? 'item-1' : ''} onValueChange={(value) => setIsOpen(!!value)} className="w-full mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm font-semibold">
              Que tal experimentar estas combinações?
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
