import React from 'react';
import { Recipe, RecipeCalculations } from '../types/recipe';
import { formatCurrency, formatQuantity } from '../utils/calculations';
import { Calendar, User, Building2, Users, Printer, Edit3, Clock, Thermometer, FileDown } from 'lucide-react';

interface RecipeSheetViewProps {
  recipe: Recipe;
  calculations: RecipeCalculations;
  containerId?: string;
  onSwitchToEdit: () => void;
  onPrint: () => void;
  onExportPDF?: () => void;
}

export const RecipeSheetView: React.FC<RecipeSheetViewProps> = ({
  recipe,
  calculations,
  containerId = 'recipe-sheet-print-container',
  onSwitchToEdit,
  onPrint,
  onExportPDF,
}) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* View Switch Banner (hidden on print) */}
      <div className="no-print bg-[#242A24] text-[#EFEBE4] px-4 py-2.5 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-[#8C7A5B]/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D1BD9B] animate-pulse" />
          <span className="text-xs font-medium">
            Estás visualizando la <strong>Ficha Técnica Oficial</strong> (Modo Lectura / Imprimible).
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onSwitchToEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-white text-[#242A24] hover:bg-[#F3EFE9] transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#8C7A5B]" />
            <span>Volver a Editar</span>
          </button>
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#2E372E] text-white hover:bg-[#1E251E] border border-white/20 transition-colors shadow-2xs"
              title="Descargar directamente archivo PDF de la ficha técnica"
            >
              <FileDown className="w-3.5 h-3.5 text-[#D1BD9B]" />
              <span>Descargar PDF</span>
            </button>
          )}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#8C7A5B] text-white hover:bg-[#78674B] transition-colors shadow-2xs"
            title="Imprimir documento o Guardar como PDF mediante la ventana del navegador"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Official Gastronomic Technical Sheet Container */}
      <article
        id={containerId}
        className="print-sheet bg-white border border-[#D5CDC0] shadow-md rounded-xl p-6 sm:p-10 text-[#1C1E21] transition-all"
      >
        {/* Document Header */}
        <header className="border-b-2 border-[#1C1E21] pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D5] gap-3">
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-[#8C7A5B] font-bold">
                DOCUMENTO TÉCNICO GASTRONÓMICO · CÓDIGO REG: REC-{recipe.id.slice(-6).toUpperCase()}
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1C1E21] mt-0.5">
                RECETA ESTÁNDAR
              </h1>
              <div className="text-xs font-semibold text-[#546051] uppercase tracking-wider">
                Técnico en Cocina · Gastronomía Profesional
              </div>
            </div>

            <div className="text-right flex flex-col sm:items-end">
              <span className="px-3 py-1 rounded bg-[#242A24] text-[#FAF8F5] font-mono text-xs font-bold tracking-wider inline-block">
                NO. PAX: {recipe.pax}
              </span>
              <span className="text-[10px] text-stone-400 mt-1 font-mono">
                Porciones calculadas: {recipe.pax} raciones
              </span>
            </div>
          </div>

          {/* Dish Name & Visual presentation */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-start">
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C7A5B] font-bold block mb-1">
                  Nombre del Plato / Preparación
                </span>
                <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[#1C1E21] leading-tight">
                  {recipe.nombre || 'Receta Estándar'}
                </h2>
              </div>

              {/* Metadata 4-box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-[#F0EBE1]">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-mono">Fecha:</span>
                  <span className="font-semibold text-stone-800">{recipe.fecha || '—'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-mono">Creador / Chef:</span>
                  <span className="font-semibold text-stone-800">{recipe.creador || 'Técnico en Cocina'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-mono">Establecimiento:</span>
                  <span className="font-semibold text-stone-800">{recipe.establecimiento || 'Cocina de Producción'}</span>
                </div>
                {recipe.temperaturaServicio && (
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Temp. Servicio:</span>
                    <span className="font-semibold text-stone-800">{recipe.temperaturaServicio}</span>
                  </div>
                )}
                {recipe.tiempoPreparacion && (
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Tiempo Prep:</span>
                    <span className="font-semibold text-stone-800">{recipe.tiempoPreparacion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dish Photo if available */}
            {recipe.imagen && (
              <div className="md:col-span-4 flex justify-center md:justify-end">
                <div className="w-full max-w-[240px] aspect-4/3 rounded-lg overflow-hidden border border-[#D5CDC0] shadow-xs">
                  <img
                    src={recipe.imagen}
                    alt={recipe.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* 1. Technical Ingredients Table */}
        <section className="mb-8 avoid-break">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DDD5C7]">
            <h3 className="font-editorial text-base sm:text-lg font-bold tracking-tight uppercase text-[#1C1E21]">
              1. TABLA PRINCIPAL DE INGREDIENTES
            </h3>
            <span className="font-mono text-xs text-stone-500">
              Cálculo para {recipe.pax} PAX
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#DDD5C7]">
              <thead>
                <tr className="bg-[#242A24] text-white text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-2 text-center border border-stone-700 w-12">ITEMS</th>
                  <th className="py-2.5 px-3 border border-stone-700">INGREDIENTES</th>
                  <th className="py-2.5 px-3 border border-stone-700">MISE EN PLACE INGREDIENTE</th>
                  <th className="py-2.5 px-2 text-center border border-stone-700 w-24">UNIDAD</th>
                  <th className="py-2.5 px-2 text-right border border-stone-700 w-24">CANT. X 1 PAX</th>
                  <th className="py-2.5 px-2 text-right border border-stone-700 w-28 bg-[#2F362F] text-[#D1BD9B]">
                    CANT. TOTAL ({recipe.pax} PAX)
                  </th>
                  <th className="py-2.5 px-2 text-right border border-stone-700 w-28">VALOR MÍNIMO</th>
                  <th className="py-2.5 px-2 text-right border border-stone-700 w-28 bg-[#2F362F] text-[#D1BD9B]">
                    VALOR X 1 PAX
                  </th>
                  <th className="py-2.5 px-3 text-right border border-stone-700 w-32 bg-[#3A433A]">
                    VALOR TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#EAE4D9]">
                {calculations.ingredientesCalculados.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`avoid-break ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}`}
                  >
                    <td className="py-2 px-2 text-center font-mono font-bold text-stone-600 border border-[#E8E2D5]">
                      #{String(item.item).padStart(2, '0')}
                    </td>
                    <td className="py-2 px-3 font-semibold text-[#1C1E21] border border-[#E8E2D5]">
                      {item.ingrediente || '—'}
                    </td>
                    <td className="py-2 px-3 text-stone-600 italic border border-[#E8E2D5]">
                      {item.miseEnPlace || '—'}
                    </td>
                    <td className="py-2 px-2 text-center border border-[#E8E2D5] font-medium">
                      {item.unidad}
                    </td>
                    <td className="py-2 px-2 text-right font-mono border border-[#E8E2D5]">
                      {formatQuantity(item.cantidadPorPax)}
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-bold border border-[#E8E2D5] bg-[#F5F2EA]/40">
                      {formatQuantity(item.cantidadTotal)}
                    </td>
                    <td className="py-2 px-2 text-right font-mono border border-[#E8E2D5] text-stone-600">
                      {formatCurrency(item.valorUnidadMinima)}
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-semibold border border-[#E8E2D5] bg-[#F5F2EA]/40">
                      {formatCurrency(item.valorPorPax)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold border border-[#E8E2D5] bg-[#EFEBE3]/60 text-[#1C1E21]">
                      {formatCurrency(item.valorTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#EFEBE4] font-mono text-xs font-bold text-[#1C1E21] border-t-2 border-[#1C1E21]">
                  <td colSpan={4} className="py-2.5 px-3 text-right uppercase border border-[#DDD5C7]">
                    COSTO TOTAL DE MATERIA PRIMA ({calculations.ingredientesCalculados.length} ITEMS):
                  </td>
                  <td className="py-2.5 px-2 text-right border border-[#DDD5C7] text-stone-400">—</td>
                  <td className="py-2.5 px-2 text-right border border-[#DDD5C7] text-stone-400">—</td>
                  <td className="py-2.5 px-2 text-right border border-[#DDD5C7] text-stone-400">—</td>
                  <td className="py-2.5 px-2 text-right border border-[#DDD5C7] text-stone-900 bg-[#E6DFD4]">
                    {formatCurrency(calculations.costoMateriaPrimaPorPax)}
                  </td>
                  <td className="py-2.5 px-3 text-right border border-[#DDD5C7] text-sm text-[#1C1E21] bg-[#DDD5C7]">
                    {formatCurrency(calculations.costoMateriaPrimaTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* 2. Financial Summary Block */}
        <section className="mb-8 avoid-break">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DDD5C7]">
            <h3 className="font-editorial text-base sm:text-lg font-bold tracking-tight uppercase text-[#1C1E21]">
              2. RESUMEN FINANCIERO Y COSTEO TÉCNICO
            </h3>
            <span className="font-mono text-xs text-stone-500">Moneda: COP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Table of breakdown */}
            <div className="border border-[#DDD5C7] rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-[#EAE4D9]">
                  <tr className="bg-white">
                    <td className="py-2 px-3 font-medium text-stone-600">Costo Total Materia Prima:</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-stone-800">
                      {formatCurrency(calculations.costoMateriaPrimaTotal)}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF8F5]">
                    <td className="py-2 px-3 font-medium text-stone-600">
                      Merma de Producción / Cocción ({calculations.mermaPorcentaje}%):
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-stone-700">
                      {calculations.mermaPorcentaje}% (Factor: 1 − {(calculations.mermaPorcentaje / 100).toFixed(2)})
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-2 px-3 font-semibold text-stone-800">Costo con Merma:</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">
                      {formatCurrency(calculations.costoConMerma)}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF8F5]">
                    <td className="py-2 px-3 font-medium text-stone-600">
                      Margen de Utilidad / Food Cost:
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-stone-800">
                      <span className="font-bold text-[#8C7A5B]">{100 - calculations.porcentajeCosto}% Utilidad</span>
                      <span className="text-stone-500 mx-1">/</span>
                      <span>{calculations.porcentajeCosto}% Costo</span>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-2 px-3 font-medium text-stone-600">Precio de Venta Base:</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-stone-800">
                      {formatCurrency(calculations.precioVenta)}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF8F5]">
                    <td className="py-2 px-3 font-medium text-stone-600">
                      Impoconsumo ({calculations.impoconsumoActivo ? `${calculations.impoconsumoPorcentaje}%` : 'NO'}):
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-stone-800">
                      {formatCurrency(calculations.valorImpoconsumo)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* High visual block */}
            <div className="bg-[#242A24] text-white rounded-lg p-4 sm:p-5 flex flex-col justify-between border-2 border-[#8C7A5B]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#D1BD9B] uppercase font-bold">
                    Documento Oficial de Venta
                  </span>
                  {calculations.preciosRedondeados && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#D1BD9B] text-[#1C1E21] font-bold">
                      PRECIOS CERRADOS
                    </span>
                  )}
                </div>
                <div className="font-editorial text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-1">
                  PRECIO REAL DE VENTA
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  Valor final al consumidor con merma técnica e impuestos aplicados.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/20">
                <div className="bg-white/10 p-2.5 rounded">
                  <span className="text-[10px] font-mono text-[#D1BD9B] uppercase block">
                    TOTAL {recipe.pax} PAX:
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-white block mt-0.5">
                    {formatCurrency(calculations.precioRealVenta)}
                  </span>
                </div>

                <div className="bg-[#8C7A5B]/30 border border-[#8C7A5B]/50 p-2.5 rounded">
                  <span className="text-[10px] font-mono text-[#EED8AE] uppercase font-bold block">
                    POR 1 PAX (CARTA):
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#FAF8F5] block mt-0.5 text-[#EED8AE]">
                    {formatCurrency(calculations.precioRealVentaPorPax)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Step-by-Step Applied Technique */}
        <section className="avoid-break">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DDD5C7]">
            <h3 className="font-editorial text-base sm:text-lg font-bold tracking-tight uppercase text-[#1C1E21]">
              3. PASO A PASO DE TÉCNICA APLICADA
            </h3>
            <span className="font-mono text-xs text-stone-500">
              Protocolo Técnico Operativo
            </span>
          </div>

          <div className="space-y-3">
            {recipe.pasos.map((step, idx) => (
              <div
                key={step.id || idx}
                className="avoid-break bg-[#FAF8F5] border border-[#E8E2D5] rounded-lg p-3 text-xs flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#242A24] text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#1C1E21] uppercase text-[11px] mb-0.5 font-editorial">
                    Paso {idx + 1}
                  </div>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                    {step.descripcion || <span className="text-stone-300 italic">Sin descripción registrada</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Document Footer */}
        <footer className="mt-10 pt-4 border-t border-[#DDD5C7] flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-stone-400 gap-2">
          <span>Sistema Profesional Receta Estándar · Técnico en Cocina</span>
          <span>Ficha Técnica Oficial para Producción y Auditoría Culinaria</span>
        </footer>
      </article>
    </div>
  );
};
