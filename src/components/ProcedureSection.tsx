import React from 'react';
import { CulinaryStep } from '../types/recipe';
import { Plus, Trash2, ArrowUp, ArrowDown, ChefHat } from 'lucide-react';

interface ProcedureSectionProps {
  steps: CulinaryStep[];
  isEditMode: boolean;
  onAddStep: () => void;
  onUpdateStep: (id: string, descripcion: string) => void;
  onRemoveStep: (id: string) => void;
  onMoveStep: (fromIndex: number, toIndex: number) => void;
}

export const ProcedureSection: React.FC<ProcedureSectionProps> = ({
  steps,
  isEditMode,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
  onMoveStep,
}) => {
  return (
    <section className="bg-white border border-[#DDD5C7] rounded-xl shadow-xs p-5 md:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E8E2D5] gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#2E372E] text-[#D1BD9B]">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-editorial text-xl font-bold text-[#1C1E21] tracking-tight uppercase">
              PASO A PASO DE TÉCNICA APLICADA
            </h3>
            <p className="text-xs text-[#666F64] mt-0.5">
              Protocolo técnico culinario, temperaturas, métodos de cocción y tiempos de producción.
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            type="button"
            onClick={onAddStep}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E372E] text-white hover:bg-[#1E251E] font-medium text-xs shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#D1BD9B]" />
            <span>+ AGREGAR PASO</span>
          </button>
        )}
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.length === 0 ? (
          <div className="py-8 text-center text-stone-400 text-xs italic">
            No se han registrado pasos para esta receta. Pulsa en "+ AGREGAR PASO" para documentar la técnica aplicada.
          </div>
        ) : (
          steps.map((step, index) => (
            <div
              key={step.id}
              className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl p-4 transition-all hover:border-[#D5CDC0]"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#242A24] text-[#FAF8F5] font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                    {index + 1}
                  </span>
                  <span className="font-editorial text-sm font-bold text-[#1C1E21] uppercase tracking-wide">
                    Paso {index + 1}
                  </span>
                </div>

                {isEditMode && (
                  <div className="flex items-center gap-1 no-print">
                    <button
                      type="button"
                      onClick={() => onMoveStep(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                      title="Mover paso arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveStep(index, index + 1)}
                      disabled={index === steps.length - 1}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                      title="Mover paso abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveStep(step.id)}
                      className="p-1 text-stone-400 hover:text-red-600 ml-1 rounded hover:bg-red-50"
                      title="Eliminar este paso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {isEditMode ? (
                <textarea
                  rows={3}
                  value={step.descripcion}
                  onChange={(e) => onUpdateStep(step.id, e.target.value)}
                  placeholder={`Describe detalladamente el paso técnico ${index + 1}...`}
                  className="w-full bg-white border border-[#DDD5C7] rounded-lg p-2.5 text-xs text-[#1C1E21] leading-relaxed placeholder:text-stone-400 focus:border-[#8C7A5B] outline-hidden shadow-2xs resize-y"
                />
              ) : (
                <p className="text-xs text-[#2C332D] leading-relaxed whitespace-pre-line pl-9">
                  {step.descripcion || <span className="text-stone-300 italic">Paso sin descripción</span>}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {isEditMode && steps.length > 0 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onAddStep}
            className="text-xs text-[#8C7A5B] hover:text-[#5E513B] font-semibold underline underline-offset-4"
          >
            + Agregar siguiente paso técnico
          </button>
        </div>
      )}
    </section>
  );
};
