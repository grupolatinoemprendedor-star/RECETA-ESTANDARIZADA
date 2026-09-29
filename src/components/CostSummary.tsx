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
  ShieldAlert,
} from 'lucide-react';

interface CostSummaryProps {
  calculations: RecipeCalculations;
  pax: number;
  margenErrorPorcentaje?: number;
  mermaPorcentaje: number;
  porcentajeCosto: number;
  impoconsumoActivo: boolean;
  impoconsumoPorcentaje: number;
  redondearPrecios?: boolean;
  metodoRedondeo?: RoundingMethod;
  isEditMode: boolean;
  onUpdateRecipe: (fields: {
    margenErrorPorcentaje?: number;
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
  margenErrorPorcentaje = 10,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Costo Base Materia Prima - Centrado */}
        <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-xl p-4 flex flex-col justify-between text-center min-h-[220px]">
          {/* Header */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#666F64] uppercase tracking-wider">
            <PieChart className="w-4 h-4 text-[#8C7A5B]" />
            <span>Costo Materia Prima</span>
          </div>

          {/* Núcleo de información centrado exactamente en altura y ancho */}
          <div className="my-auto py-2 flex flex-col items-center justify-center">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#1C1E21] tracking-tight">
              {formatCurrency(calculations.costoMateriaPrimaTotal)}
            </div>
            <div className="text-xs text-stone-600 mt-2 font-mono bg-white border border-[#DDD5C7] px-3 py-1 rounded-full shadow-2xs">
              Por 1 PAX: <strong className="text-stone-900 font-bold">{formatCurrency(calculations.costoMateriaPrimaPorPax)}</strong>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2.5 border-t border-[#EDE6DC] text-[11px] text-stone-500 text-center">
            Suma neta ({calculations.ingredientesCalculados.length} ingredientes).
          </div>
        </div>

        {/* Card 2: Margen de Error (10% Gastronómico) - Centrado */}
        <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-xl p-4 flex flex-col justify-between text-center min-h-[220px]">
          {/* Header */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#666F64] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-[#8C7A5B]" />
            <span>Margen de Error</span>
          </div>

          {/* Núcleo de información centrado exactamente en altura y ancho */}
          <div className="my-auto py-2 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-3">
              {/* Input % Margen de Error */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1 font-mono">
                  % Error
                </span>
                {isEditMode ? (
                  <div className="flex items-center border border-[#DDD5C7] rounded-lg bg-white px-2 py-1 shadow-2xs">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="1"
                      value={margenErrorPorcentaje}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        onUpdateRecipe({ margenErrorPorcentaje: isNaN(v) ? 0 : v });
                      }}
                      className="w-12 text-center font-mono text-xl font-extrabold text-[#1C1E21] outline-hidden"
                    />
                    <span className="font-mono text-sm text-stone-500 font-bold ml-0.5">%</span>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 bg-[#ECE6DC] text-[#2C332D] font-mono text-base font-bold rounded-lg">
                    {margenErrorPorcentaje}%
                  </span>
                )}
              </div>

              {/* Valor adicional del margen de error */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                  + Valor Error:
                </span>
                <span className="font-mono text-lg font-bold text-[#8C7A5B]">
                  +{formatCurrency(calculations.valorMargenError)}
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs text-stone-700 font-mono bg-white border border-[#DDD5C7] px-2.5 py-0.5 rounded-md">
              Total con Error: <strong>{formatCurrency(calculations.costoConMargenError)}</strong>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2.5 border-t border-[#EDE6DC] text-[11px] text-stone-500 font-mono text-center">
            Costo Base + {margenErrorPorcentaje}% (imprevistos/degustación)
          </div>
        </div>

        {/* Card 3: Merma de Producción / Cocción - Centrado */}
        <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-xl p-4 flex flex-col justify-between text-center min-h-[220px]">
          {/* Header */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#666F64] uppercase tracking-wider">
            <Scale className="w-4 h-4 text-[#8C7A5B]" />
            <span>Merma Producción</span>
          </div>

          {/* Núcleo de información centrado exactamente en altura y ancho */}
          <div className="my-auto py-2 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-3">
              {/* Input % Merma centrado */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1 font-mono">
                  % Merma
                </span>
                {isEditMode ? (
                  <div className="flex items-center border border-[#DDD5C7] rounded-lg bg-white px-2 py-1 shadow-2xs">
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
                      className="w-12 text-center font-mono text-xl font-extrabold text-[#1C1E21] outline-hidden"
                    />
                    <span className="font-mono text-sm text-stone-500 font-bold ml-0.5">%</span>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 bg-[#ECE6DC] text-[#2C332D] font-mono text-base font-bold rounded-lg">
                    {mermaPorcentaje}%
                  </span>
                )}
              </div>

              {/* Costo con merma resultante centrado */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">
                  Costo con Merma:
                </span>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#1C1E21]">
                  {formatCurrency(calculations.costoConMerma)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 mt-2 font-mono">
              Por 1 PAX: <strong>{formatCurrency(calculations.costoConMermaPorPax)}</strong>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2.5 border-t border-[#EDE6DC] text-[11px] text-stone-500 font-mono text-center">
            Fórmula: Costo con Error ÷ (1 − {mermaPorcentaje}%)
          </div>
        </div>

        {/* Card 4: Margen de Utilidad y Food Cost % (100% Modificable en ambos sentidos) */}
        <div className="bg-[#FAF8F5] border-2 border-[#8C7A5B]/50 rounded-xl p-4 flex flex-col justify-between shadow-2xs min-h-[220px]">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#666F64] uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5 text-[#2C332D]">
                <TrendingUp className="w-4 h-4 text-[#8C7A5B]" />
                <strong>Margen y Food Cost</strong>
              </span>
              <span className="text-[10px] font-mono text-[#8C7A5B] bg-[#EFEBE4] px-1.5 py-0.5 rounded font-bold">
                Modificable
              </span>
            </div>

            {/* Dual Synchronized Inputs: Margen de Utilidad y % Food Cost */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {/* Margen de Utilidad Bruta */}
              <div className="bg-white border border-[#DDD5C7] rounded-lg p-2 shadow-2xs">
                <label className="text-[9px] font-bold text-[#8C7A5B] uppercase block">
                  % Utilidad
                </label>
                {isEditMode ? (
                  <div className="flex items-center mt-0.5">
                    <input
                      type="number"
                      min="0"
                      max="95"
                      step="1"
                      value={Math.round(100 - porcentajeCosto)}
                      onChange={(e) => {
                        const margin = parseFloat(e.target.value);
                        if (!isNaN(margin)) {
                          const safeMargin = Math.min(95, Math.max(0, margin));
                          onUpdateRecipe({ porcentajeCosto: Math.round(100 - safeMargin) });
                        }
                      }}
                      className="w-full font-mono text-lg font-extrabold text-[#1C1E21] outline-hidden"
                      title="Porcentaje de utilidad bruta sobre el precio base"
                    />
                    <span className="font-mono text-xs font-bold text-[#8C7A5B] ml-0.5">%</span>
                  </div>
                ) : (
                  <span className="font-mono text-base font-bold text-[#1C1E21] block mt-0.5">
                    {Math.round(100 - porcentajeCosto)}%
                  </span>
                )}
                <span className="text-[9px] text-stone-400 block font-mono">
                  Ganancia
                </span>
              </div>

              {/* Porcentaje de Costo (Food Cost) */}
              <div className="bg-white border border-[#DDD5C7] rounded-lg p-2 shadow-2xs">
                <label className="text-[9px] font-bold text-stone-600 uppercase block">
                  % Food Cost
                </label>
                {isEditMode ? (
                  <div className="flex items-center mt-0.5">
                    <input
                      type="number"
                      min="5"
                      max="100"
                      step="1"
                      value={porcentajeCosto}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!isNaN(v)) {
                          const safeCost = Math.min(100, Math.max(5, v));
                          onUpdateRecipe({ porcentajeCosto: safeCost });
                        }
                      }}
                      className="w-full font-mono text-lg font-extrabold text-[#1C1E21] outline-hidden"
                      title="Porcentaje de costo respecto al precio de venta base"
                    />
                    <span className="font-mono text-xs font-bold text-stone-500 ml-0.5">%</span>
                  </div>
                ) : (
                  <span className="font-mono text-base font-bold text-[#1C1E21] block mt-0.5">
                    {porcentajeCosto}%
                  </span>
                )}
                <span className="text-[9px] text-stone-400 block font-mono">
                  100% − Util
                </span>
              </div>
            </div>

            {/* Quick Presets Buttons for Fast Kitchen Management */}
            {isEditMode && (
              <div className="mt-2 flex items-center gap-1 flex-wrap">
                {[
                  { margin: 75, cost: 25, label: '75/25' },
                  { margin: 70, cost: 30, label: '70/30' },
                  { margin: 65, cost: 35, label: '65/35' },
                  { margin: 60, cost: 40, label: '60/40' },
                  { margin: 40, cost: 60, label: '40/60' },
                  { margin: 30, cost: 70, label: '30/70' },
                ].map((preset) => (
                  <button
                    key={preset.cost}
                    type="button"
                    title={`Utilidad: ${preset.margin}% · Food Cost: ${preset.cost}%`}
                    onClick={() => onUpdateRecipe({ porcentajeCosto: preset.cost })}
                    className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded transition-colors ${
                      porcentajeCosto === preset.cost
                        ? 'bg-[#242A24] text-[#D1BD9B] font-bold shadow-2xs'
                        : 'bg-white border border-[#DDD5C7] text-stone-600 hover:bg-[#EFEBE4]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Base Price Result */}
            <div className="mt-2 p-1.5 bg-[#EFEBE4]/60 rounded-md flex justify-between items-center text-xs">
              <span className="text-stone-600 font-medium">Precio Base:</span>
              <span className="font-mono font-bold text-[#1C1E21]">
                {formatCurrency(calculations.precioVenta)}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#EDE6DC] text-[10px] text-stone-500 font-mono flex justify-between items-center">
            <span>Fórmula: Costo ÷ ({porcentajeCosto}%)</span>
            <span className="text-[#8C7A5B] font-bold">100%</span>
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
