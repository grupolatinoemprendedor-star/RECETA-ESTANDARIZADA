import React from 'react';
import { IngredientItem, CalculatedIngredient, StandardUnit } from '../types/recipe';
import { formatCurrency, formatQuantity, getUnitConversionFactor } from '../utils/calculations';
import { Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';

interface IngredientRowProps {
  item: IngredientItem;
  calculated: CalculatedIngredient;
  index: number;
  totalItems: number;
  isEditMode: boolean;
  onUpdate: (updated: Partial<IngredientItem>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const UNIT_OPTIONS: { value: StandardUnit; label: string }[] = [
  { value: 'g', label: 'g (gramos)' },
  { value: 'kg', label: 'kg (kilogramos)' },
  { value: 'ml', label: 'ml (mililitros)' },
  { value: 'L', label: 'L (litros)' },
  { value: 'unidad', label: 'unidad (und)' },
  { value: 'docena', label: 'docena (12 und)' },
  { value: 'libra', label: 'libra (500 g)' },
  { value: 'arroba', label: 'arroba (@ / 12.5 kg)' },
  { value: 'personalizada', label: 'Otra (personalizada)' },
];

export const IngredientRow: React.FC<IngredientRowProps> = ({
  item,
  calculated,
  index,
  totalItems,
  isEditMode,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const { minUnitName } = getUnitConversionFactor(item.unidad === 'personalizada' ? (item.customUnidad || '') : item.unidad);

  return (
    <tr
      className={`border-b border-[#E8E2D5] transition-colors ${
        index % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'
      } hover:bg-[#F4F0E8]`}
    >
      {/* 1. Item Number & Row Order Controls */}
      <td className="py-2.5 px-3 text-center align-middle">
        <div className="flex items-center justify-center gap-1">
          {isEditMode && totalItems > 1 && (
            <div className="flex flex-col no-print mr-1">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0}
                className="text-stone-400 hover:text-stone-700 disabled:opacity-20 p-0.5"
                title="Mover arriba"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === totalItems - 1}
                className="text-stone-400 hover:text-stone-700 disabled:opacity-20 p-0.5"
                title="Mover abajo"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          )}
          <span className="font-mono text-xs font-bold text-[#8C7A5B]">
            #{String(calculated.item).padStart(2, '0')}
          </span>
        </div>
      </td>

      {/* 2. Ingrediente */}
      <td className="py-2.5 px-3 align-middle">
        {isEditMode ? (
          <div>
            <input
              type="text"
              value={item.ingrediente}
              onChange={(e) => onUpdate({ ingrediente: e.target.value })}
              placeholder="Ej: Arroz tipo selecto"
              className="w-full bg-white border border-[#DDD5C7] rounded px-2.5 py-1 text-xs text-[#1C1E21] font-medium placeholder:text-stone-400 focus:border-[#8C7A5B] outline-hidden shadow-2xs"
            />
            {calculated.incompleto && calculated.mensajeIncompleto && (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-700">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{calculated.mensajeIncompleto}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="font-medium text-xs text-[#1C1E21] leading-tight">
            {calculated.ingrediente || <span className="text-stone-300 italic">Sin nombre</span>}
          </div>
        )}
      </td>

      {/* 3. Mise en place */}
      <td className="py-2.5 px-3 align-middle">
        {isEditMode ? (
          <input
            type="text"
            value={item.miseEnPlace}
            onChange={(e) => onUpdate({ miseEnPlace: e.target.value })}
            placeholder="Ej: Brunoise, julianas, lavado, pelado..."
            className="w-full bg-white border border-[#DDD5C7] rounded px-2 py-1 text-xs text-stone-700 placeholder:text-stone-400 focus:border-[#8C7A5B] outline-hidden shadow-2xs"
          />
        ) : (
          <div className="text-xs text-stone-600 italic">
            {calculated.miseEnPlace || <span className="text-stone-300">—</span>}
          </div>
        )}
      </td>

      {/* 4. Unidad de medida */}
      <td className="py-2.5 px-3 align-middle text-center">
        {isEditMode ? (
          <div className="space-y-1">
            <select
              value={item.unidad}
              onChange={(e) => onUpdate({ unidad: e.target.value as StandardUnit })}
              className="w-full bg-white border border-[#DDD5C7] rounded px-2 py-1 text-xs text-[#1C1E21] font-medium focus:border-[#8C7A5B] outline-hidden shadow-2xs"
            >
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {item.unidad === 'personalizada' && (
              <input
                type="text"
                value={item.customUnidad || ''}
                onChange={(e) => onUpdate({ customUnidad: e.target.value })}
                placeholder="Unidad personalizada"
                className="w-full bg-white border border-[#DDD5C7] rounded px-1.5 py-0.5 text-[11px] text-[#1C1E21] outline-hidden"
              />
            )}
          </div>
        ) : (
          <span className="inline-block px-2 py-0.5 bg-[#EAE4D9] text-[#2C332D] text-xs font-semibold rounded-sm">
            {calculated.unidad}
          </span>
        )}
      </td>

      {/* 5. Cantidad x 1 Pax */}
      <td className="py-2.5 px-3 align-middle text-right">
        {isEditMode ? (
          <input
            type="number"
            min="0"
            step="any"
            value={item.cantidadPorPax === 0 ? '' : item.cantidadPorPax}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdate({ cantidadPorPax: isNaN(val) ? 0 : val });
            }}
            placeholder="0.00"
            className="w-24 bg-white border border-[#DDD5C7] rounded px-2 py-1 text-right font-mono text-xs text-[#1C1E21] font-medium focus:border-[#8C7A5B] outline-hidden shadow-2xs"
          />
        ) : (
          <span className="font-mono text-xs font-semibold text-[#1C1E21]">
            {formatQuantity(calculated.cantidadPorPax)}
          </span>
        )}
      </td>

      {/* 6. Cantidad Total (Calculada automáticamente) */}
      <td className="py-2.5 px-3 align-middle text-right bg-[#F5F2EA]/40">
        <span className="font-mono text-xs font-bold text-[#1C1E21]">
          {formatQuantity(calculated.cantidadTotal)}
        </span>
        <span className="text-[10px] text-stone-500 ml-1">{calculated.unidad}</span>
      </td>

      {/* 7. Valor Gr/Ml o Unidad Mínima */}
      <td className="py-2.5 px-3 align-middle text-right">
        {isEditMode ? (
          <div className="relative inline-flex items-center">
            <span className="absolute left-2 text-stone-400 font-mono text-xs">$</span>
            <input
              type="number"
              min="0"
              step="any"
              value={item.valorUnidadMinima === 0 ? '' : item.valorUnidadMinima}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdate({ valorUnidadMinima: isNaN(val) ? 0 : val });
              }}
              placeholder="0"
              className="w-24 bg-white border border-[#DDD5C7] rounded pl-5 pr-2 py-1 text-right font-mono text-xs text-[#1C1E21] font-medium focus:border-[#8C7A5B] outline-hidden shadow-2xs"
            />
          </div>
        ) : (
          <span className="font-mono text-xs text-stone-700">
            {formatCurrency(calculated.valorUnidadMinima)}
            <span className="text-[10px] text-stone-400 block font-normal">/{minUnitName}</span>
          </span>
        )}
      </td>

      {/* 8. Valor x 1 Pax (Calculado automáticamente) */}
      <td className="py-2.5 px-3 align-middle text-right bg-[#F5F2EA]/40">
        <span className="font-mono text-xs font-semibold text-[#1C1E21]">
          {formatCurrency(calculated.valorPorPax)}
        </span>
      </td>

      {/* 9. Valor Total (Calculado automáticamente) */}
      <td className="py-2.5 px-3 align-middle text-right bg-[#EFEBE3]/60">
        <span className="font-mono text-xs font-bold text-[#2E372E]">
          {formatCurrency(calculated.valorTotal)}
        </span>
      </td>

      {/* Row delete action */}
      {isEditMode && (
        <td className="py-2.5 px-2 text-center align-middle no-print">
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Eliminar ingrediente"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </td>
      )}
    </tr>
  );
};
