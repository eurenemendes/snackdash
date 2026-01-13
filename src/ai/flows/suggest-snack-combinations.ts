'use server';

/**
 * @fileOverview Suggests snack combinations based on the user's current cart.
 *
 * - suggestSnackCombinations - A function that suggests snack combinations.
 * - SuggestSnackCombinationsInput - The input type for the suggestSnackCombinations function.
 * - SuggestSnackCombinationsOutput - The return type for the suggestSnackCombinations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSnackCombinationsInputSchema = z.object({
  cartItems: z
    .array(z.string())
    .describe('The list of items currently in the user cart.'),
});

export type SuggestSnackCombinationsInput = z.infer<
  typeof SuggestSnackCombinationsInputSchema
>;

const SuggestSnackCombinationsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('Suggested snack combinations based on the cart items.'),
});

export type SuggestSnackCombinationsOutput = z.infer<
  typeof SuggestSnackCombinationsOutputSchema
>;

export async function suggestSnackCombinations(
  input: SuggestSnackCombinationsInput
): Promise<SuggestSnackCombinationsOutput> {
  return suggestSnackCombinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSnackCombinationsPrompt',
  input: {schema: SuggestSnackCombinationsInputSchema},
  output: {schema: SuggestSnackCombinationsOutputSchema},
  prompt: `You are a snack expert. Given the current items in the user's cart,
  suggest some snack combinations that the user might enjoy.
  Be creative and suggest combinations that the user might not have thought of themselves.
  Only suggest combinations that can reasonably be made/ordered from the current menu.
  The cart items are: {{{cartItems}}}
  Please provide a list of snack combinations the user might enjoy.
  Format your response as a JSON object with a "suggestions" field that contains a list of strings.
  Each string should be a snack combination.
  The response must conform to this Typescript schema:
  ${JSON.stringify(SuggestSnackCombinationsOutputSchema.shape)}`,
});

const suggestSnackCombinationsFlow = ai.defineFlow(
  {
    name: 'suggestSnackCombinationsFlow',
    inputSchema: SuggestSnackCombinationsInputSchema,
    outputSchema: SuggestSnackCombinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
