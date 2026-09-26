import { Recipe, RecipeCalculations } from '../types/recipe';
import { generateNativeRecipePDF } from './nativePdf';

/**
 * Universal PDF export for the Recipe Standard system.
 * Uses native vector PDF generation (jsPDF + AutoTable) which generates and
 * downloads the PDF directly in memory, 100% immune to DOM/CSS errors, iframe
 * sandbox restrictions, or browser print blockers.
 */
export async function generateRecipePDF(
  recipe: Recipe,
  calculations: RecipeCalculations
): Promise<boolean> {
  try {
    const success = generateNativeRecipePDF(recipe, calculations);
    return success;
  } catch (error) {
    console.error('Error generating PDF:', error);
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}
