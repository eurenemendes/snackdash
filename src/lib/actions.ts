'use server';

import {
  suggestSnackCombinations,
  type SuggestSnackCombinationsInput,
} from '@/ai/flows/suggest-snack-combinations';

export async function getSnackSuggestions(
  input: SuggestSnackCombinationsInput
) {
  try {
    const result = await suggestSnackCombinations(input);
    return result.suggestions;
  } catch (error) {
    console.error('Error getting snack suggestions:', error);
    return ['Desculpe, não foi possível gerar sugestões no momento.'];
  }
}
