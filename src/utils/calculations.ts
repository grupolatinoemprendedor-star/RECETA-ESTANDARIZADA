import { IngredientItem, Recipe, RecipeCalculations, CalculatedIngredient, RoundingMethod } from '../types/recipe';

/**
 * Rounds a commercial price to a "closed price" (precio cerrado):
 *
 * - 'mil' (PREDETERMINADO):
 *   Regla exacta solicitada:
 *   - Si los cientos están entre 1 y 499 (ej. entre 13.100 y 13.400 / 13.499) -> se redondea hacia abajo a 13.000 cerrados.
 *   - Si los cientos están entre 500 y 999 (ej. entre 13.500 y 13.900 / 13.999) -> se redondea hacia arriba a 14.000 cerrados.
 *   Fórmula: Si (precio % 1000) < 500 -> Math.floor(precio / 1000) * 1000, si no -> Math.ceil(precio / 1000) * 1000 (Math.round(precio / 1000) * 1000).
 *
 * - 'centena': Redondea a los $100 más cercanos (ej. 13.435 -> 13.400 o 13.500).
 * - 'cincuenta': Redondea a $50.
 * - 'exacto_entero': Redondea a peso entero sin decimales.
 */
export function roundToClosedPrice(amount: number, method: RoundingMethod = 'mil'): number {
  if (amount <= 0 || isNaN(amount)) return 0;
  switch (method) {
    case 'mil':
    default: {
      // Regla de miles cerrados:
      // residuo < 500 (ej: 13.100, 13.200, 13.300, 13.400) -> 13.000
      // residuo >= 500 (ej: 13.500, 13.600, 13.700, 13.800, 13.900) -> 14.000
      const remainder = amount % 1000;
      if (remainder < 500) {
        return Math.floor(amount / 1000) * 1000;
      } else {
        return Math.ceil(amount / 1000) * 1000;
      }
    }
    case 'centena':
      return Math.round(amount / 100) * 100;
    case 'cincuenta':
      return Math.round(amount / 50) * 50;
    case 'exacto_entero':
      return Math.round(amount);
  }
}

/**
 * Returns conversion factor from the ingredient unit to its minimum unit
 * (e.g. kg -> g is 1000; L -> ml is 1000; docena -> unidad is 12; libra -> g is 500)
 */
export function getUnitConversionFactor(unit: string): { factor: number; minUnitName: string } {
  const normalized = (unit || '').toLowerCase().trim();
  switch (normalized) {
    case 'kg':
    case 'kilogramo':
    case 'kilos':
      return { factor: 1000, minUnitName: 'g' };
    case 'l':
    case 'litro':
    case 'litros':
      return { factor: 1000, minUnitName: 'ml' };
    case 'docena':
    case 'docenas':
      return { factor: 12, minUnitName: 'unidad' };
    case 'libra':
    case 'libras':
    case 'lb':
      // Estándar gastronómico en Colombia / Latinoamérica: 1 libra = 500 gramos
      return { factor: 500, minUnitName: 'g' };
    case 'arroba':
    case 'arrobas':
    case '@':
      // 1 arroba = 12.5 kg = 12,500 g
      return { factor: 12500, minUnitName: 'g' };
    case 'g':
    case 'gramo':
    case 'gramos':
      return { factor: 1, minUnitName: 'g' };
    case 'ml':
    case 'mililitro':
    case 'mililitros':
      return { factor: 1, minUnitName: 'ml' };
    case 'unidad':
    case 'unidades':
    case 'und':
    case 'u':
      return { factor: 1, minUnitName: 'unidad' };
    default:
      return { factor: 1, minUnitName: normalized || 'unidad' };
  }
}

/**
 * Calculates total quantity: Qty x 1 Pax * No. Pax
 */
export function calculateTotalQuantity(qtyPerPax: number, pax: number): number {
  if (!qtyPerPax || isNaN(qtyPerPax) || qtyPerPax < 0) return 0;
  const safePax = Math.max(1, pax || 1);
  return Number((qtyPerPax * safePax).toFixed(4));
}

/**
 * Calculates unit cost taking conversion into account if unit is scaled (e.g., kg to g)
 */
export function calculateCostPerPax(qtyPerPax: number, unitCostMin: number, unit: string): number {
  if (!qtyPerPax || isNaN(qtyPerPax) || qtyPerPax < 0) return 0;
  if (!unitCostMin || isNaN(unitCostMin) || unitCostMin < 0) return 0;

  const { factor } = getUnitConversionFactor(unit);
  // Total minimal units for 1 pax = qtyPerPax * factor
  const totalMinUnitsPerPax = qtyPerPax * factor;
  return Number((totalMinUnitsPerPax * unitCostMin).toFixed(4));
}

/**
 * Calculates total cost for all Pax
 */
export function calculateIngredientTotal(qtyPerPax: number, pax: number, unitCostMin: number, unit: string): number {
  const costPerPax = calculateCostPerPax(qtyPerPax, unitCostMin, unit);
  const safePax = Math.max(1, pax || 1);
  return Number((costPerPax * safePax).toFixed(4));
}

/**
 * Calculates raw material cost (Sum of all ingredients' total value)
 */
export function calculateRawMaterialCost(ingredients: CalculatedIngredient[]): number {
  return ingredients.reduce((sum, item) => sum + (item.valorTotal || 0), 0);
}

/**
 * Calculates cost with waste:
 * COSTO CON MERMA = COSTO BASE ÷ (1 − % MERMA)
 */
export function calculateCostWithWaste(rawCost: number, wastePercentage: number): number {
  if (rawCost <= 0 || isNaN(rawCost)) return 0;
  const safeWaste = Math.min(99.9, Math.max(0, wastePercentage || 0));
  const factor = 1 - safeWaste / 100;
  if (factor <= 0) return rawCost;
  return Number((rawCost / factor).toFixed(4));
}

/**
 * Calculates selling price:
 * PRECIO DE VENTA = COSTO CON MERMA ÷ (% COSTO / 100)
 */
export function calculateSellingPrice(costWithWaste: number, costPercentage: number): number {
  if (costWithWaste <= 0 || isNaN(costWithWaste)) return 0;
  const safeCostPercent = Math.min(100, Math.max(1, costPercentage || 30));
  const factor = safeCostPercent / 100;
  return Number((costWithWaste / factor).toFixed(4));
}

/**
 * Calculates impoconsumo (National Consumption Tax in Colombia, typically 8%)
 */
export function calculateTax(sellingPrice: number, taxEnabled: boolean, taxRate: number): number {
  if (!taxEnabled || sellingPrice <= 0 || isNaN(sellingPrice)) return 0;
  const safeTaxRate = Math.max(0, taxRate || 8);
  return Number((sellingPrice * (safeTaxRate / 100)).toFixed(4));
}

/**
 * Calculates real final selling price:
 * PRECIO REAL DE VENTA = PRECIO DE VENTA + IMPOCONSUMO
 */
export function calculateRealSellingPrice(sellingPrice: number, taxAmount: number): number {
  const safeSelling = Math.max(0, sellingPrice || 0);
  const safeTax = Math.max(0, taxAmount || 0);
  return Number((safeSelling + safeTax).toFixed(4));
}

/**
 * Central calculation engine: evaluates the entire recipe
 */
export function calculateRecipeTotals(recipe: Recipe): RecipeCalculations {
  const safePax = Math.max(1, recipe.pax || 1);
  let incompletosCount = 0;

  const ingredientesCalculados: CalculatedIngredient[] = recipe.ingredientes.map((item, index) => {
    const qty = Number(item.cantidadPorPax) || 0;
    const cost = Number(item.valorUnidadMinima) || 0;
    const unit = item.unidad === 'personalizada' ? (item.customUnidad || 'unidad') : item.unidad;

    const hasIngrediente = !!(item.ingrediente && item.ingrediente.trim());
    const hasQty = qty > 0;
    const hasCost = cost > 0;

    let incompleto = false;
    let mensajeIncompleto: string | undefined;

    if (hasIngrediente && hasQty && !hasCost) {
      incompleto = true;
      incompletosCount++;
      const { minUnitName } = getUnitConversionFactor(unit);
      mensajeIncompleto = `Pendiente: ingresa el valor por ${minUnitName} para costear.`;
    } else if (hasIngrediente && !hasQty && hasCost) {
      incompleto = true;
      incompletosCount++;
      mensajeIncompleto = 'Pendiente: ingresa la cantidad por 1 Pax.';
    }

    const cantidadTotal = calculateTotalQuantity(qty, safePax);
    const valorPorPax = calculateCostPerPax(qty, cost, unit);
    const valorTotal = calculateIngredientTotal(qty, safePax, cost, unit);

    return {
      item: index + 1,
      ingrediente: item.ingrediente || '',
      miseEnPlace: item.miseEnPlace || '',
      unidad: unit,
      cantidadPorPax: qty,
      cantidadTotal,
      valorUnidadMinima: cost,
      valorPorPax,
      valorTotal,
      incompleto,
      mensajeIncompleto,
    };
  });

  const costoMateriaPrimaTotal = calculateRawMaterialCost(ingredientesCalculados);
  const costoMateriaPrimaPorPax = safePax > 0 ? costoMateriaPrimaTotal / safePax : 0;

  const mermaPorcentaje = Math.min(99.9, Math.max(0, Number(recipe.mermaPorcentaje) || 0));
  const costoConMerma = calculateCostWithWaste(costoMateriaPrimaTotal, mermaPorcentaje);
  const costoConMermaPorPax = safePax > 0 ? costoConMerma / safePax : 0;

  const porcentajeCosto = Math.min(100, Math.max(1, Number(recipe.porcentajeCosto) || 30));
  const precioVenta = calculateSellingPrice(costoConMerma, porcentajeCosto);
  const precioVentaPorPax = safePax > 0 ? precioVenta / safePax : 0;

  const impoconsumoActivo = !!recipe.impoconsumoActivo;
  const impoconsumoPorcentaje = Math.max(0, Number(recipe.impoconsumoPorcentaje) || 8);
  const valorImpoconsumo = calculateTax(precioVenta, impoconsumoActivo, impoconsumoPorcentaje);
  const valorImpoconsumoPorPax = safePax > 0 ? valorImpoconsumo / safePax : 0;

  const rawPrecioRealVenta = calculateRealSellingPrice(precioVenta, valorImpoconsumo);
  const rawPrecioRealVentaPorPax = safePax > 0 ? rawPrecioRealVenta / safePax : 0;

  // Redondeo de precios cerrados (por defecto ACTIVO, método por miles cerrados según regla 500)
  const preciosRedondeados = recipe.redondearPrecios !== false; // Activo por defecto
  const metodoRedondeo = recipe.metodoRedondeo || 'mil';

  const precioRealVenta = preciosRedondeados
    ? roundToClosedPrice(rawPrecioRealVenta, metodoRedondeo)
    : rawPrecioRealVenta;

  const precioRealVentaPorPax = preciosRedondeados
    ? roundToClosedPrice(rawPrecioRealVentaPorPax, metodoRedondeo)
    : rawPrecioRealVentaPorPax;

  // Margen Bruto = (Precio de Venta antes de impuestos - Costo con Merma) / Precio de Venta
  const margenBrutoEstimado = precioVenta > 0 ? ((precioVenta - costoConMerma) / precioVenta) * 100 : 0;

  return {
    ingredientesCalculados,
    costoMateriaPrimaTotal,
    costoMateriaPrimaPorPax,
    mermaPorcentaje,
    costoConMerma,
    costoConMermaPorPax,
    porcentajeCosto,
    precioVenta,
    precioVentaPorPax,
    impoconsumoActivo,
    impoconsumoPorcentaje,
    valorImpoconsumo,
    valorImpoconsumoPorPax,
    precioRealVenta,
    precioRealVentaPorPax,
    precioRealVentaSinRedondeo: rawPrecioRealVenta,
    precioRealVentaPorPaxSinRedondeo: rawPrecioRealVentaPorPax,
    preciosRedondeados,
    metodoRedondeo,
    margenBrutoEstimado,
    hayIncompletos: incompletosCount > 0,
    ingredientesIncompletosCount: incompletosCount,
  };
}

/**
 * Colombian Peso currency formatter ($ 5.000 o $ 133,35)
 */
export function formatCurrency(amount: number, showDecimalsIfFractional = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$ 0';
  }
  const isWhole = Math.round(amount * 100) % 100 === 0;
  const decimals = showDecimalsIfFractional && !isWhole ? 2 : 0;

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Formats quantity numbers nicely (e.g. 26,67 or 400 or 0,05)
 */
export function formatQuantity(value: number, maxDecimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  const isWhole = Math.round(value * 100) % 100 === 0;
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: isWhole ? 0 : maxDecimals,
  }).format(value);
}
