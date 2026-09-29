import React from 'react';
import { IngredientItem, RecipeCalculations } from '../types/recipe';
import { IngredientRow } from './IngredientRow';
import { formatCurrency } from '../utils/calculations';
import { Plus, Sparkles, AlertTriangle } from 'lucide-react';

interface IngredientTableProps {
  ingredients: IngredientItem[];
  calculations: RecipeCalculations;
  pax: number;
  isEditMode: boolean;
  onAddIngredient: () => void;
  onUpdateIngredient: (id: string, updated: Partial<IngredientItem>) => void;
  onRemoveIngredient: (id: string) => void;
  onMoveIngredient: (fromIndex: number, toIndex: number) => void;
}

export const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  calculations,
  pax,
  isEditMode,
  onAddIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
  onMoveIngredient,
}) => {
  return (
    <section className="bg-white border border-[#DDD5C7] rounded-xl shadow-xs p-5 md:p-6 mb-6">
      {/* Table Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E8E2D5] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C7A5B]" />
            <h3 className="font-editorial text-xl font-bold text-[#1C1E21] tracking-tight uppercase">
              TABLA PRINCIPAL DE INGREDIENTES
            </h3>
          </div>
          <p className="text-xs text-[#666F64] mt-0.5">
            Cálculo dinámico basado en <strong className="text-[#1C1E21]">{pax} PAX</strong>. Las cantidades totales y valores se actualizan en tiempo real.
          </p>
        </div>

        {isEditMode && (
          <button
            type="button"
            onClick={onAddIngredient}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2E372E] text-white hover:bg-[#1E251E] font-medium text-xs shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#D1BD9B]" />
            <span>+ AGREGAR INGREDIENTE</span>
          </button>
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
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#242A24] text-[#EFEBE4] text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-3 text-center w-16">ITEMS</th>
              <th className="py-3 px-2 text-center w-20" title="Grupo de Inventario (f=Fruver, c=Cárnicos, L=Lácteos, e=Economato, s=Suministros)">
                G.I
              </th>
              <th className="py-3 px-3 w-56">INGREDIENTES</th>
              <th className="py-3 px-3 w-56">MISE EN PLACE INGREDIENTE</th>
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
          </thead>
          <tbody className="divide-y divide-[#EAE4D9]">
            {ingredients.length === 0 ? (
              <tr>
                <td
                  colSpan={isEditMode ? 11 : 10}
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
          </tfoot>
        </table>
      </div>

      {isEditMode && (
        <div className="mt-3 flex justify-between items-center text-[11px] text-stone-400">
          <span>Consejo técnico: Las unidades se normalizan a la unidad mínima estándar (g, ml o unidad).</span>
          <button
            type="button"
            onClick={onAddIngredient}
            className="text-[#8C7A5B] hover:text-[#5E513B] font-semibold underline underline-offset-2"
          >
            + Agregar otra fila
          </button>
        </div>
      )}
    </section>
  );
};
