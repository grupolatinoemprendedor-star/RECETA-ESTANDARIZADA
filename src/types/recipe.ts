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

export type TipoReceta = 'porciones' | 'lote';
export type CategoriaBase = 'fondos' | 'salsas' | 'caldos' | 'masas' | 'bases' | 'otro';

export interface BatchYieldConfig {
  rendimientoFinal: number; // Ej. 4200 o 5000 (volumen o peso real aprovechable tras cocción y mermas)
  unidadRendimiento: 'ml' | 'g' | 'L' | 'kg'; // Magnitud física del rendimiento obtenido
  costosAdicionalesProduccion?: number; // Costos adicionales opcionales (ej. energía específica, empaque)
  notasRendimiento?: string; // Anotaciones de pérdidas por evaporación, filtrado o espumado
}

export interface IngredientItem {
  id: string;
  item: number; // 1, 2, 3...
  grupoInventario?: GrupoInventario; // G.I: f (Fruver), c (Cárnicos), L (Lácteos), e (Economato), s (Suministros)
  ingrediente: string;
  miseEnPlace: string;
  unidad: StandardUnit | string;
  customUnidad?: string;
  cantidadPorPax: number; // Solo para recetas por porciones (preservado 100%)
  cantidadLote?: number; // Campo independiente para recetas por lote (sin mezclar con PAX)
  valorUnidadMinima: number; // Costo por unidad mínima ($/g, $/ml, $/und)
  // Integración con preparaciones base reutilizables
  esPreparacionBase?: boolean;
  baseRecipeId?: string;
  baseRecipeNombre?: string;
  baseRecipeUnitCost?: number; // Costo histórico capturado al vincular
  baseRecipeYieldUnit?: string;
}

export interface CulinaryStep {
  id: string;
  numero: number;
  descripcion: string;
}

export type RoundingMethod = 'mil' | 'centena' | 'cincuenta' | 'exacto_entero';

export interface Recipe {
  id: string;
  tipoReceta?: TipoReceta; // 'porciones' (default) | 'lote'
  categoriaBase?: CategoriaBase;
  batchYield?: BatchYieldConfig;
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
  procedimiento?: string; // Procedimiento técnico y paso a paso unificado (área continua autoexpandible)
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
  cantidadLote?: number;
  costoIngredienteLote?: number;
  valorUnidadMinima: number;
  valorPorPax: number;
  valorTotal: number;
  incompleto: boolean;
  mensajeIncompleto?: string;
  esPreparacionBase?: boolean;
  baseRecipeId?: string;
  baseRecipeNombre?: string;
  baseRecipeUnitCost?: number;
}

export interface RecipeCalculations {
  tipoReceta: TipoReceta;
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

  // Métricas exclusivas para Modalidad B (Costeo por Lote / Rendimiento)
  costoTotalLote: number;
  costosAdicionalesProduccion: number;
  costoTotalProduccionLote: number;
  rendimientoFinal: number;
  unidadRendimiento: 'ml' | 'g' | 'L' | 'kg';
  rendimientoFinalNormalizado: number; // en ml o g
  unidadRendimientoBase: 'ml' | 'g';
  costoPorUnidadMinima: number; // $/ml o $/g
  costoPorCienUnidades: number; // $/100ml o $/100g
  costoPorUnidadMayor: number; // $/L o $/kg
}
