import { Recipe } from '../types/recipe';
import { DEFAULT_RECIPES } from '../data/defaultRecipes';
import { calculateRecipeTotals, formatCurrency, formatQuantity } from '../utils/calculations';

const STORAGE_KEY_RECIPES = 'receta_estandar_recipes_v1';
const STORAGE_KEY_ACTIVE_ID = 'receta_estandar_active_id';

export function loadStoredRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECIPES);
    if (!raw) {
      saveStoredRecipes(DEFAULT_RECIPES);
      return DEFAULT_RECIPES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_RECIPES;
  } catch (error) {
    console.warn('Error reading recipes from localStorage, falling back to defaults:', error);
    return DEFAULT_RECIPES;
  }
}

export function saveStoredRecipes(recipes: Recipe[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes to localStorage:', error);
  }
}

export function getActiveRecipeId(recipes: Recipe[]): string {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (savedId && recipes.some((r) => r.id === savedId)) {
      return savedId;
    }
    return recipes[0]?.id || '';
  } catch {
    return recipes[0]?.id || '';
  }
}

export function setActiveRecipeId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch (error) {
    console.error('Error saving active recipe id:', error);
  }
}

/**
 * Downloads a Recipe as a clean JSON file
 */
export function exportRecipeAsJSON(recipe: Recipe): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recipe, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `${recipe.nombre.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_ficha_tecnica.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Downloads a Recipe as a CSV spreadsheet
 */
export function exportRecipeAsCSV(recipe: Recipe): void {
  const calcs = calculateRecipeTotals(recipe);
  const rows: string[][] = [
    ['FICHA TÉCNICA - RECETA ESTÁNDAR TÉCNICO EN COCINA'],
    ['Receta:', recipe.nombre],
    ['Fecha:', recipe.fecha],
    ['Creador:', recipe.creador],
    ['Establecimiento:', recipe.establecimiento],
    ['No. PAX:', recipe.pax.toString()],
    [''],
    [
      'ITEM',
      'INGREDIENTE',
      'MISE EN PLACE',
      'UNIDAD',
      'CANTIDAD X 1 PAX',
      'CANTIDAD TOTAL',
      'VALOR UNIDAD MINIMA (COP)',
      'VALOR X 1 PAX (COP)',
      'VALOR TOTAL (COP)',
    ],
  ];

  calcs.ingredientesCalculados.forEach((item) => {
    rows.push([
      `#${String(item.item).padStart(2, '0')}`,
      `"${(item.ingrediente || '').replace(/"/g, '""')}"`,
      `"${(item.miseEnPlace || '').replace(/"/g, '""')}"`,
      item.unidad,
      formatQuantity(item.cantidadPorPax),
      formatQuantity(item.cantidadTotal),
      formatQuantity(item.valorUnidadMinima),
      formatQuantity(item.valorPorPax),
      formatQuantity(item.valorTotal),
    ]);
  });

  rows.push(['']);
  rows.push(['RESUMEN DE COSTEO']);
  rows.push(['Costo Total de Materia Prima:', formatCurrency(calcs.costoMateriaPrimaTotal)]);
  rows.push(['Costo Materia Prima x 1 PAX:', formatCurrency(calcs.costoMateriaPrimaPorPax)]);
  rows.push(['% Merma de Producción / Cocción:', `${calcs.mermaPorcentaje}%`]);
  rows.push(['Costo con Merma:', formatCurrency(calcs.costoConMerma)]);
  rows.push(['% de Costo (Food Cost):', `${calcs.porcentajeCosto}%`]);
  rows.push(['Precio de Venta Base:', formatCurrency(calcs.precioVenta)]);
  rows.push(['Impoconsumo (8%):', calcs.impoconsumoActivo ? `${calcs.impoconsumoPorcentaje}% (${formatCurrency(calcs.valorImpoconsumo)})` : 'NO ($ 0)']);
  rows.push(['PRECIO REAL DE VENTA TOTAL (CERRADO):', formatCurrency(calcs.precioRealVenta)]);
  rows.push(['PRECIO REAL DE VENTA X 1 PAX (CARTA CERRADO):', formatCurrency(calcs.precioRealVentaPorPax)]);
  if (calcs.preciosRedondeados) {
    rows.push(['Precio Real Total Sin Redondear:', formatCurrency(calcs.precioRealVentaSinRedondeo)]);
    rows.push(['Precio Carta x 1 PAX Sin Redondear:', formatCurrency(calcs.precioRealVentaPorPaxSinRedondeo)]);
  }

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.join(';')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${recipe.nombre.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_costeo.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
