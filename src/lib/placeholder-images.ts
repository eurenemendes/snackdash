import data from './placeholder-images.json';

export type Snack = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
};

export const snacks: Snack[] = data.placeholderImages;
