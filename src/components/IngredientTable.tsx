import React, { useState } from 'react';
import { IngredientItem, RecipeCalculations, Recipe, StandardUnit } from '../types/recipe';
import { IngredientRow } from './IngredientRow';
import { formatCurrency, calculateRecipeTotals } from '../utils/calculations';
import { Plus, AlertTriangle, Soup, X, Check, ExternalLink } from 'lucide-react';

interface IngredientTableProps {
  ingredients: IngredientItem[];
  calculations: RecipeCalculations;
  pax: number;
  isEditMode: boolean;
  availableBaseRecipes?: Recipe[];
  onAddIngredient: () => void;
  onAddBaseIngredient?: (baseRecipe: Recipe) => void;
  onUpdateIngredient: (id: string, updated: Partial<IngredientItem>) => void;
  onRemoveIngredient: (id: string) => void;
  onMoveIngredient: (fromIndex: number, toIndex: number) => void;
}

export const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  calculations,
  pax,
  isEditMode,
  availableBaseRecipes = [],
  onAddIngredient,
  onAddBaseIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
  onMoveIngredient,
}) => {
  const isLote = calculations.tipoReceta === 'lote';
  const [showBaseModal, setShowBaseModal] = useState(false);

  const handleSelectBaseRecipe = (baseRecipe: Recipe) => {
    if (onAddBaseIngredient) {
      onAddBaseIngredient(baseRecipe);
    } else {
      // Fallback: create base ingredient directly
      const baseCalcs = calculateRecipeTotals(baseRecipe);
      const unit = (baseRecipe.batchYield?.unidadRendimiento || 'ml') as StandardUnit;
      const unitCost = baseCalcs.costoPorUnidadMinima || 0;
      const newItem: IngredientItem = {
        id: 'ing_base_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        item: ingredients.length + 1,
        ingrediente: baseRecipe.nombre,
        grupoInventario: 'e',
        miseEnPlace: `Base culinaria (${baseRecipe.categoriaBase || 'fondo'})`,
        unidad: unit,
        cantidadPorPax: 0,
        valorUnidadMinima: unitCost,
        esPreparacionBase: true,
        baseRecipeId: baseRecipe.id,
        baseRecipeNombre: baseRecipe.nombre,
        baseRecipeUnitCost: unitCost,
        baseRecipeYieldUnit: unit,
      };
      onUpdateIngredient(newItem.id, newItem);
    }
    setShowBaseModal(false);
  };

  return (
    <section className="bg-white border border-[#DDD5C7] rounded-xl shadow-xs p-5 md:p-6 mb-6">
      {/* Table Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E8E2D5] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLote ? 'bg-amber-600' : 'bg-[#8C7A5B]'}`} />
            <h3 className="font-editorial text-xl font-bold text-[#1C1E21] tracking-tight uppercase">
              {isLote ? 'TABLA DE INGREDIENTES DEL LOTE' : 'TABLA PRINCIPAL DE INGREDIENTES'}
            </h3>
            {isLote && (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                Lote Global (Sin multiplicar por PAX)
              </span>
            )}
          </div>
          <p className="text-xs text-[#666F64] mt-0.5">
            {isLote ? (
              <span>
                Cantidades globales para la producción del lote completo. Rendimiento final programado:{' '}
                <strong className="text-[#1C1E21]">
                  {calculations.rendimientoFinal?.toLocaleString('es-CO')} {calculations.unidadRendimiento}
                </strong>
                .
              </span>
            ) : (
              <span>
                Cálculo dinámico basado en <strong className="text-[#1C1E21]">{pax} PAX</strong>. Las cantidades totales y valores se actualizan en tiempo real.
              </span>
            )}
          </p>
        </div>

        {isEditMode && (
          <div className="flex items-center gap-2 flex-wrap">
            {!isLote && (
              <button
                type="button"
                onClick={() => setShowBaseModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#8C7A5B] bg-[#F7F4EE] text-[#5A4B32] hover:bg-[#EFE9DC] font-medium text-xs shadow-2xs transition-colors"
                title="Vincular un fondo, caldo o salsa madre guardado como preparación base"
              >
                <Soup className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span>+ VINCULAR BASE (FONDO / SALSA)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onAddIngredient}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2E372E] text-white hover:bg-[#1E251E] font-medium text-xs shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#D1BD9B]" />
              <span>+ AGREGAR INGREDIENTE</span>
            </button>
          </div>
        )}
      </div>

      {/* Warning if ingredients are incomplete */}
      {calculations.hayIncompletos && isEditMode && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Hay <strong>{calculations.ingredientesIncompletosCount}</strong> ingrediente(s) con valores o cantidades pendientes de completar para calcular el costo con exactitud.
          </span>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto border border-[#E0D8CB] rounded-lg">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            {isLote ? (
              /* LOTE / RENDIMIENTO: 8 COLUMNAS ESPECIALIZADAS */
              <tr className="bg-[#242A24] text-[#EFEBE4] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-14">ITEM</th>
                <th className="py-3 px-2 text-center w-20" title="Grupo de Inventario (f=Fruver, c=Cárnicos, L=Lácteos, e=Economato, s=Suministros)">
                  G.I
                </th>
                <th className="py-3 px-3 w-60">INGREDIENTES DEL LOTE</th>
                <th className="py-3 px-3 w-56">MISE EN PLACE INGREDIENTE</th>
                <th className="py-3 px-3 text-center w-28">UNIDAD MEDIDA</th>
                <th className="py-3 px-3 text-right w-40 bg-[#2D352D] text-[#D1BD9B]">
                  CANTIDAD UTILIZADA (LOTE)
                </th>
                <th className="py-3 px-3 text-right w-36">VALOR UNIDAD MÍNIMA</th>
                <th className="py-3 px-3 text-right w-36 bg-[#343D34] text-white">
                  VALOR TOTAL INSUMO
                </th>
                {isEditMode && <th className="py-3 px-2 text-center w-10 no-print"></th>}
              </tr>
            ) : (
              /* PORCIONES / CARTA: 10 COLUMNAS CONSERVADAS INTACTAS */
              <tr className="bg-[#242A24] text-[#EFEBE4] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-14">ITEMS</th>
                <th className="py-3 px-2 text-center w-20" title="Grupo de Inventario (f=Fruver, c=Cárnicos, L=Lácteos, e=Economato, s=Suministros)">
                  G.I
                </th>
                <th className="py-3 px-3 w-56">INGREDIENTES</th>
                <th className="py-3 px-3 w-52">MISE EN PLACE INGREDIENTE</th>
                <th className="py-3 px-3 text-center w-28">UNIDAD DE MEDIDA</th>
                <th className="py-3 px-3 text-right w-28">CANTIDAD X 1 PAX</th>
                <th className="py-3 px-3 text-right w-32 bg-[#2D352D] text-[#D1BD9B]">
                  CANTIDAD TOTAL ({pax} PAX)
                </th>
                <th className="py-3 px-3 text-right w-36">VALOR GR/ML O UNIDAD MÍNIMA</th>
                <th className="py-3 px-3 text-right w-32 bg-[#2D352D] text-[#D1BD9B]">
                  VALOR X 1 PAX
                </th>
                <th className="py-3 px-3 text-right w-36 bg-[#343D34] text-white">
                  VALOR TOTAL
                </th>
                {isEditMode && <th className="py-3 px-2 text-center w-10 no-print"></th>}
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-[#EAE4D9]">
            {ingredients.length === 0 ? (
              <tr>
                <td
                  colSpan={isLote ? (isEditMode ? 9 : 8) : (isEditMode ? 11 : 10)}
                  className="py-8 text-center text-stone-400 text-xs italic"
                >
                  No hay ingredientes registrados. Pulsa en "+ AGREGAR INGREDIENTE" para comenzar.
                </td>
              </tr>
            ) : (
              ingredients.map((item, index) => {
                const calculated = calculations.ingredientesCalculados[index] || {
                  item: index + 1,
                  ingrediente: item.ingrediente,
                  miseEnPlace: item.miseEnPlace,
                  unidad: item.unidad,
                  cantidadPorPax: item.cantidadPorPax,
                  cantidadTotal: 0,
                  valorUnidadMinima: item.valorUnidadMinima,
                  valorPorPax: 0,
                  valorTotal: 0,
                  incompleto: false,
                };

                return (
                  <IngredientRow
                    key={item.id}
                    item={item}
                    calculated={calculated}
                    index={index}
                    totalItems={ingredients.length}
                    isEditMode={isEditMode}
                    tipoReceta={calculations.tipoReceta}
                    availableBaseRecipes={availableBaseRecipes}
                    onUpdate={(updated) => onUpdateIngredient(item.id, updated)}
                    onRemove={() => onRemoveIngredient(item.id)}
                    onMoveUp={() => onMoveIngredient(index, index - 1)}
                    onMoveDown={() => onMoveIngredient(index, index + 1)}
                  />
                );
              })
            )}
          </tbody>
          <tfoot>
            {isLote ? (
              /* Footer en Lote */
              <tr className="bg-[#ECE6DC] font-bold text-xs text-[#1C1E21] border-t-2 border-[#DDD5C7]">
                <td colSpan={5} className="py-3 px-3 text-right uppercase tracking-wider font-mono">
                  SUBTOTAL MATERIA PRIMA DEL LOTE ({ingredients.length} INSUMOS):
                </td>
                <td className="py-3 px-3 text-right font-mono bg-[#E4DDD1]">
                  —
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#666F64]">
                  —
                </td>
                <td className="py-3 px-3 text-right font-mono text-base text-[#1E251E] bg-[#DDD5C7]">
                  {formatCurrency(calculations.costoMateriaPrimaTotal)}
                </td>
                {isEditMode && <td className="no-print"></td>}
              </tr>
            ) : (
              /* Footer en Porciones (100% idéntico al original) */
              <tr className="bg-[#ECE6DC] font-bold text-xs text-[#1C1E21] border-t-2 border-[#DDD5C7]">
                <td colSpan={5} className="py-3 px-3 text-right uppercase tracking-wider font-mono">
                  SUBTOTAL MATERIA PRIMA ({ingredients.length} ITEMS):
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#666F64]">
                  —
                </td>
                <td className="py-3 px-3 text-right font-mono bg-[#E4DDD1]">
                  —
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#666F64]">
                  —
                </td>
                <td className="py-3 px-3 text-right font-mono text-stone-800 bg-[#E4DDD1]">
                  {formatCurrency(calculations.costoMateriaPrimaPorPax)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-base text-[#1E251E] bg-[#DDD5C7]">
                  {formatCurrency(calculations.costoMateriaPrimaTotal)}
                </td>
                {isEditMode && <td className="no-print"></td>}
              </tr>
            )}
          </tfoot>
        </table>
      </div>

      {isEditMode && (
        <div className="mt-3 flex justify-between items-center text-[11px] text-stone-400">
          <span>
            {isLote
              ? 'Consejo técnico: En modalidad Lote las cantidades no se multiplican por comensales; corresponden a la fórmula de la marmita/olla.'
              : 'Consejo técnico: Las unidades se normalizan a la unidad mínima estándar (g, ml o unidad).'}
          </span>
          <button
            type="button"
            onClick={onAddIngredient}
            className="text-[#8C7A5B] hover:text-[#5E513B] font-semibold underline underline-offset-2"
          >
            + Agregar otra fila
          </button>
        </div>
      )}

      {/* Modal: Vincular Preparación Base */}
      {showBaseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-[#242A24] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Soup className="w-5 h-5 text-[#D1BD9B]" />
                <h3 className="font-editorial text-lg font-bold uppercase tracking-tight">
                  Vincular Preparación Base
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBaseModal(false)}
                className="p-1 rounded text-stone-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-xs text-stone-600 mb-4">
                Selecciona un fondo, caldo, fumet o salsa madre costeada previamente por lote. Su costo unitario ($/ml o $/g) se integrará como materia prima neta en esta receta:
              </p>

              {availableBaseRecipes.length === 0 ? (
                <div className="p-6 text-center bg-white border border-dashed border-[#DDD5C7] rounded-lg">
                  <Soup className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-700">
                    No tienes preparaciones base registradas
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Crea primero un Fondo o Salsa Madre en la modalidad <strong>"Por Lote / Rendimiento"</strong> para poder vincularlo como ingrediente en tus platos.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {availableBaseRecipes.map((base) => {
                    const calcs = calculateRecipeTotals(base);
                    const unit = base.batchYield?.unidadRendimiento || 'ml';
                    const unitCost = calcs.costoPorUnidadMinima || 0;
                    const yieldQty = calcs.rendimientoFinal || 0;
                    const category = base.categoriaBase || 'fondo';

                    return (
                      <div
                        key={base.id}
                        onClick={() => handleSelectBaseRecipe(base)}
                        className="p-3 bg-white border border-[#DDD5C7] hover:border-[#8C7A5B] hover:bg-[#F6F2EA] rounded-lg cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#1C1E21] group-hover:text-[#8C7A5B]">
                              {base.nombre}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EAE4D9] text-stone-700 uppercase font-bold">
                              {category}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
                            Rendimiento: {yieldQty.toLocaleString('es-CO')} {unit} · Costo lote:{' '}
                            {formatCurrency(calcs.costoTotalLote || calcs.costoMateriaPrimaTotal)}
                          </div>
                        </div>

                        <div className="text-right pl-3 shrink-0">
                          <div className="text-xs font-mono font-bold text-[#2E372E]">
                            {formatCurrency(unitCost)} / {unit}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {formatCurrency(unitCost * 1000)} / {unit === 'ml' ? 'Litro' : 'Kg'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowBaseModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-[#DDD5C7] rounded-lg hover:bg-stone-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
