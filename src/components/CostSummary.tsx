import React from 'react';
import { RecipeCalculations, RoundingMethod } from '../types/recipe';
import { formatCurrency } from '../utils/calculations';
import {
  DollarSign,
  Percent,
  TrendingUp,
  Receipt,
  PieChart,
  ShieldCheck,
  Scale,
  HelpCircle,
  Coins,
  CheckCircle2,
} from 'lucide-react';

interface CostSummaryProps {
  calculations: RecipeCalculations;
  pax: number;
  mermaPorcentaje: number;
  porcentajeCosto: number;
  impoconsumoActivo: boolean;
  impoconsumoPorcentaje: number;
  redondearPrecios?: boolean;
  metodoRedondeo?: RoundingMethod;
  isEditMode: boolean;
  onUpdateRecipe: (fields: {
    mermaPorcentaje?: number;
    porcentajeCosto?: number;
    impoconsumoActivo?: boolean;
    impoconsumoPorcentaje?: number;
    redondearPrecios?: boolean;
    metodoRedondeo?: RoundingMethod;
  }) => void;
}

export const CostSummary: React.FC<CostSummaryProps> = ({
  calculations,
  pax,
  mermaPorcentaje,
  porcentajeCosto,
  impoconsumoActivo,
  impoconsumoPorcentaje,
  redondearPrecios = true,
  metodoRedondeo = 'mil',
  isEditMode,
  onUpdateRecipe,
}) => {
  return (
    <section className="bg-white border border-[#DDD5C7] rounded-xl shadow-xs p-5 md:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E8E2D5]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8C7A5B]" />
          <h3 className="font-editorial text-xl font-bold text-[#1C1E21] tracking-tight uppercase">
            ESTRUCTURA DE COSTOS Y FIJACIÓN DE PRECIO DE VENTA
          </h3>
        </div>
        <div className="text-xs text-stone-500 font-mono hidden sm:block">
          Cálculo Estándar Gastronómico · Base {pax} PAX
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {/* Card 1: Costo Base Materia Prima */}
        <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#666F64] uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-[#8C7A5B]" />
                Costo Total Materia Prima
              </span>
            </div>
            <div className="font-mono text-2xl font-bold text-[#1C1E21] mt-2">
              {formatCurrency(calculations.costoMateriaPrimaTotal)}
            </div>
            <div className="text-xs text-stone-500 mt-1 font-mono">
              Por 1 PAX: <strong className="text-stone-700">{formatCurrency(calculations.costoMateriaPrimaPorPax)}</strong>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#EDE6DC] text-[11px] text-stone-500">
            Suma neta de los {calculations.ingredientesCalculados.length} ingredientes estándar.
          </div>
        </div>

        {/* Card 2: Merma de Producción / Cocción */}
        <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#666F64] uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#8C7A5B]" />
                Merma de Producción / Cocción
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {isEditMode ? (
                <div className="flex items-center border border-[#DDD5C7] rounded bg-white px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    step="0.5"
                    value={mermaPorcentaje}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      onUpdateRecipe({ mermaPorcentaje: isNaN(v) ? 0 : v });
                    }}
                    className="w-14 text-center font-mono text-base font-bold text-[#1C1E21] outline-hidden"
                  />
                  <span className="font-mono text-xs text-stone-500 font-bold ml-1">%</span>
                </div>
              ) : (
                <span className="px-2.5 py-1 bg-[#ECE6DC] text-[#2C332D] font-mono text-sm font-bold rounded">
                  {mermaPorcentaje}%
                </span>
              )}

              <div>
                <span className="text-[11px] text-stone-500 block">Costo con Merma:</span>
                <span className="font-mono text-lg font-bold text-[#1C1E21]">
                  {formatCurrency(calculations.costoConMerma)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#EDE6DC] text-[11px] text-stone-500 font-mono">
            Fórmula: Costo Base ÷ (1 − {mermaPorcentaje}%)
          </div>
        </div>

        {/* Card 3: Porcentaje de Costo (Food Cost %) */}
        <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#666F64] uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#8C7A5B]" />
                Porcentaje de Costo (Food Cost)
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {isEditMode ? (
                <div className="flex items-center border border-[#DDD5C7] rounded bg-white px-2 py-1">
                  <input
                    type="number"
                    min="5"
                    max="100"
                    step="1"
                    value={porcentajeCosto}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      onUpdateRecipe({ porcentajeCosto: isNaN(v) ? 30 : v });
                    }}
                    className="w-14 text-center font-mono text-base font-bold text-[#1C1E21] outline-hidden"
                  />
                  <span className="font-mono text-xs text-stone-500 font-bold ml-1">%</span>
                </div>
              ) : (
                <span className="px-2.5 py-1 bg-[#ECE6DC] text-[#2C332D] font-mono text-sm font-bold rounded">
                  {porcentajeCosto}%
                </span>
              )}

              <div>
                <span className="text-[11px] text-stone-500 block">Precio de Venta Base:</span>
                <span className="font-mono text-lg font-bold text-[#1C1E21]">
                  {formatCurrency(calculations.precioVenta)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#EDE6DC] text-[11px] text-stone-500 font-mono">
            Fórmula: Costo con Merma ÷ {(porcentajeCosto / 100).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Row 2: Impoconsumo & Destacado PRECIO REAL DE VENTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Impoconsumo selector & explanation */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#E4DDD1] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#666F64] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#8C7A5B]" />
                Impoconsumo (Impuesto al Consumo)
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              {isEditMode ? (
                <div className="inline-flex rounded-lg border border-[#DDD5C7] bg-[#ECE6DC] p-0.5">
                  <button
                    type="button"
                    onClick={() => onUpdateRecipe({ impoconsumoActivo: true })}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                      impoconsumoActivo
                        ? 'bg-[#2E372E] text-white shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    SÍ (8%)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateRecipe({ impoconsumoActivo: false })}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                      !impoconsumoActivo
                        ? 'bg-[#2E372E] text-white shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    NO (0%)
                  </button>
                </div>
              ) : (
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded font-mono ${
                    impoconsumoActivo
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {impoconsumoActivo ? `SÍ (${impoconsumoPorcentaje}%)` : 'NO APLICA'}
                </span>
              )}

              {impoconsumoActivo && isEditMode && (
                <div className="flex items-center gap-1 text-xs text-stone-600 font-mono">
                  <span>Tasa:</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={impoconsumoPorcentaje}
                    onChange={(e) =>
                      onUpdateRecipe({ impoconsumoPorcentaje: parseFloat(e.target.value) || 0 })
                    }
                    className="w-12 bg-white border border-[#DDD5C7] rounded px-1.5 py-0.5 text-center font-bold outline-hidden"
                  />
                  <span>%</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#EDE6DC]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-600">Valor Impoconsumo Total:</span>
                <span className="font-mono font-bold text-stone-800">
                  {formatCurrency(calculations.valorImpoconsumo)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-stone-500">Impoconsumo x 1 PAX:</span>
                <span className="font-mono text-stone-600">
                  {formatCurrency(calculations.valorImpoconsumoPorPax)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-stone-400 mt-2">
            Tarifa estándar en servicio de restaurante y bares en Colombia (Estatuto Tributario Art. 512-1).
          </p>
        </div>

        {/* Right: PRECIO REAL DE VENTA (High Visual Hierarchy) */}
        <div className="lg:col-span-8 bg-[#242A24] text-white border-2 border-[#8C7A5B] rounded-xl p-5 md:p-6 shadow-md flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/15 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold tracking-widest text-[#D1BD9B] uppercase">
                  Resultado Financiero Técnico
                </span>
                {calculations.preciosRedondeados && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#D1BD9B] text-[#1C1E21] font-mono">
                    <Coins className="w-3 h-3" />
                    PRECIOS CERRADOS
                  </span>
                )}
              </div>
              <h4 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase mt-0.5">
                PRECIO REAL DE VENTA
              </h4>
            </div>

            {/* Rounding controls & Margen */}
            <div className="flex items-center gap-2 flex-wrap">
              {isEditMode && (
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-xs font-mono">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#E8E2D5] select-none text-[11px]">
                    <input
                      type="checkbox"
                      checked={redondearPrecios}
                      onChange={(e) => onUpdateRecipe({ redondearPrecios: e.target.checked })}
                      className="rounded accent-[#8C7A5B] w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Redondear a precio cerrado:</span>
                  </label>

                  {redondearPrecios && (
                    <select
                      value={metodoRedondeo}
                      onChange={(e) =>
                        onUpdateRecipe({ metodoRedondeo: e.target.value as RoundingMethod })
                      }
                      className="bg-[#1C1E21] text-[#E8E2D5] border border-white/20 rounded px-1.5 py-0.5 text-[10px] outline-hidden cursor-pointer"
                    >
                      <option value="mil">A $1.000 (13.100-13.400 → 13.000 | 13.500-13.900 → 14.000)</option>
                      <option value="centena">A $100 más cercano</option>
                      <option value="cincuenta">A $50 más cercano</option>
                      <option value="exacto_entero">Sin centavos (entero)</option>
                    </select>
                  )}
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-[#E8E2D5] self-start sm:self-auto">
                <TrendingUp className="w-3.5 h-3.5 text-[#D1BD9B]" />
                <span>Margen Bruto: ~{calculations.margenBrutoEstimado.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Pricing Highlight Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
            {/* 1. Precio Total para el lote completo */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#C5BBAA] font-semibold block">
                  Precio Real Total ({pax} PAX)
                </span>
                {calculations.preciosRedondeados && (
                  <span className="text-[10px] font-mono text-[#D1BD9B] bg-white/10 px-1.5 py-0.5 rounded">
                    Cerrado
                  </span>
                )}
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] mt-1">
                {formatCurrency(calculations.precioRealVenta)}
              </div>
              <div className="text-[11px] text-stone-400 block mt-1">
                Incluye Costo con Merma + Utilidad ({100 - porcentajeCosto}%) + Impuesto
                {calculations.preciosRedondeados && (
                  <span className="block text-[10px] text-stone-400 font-mono mt-0.5">
                    (Valor exacto sin redondear: {formatCurrency(calculations.precioRealVentaSinRedondeo)})
                  </span>
                )}
              </div>
            </div>

            {/* 2. Precio de Carta por Porción (1 PAX) */}
            <div className="bg-[#8C7A5B]/15 border border-[#8C7A5B]/40 rounded-lg p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#D1BD9B] font-bold block">
                  Precio Carta por 1 PAX (Recomendado)
                </span>
                {calculations.preciosRedondeados && (
                  <span className="text-[10px] font-mono text-[#EED8AE] bg-[#8C7A5B]/30 px-1.5 py-0.5 rounded font-bold">
                    Cerrado
                  </span>
                )}
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] mt-1 text-[#EED8AE]">
                {formatCurrency(calculations.precioRealVentaPorPax)}
              </div>
              <div className="text-[11px] text-[#D1BD9B]/80 block mt-1">
                Precio final al comensal por plato / ración individual
                {calculations.preciosRedondeados && (
                  <span className="block text-[10px] text-[#D1BD9B]/70 font-mono mt-0.5">
                    (Valor exacto sin redondear: {formatCurrency(calculations.precioRealVentaPorPaxSinRedondeo)})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Financial Footnote */}
          <div className="text-[11px] text-stone-300/80 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
            <span className="font-mono">
              Precio Base: {formatCurrency(calculations.precioVenta)} + Impuesto ({impoconsumoActivo ? `${impoconsumoPorcentaje}%` : '0%'}): {formatCurrency(calculations.valorImpoconsumo)}
            </span>
            <span className="text-stone-400">
              Costo unitario x PAX: {formatCurrency(calculations.costoConMermaPorPax)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
