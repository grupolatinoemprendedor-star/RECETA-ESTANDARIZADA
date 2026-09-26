export type StandardUnit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'L'
  | 'unidad'
  | 'docena'
  | 'libra'
  | 'arroba'
  | 'personalizada';

export interface IngredientItem {
  id: string;
  item: number; // 1, 2, 3...
  ingrediente: string;
  miseEnPlace: string;
  unidad: StandardUnit | string;
  customUnidad?: string;
  cantidadPorPax: number;
  valorUnidadMinima: number; // Cost per minimal unit (e.g. per gram, per ml, per unit)
}

export interface CulinaryStep {
  id: string;
  numero: number;
  descripcion: string;
}

export type RoundingMethod = 'mil' | 'centena' | 'cincuenta' | 'exacto_entero';

export interface Recipe {
  id: string;
  nombre: string;
  imagen: string; // Base64 data URL or empty
  fecha: string; // YYYY-MM-DD
  creador: string;
  establecimiento: string;
  pax: number;
  ingredientes: IngredientItem[];
  mermaPorcentaje: number; // e.g. 15 for 15%
  porcentajeCosto: number; // e.g. 30 for 30%
  impoconsumoActivo: boolean; // SÍ / NO
  impoconsumoPorcentaje: number; // e.g. 8 for 8%
  redondearPrecios?: boolean; // Redondear a precio cerrado comercial
  metodoRedondeo?: RoundingMethod; // e.g. 'centena' ($100), 'mil' ($1.000), 'cincuenta' ($50), 'exacto_entero' ($1)
  pasos: CulinaryStep[];
  notasAdicionales?: string;
  temperaturaServicio?: string;
  tiempoPreparacion?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CalculatedIngredient {
  item: number;
  ingrediente: string;
  miseEnPlace: string;
  unidad: string;
  cantidadPorPax: number;
  cantidadTotal: number;
  valorUnidadMinima: number;
  valorPorPax: number;
  valorTotal: number;
  incompleto: boolean;
  mensajeIncompleto?: string;
}

export interface RecipeCalculations {
  ingredientesCalculados: CalculatedIngredient[];
  costoMateriaPrimaTotal: number;
  costoMateriaPrimaPorPax: number;
  mermaPorcentaje: number;
  costoConMerma: number;
  costoConMermaPorPax: number;
  porcentajeCosto: number;
  precioVenta: number;
  precioVentaPorPax: number;
  impoconsumoActivo: boolean;
  impoconsumoPorcentaje: number;
  valorImpoconsumo: number;
  valorImpoconsumoPorPax: number;
  precioRealVenta: number;
  precioRealVentaPorPax: number;
  precioRealVentaSinRedondeo: number;
  precioRealVentaPorPaxSinRedondeo: number;
  preciosRedondeados: boolean;
  metodoRedondeo: RoundingMethod;
  margenBrutoEstimado: number;
  hayIncompletos: boolean;
  ingredientesIncompletosCount: number;
}
