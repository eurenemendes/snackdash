import type { Snack } from '@/lib/placeholder-images';

export type CartItem = Snack & {
  quantity: number;
};
