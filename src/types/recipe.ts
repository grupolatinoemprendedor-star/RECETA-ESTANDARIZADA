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

export type GrupoInventario = 'f' | 'c' | 'L' | 'e' | 's';

export const GRUPO_INVENTARIO_CONFIG: Record<
  GrupoInventario,
  { label: string; nombre: string; colorBg: string; colorText: string; colorBorder: string }
> = {
  f: { label: 'F', nombre: 'Fruver', colorBg: 'bg-emerald-100', colorText: 'text-emerald-800', colorBorder: 'border-emerald-300' },
  c: { label: 'C', nombre: 'Cárnicos', colorBg: 'bg-red-100', colorText: 'text-red-800', colorBorder: 'border-red-300' },
  L: { label: 'L', nombre: 'Lácteos', colorBg: 'bg-amber-100', colorText: 'text-amber-800', colorBorder: 'border-amber-300' },
  e: { label: 'E', nombre: 'Economato', colorBg: 'bg-sky-100', colorText: 'text-sky-800', colorBorder: 'border-sky-300' },
  s: { label: 'S', nombre: 'Suministros', colorBg: 'bg-purple-100', colorText: 'text-purple-800', colorBorder: 'border-purple-300' },
};

export interface IngredientItem {
  id: string;
  item: number; // 1, 2, 3...
  grupoInventario?: GrupoInventario; // G.I: f (Fruver), c (Cárnicos), L (Lácteos), e (Economato), s (Suministros)
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
  margenErrorPorcentaje?: number; // e.g. 10 for 10% margen de error
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
  grupoInventario?: GrupoInventario;
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
  margenErrorPorcentaje: number;
  costoConMargenError: number;
  costoConMargenErrorPorPax: number;
  valorMargenError: number;
  valorMargenErrorPorPax: number;
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
