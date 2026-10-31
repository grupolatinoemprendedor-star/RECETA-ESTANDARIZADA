import React, { useRef, useEffect, useState, useMemo } from 'react';
import { CulinaryStep } from '../types/recipe';
import { getRecipeProcedure } from '../utils/calculations';
import {
  ChefHat,
  Copy,
  Check,
  ListOrdered,
  Sparkles,
  AlignLeft,
  FileText,
  Maximize2,
} from 'lucide-react';

interface ProcedureSectionProps {
  procedimiento?: string;
  steps: CulinaryStep[];
  isEditMode: boolean;
  onChangeProcedimiento: (texto: string) => void;
}

export const ProcedureSection: React.FC<ProcedureSectionProps> = ({
  procedimiento,
  steps,
  isEditMode,
  onChangeProcedimiento,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  // Unify text: use recipe.procedimiento if defined, otherwise derive from steps
  const currentText = useMemo(() => {
    return getRecipeProcedure({ procedimiento, pasos: steps });
  }, [procedimiento, steps]);

  // Auto-resize textarea to fit content seamlessly without cutting off text
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.max(220, el.scrollHeight + 8);
    el.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [currentText, isEditMode]);

  // Real-time statistics
  const stats = useMemo(() => {
    const text = currentText.trim();
    if (!text) return { paragraphs: 0, words: 0, chars: 0 };
    const paragraphs = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return {
      paragraphs: paragraphs.length,
      words,
      chars: text.length,
    };
  }, [currentText]);

  // Tool: Automatically number paragraphs if they aren't already numbered
  const handleAutoNumber = () => {
    if (!currentText.trim()) return;
    const lines = currentText.split(/\r?\n/);
    let stepCount = 1;
    const numbered = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      // If already starts with a number like "1. ", "1 -", "1)"
      if (/^\d+[\.\-\)]\s+/.test(trimmed)) {
        return trimmed;
      }
      const res = `${stepCount}. ${trimmed}`;
      stepCount++;
      return res;
    });
    onChangeProcedimiento(numbered.join('\n'));
  };

  // Tool: Clean redundant empty lines
  const handleCleanSpacing = () => {
    if (!currentText) return;
    const cleaned = currentText
      .split(/\r?\n/)
      .map((l) => l.trimEnd())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
    onChangeProcedimiento(cleaned);
  };

  // Tool: Copy entire procedure to clipboard
  const handleCopyText = async () => {
    if (!currentText) return;
    try {
      await navigator.clipboard.writeText(currentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Formatted paragraphs for read-only / preview mode
  const parsedParagraphs = useMemo(() => {
    if (!currentText.trim()) return [];
    return currentText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => {
        const match = line.match(/^(\d+)[\.\-\)]\s+(.*)$/);
        if (match) {
          return {
            isNumbered: true,
            number: match[1],
            text: match[2],
          };
        }
        return {
          isNumbered: false,
          number: (idx + 1).toString(),
          text: line,
        };
      });
  }, [currentText]);

  return (
    <section className="bg-white border border-[#DDD5C7] rounded-xl shadow-xs p-5 md:p-6 mb-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E8E2D5] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#2E372E] text-[#D1BD9B] shadow-2xs">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-editorial text-xl font-bold text-[#1C1E21] tracking-tight uppercase">
                PASO A PASO DE TÉCNICA APLICADA
              </h3>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD5C7] text-[#8C7A5B]">
                Espacio Continuo
              </span>
            </div>
            <p className="text-xs text-[#666F64] mt-0.5">
              Protocolo técnico culinario, temperaturas, métodos de cocción y tiempos de producción en un solo espacio continuo.
            </p>
          </div>
        </div>

        {/* Action badges & tools */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {currentText.trim() && (
            <button
              type="button"
              onClick={handleCopyText}
              title="Copiar todo el procedimiento al portapapeles"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#DDD5C7] hover:bg-[#EFEBE4] text-xs text-[#1C1E21] font-medium transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  <span>Copiar texto</span>
                </>
              )}
            </button>
          )}

          {isEditMode && currentText.trim() && (
            <>
              <button
                type="button"
                onClick={handleAutoNumber}
                title="Enumerar automáticamente cada párrafo que no tenga número"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD5C7] hover:bg-[#FAF8F5] text-xs text-stone-700 font-medium transition-colors shadow-2xs"
              >
                <ListOrdered className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span className="hidden md:inline">Numerar pasos</span>
              </button>

              <button
                type="button"
                onClick={handleCleanSpacing}
                title="Limpiar saltos de línea excesivos"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD5C7] hover:bg-[#FAF8F5] text-xs text-stone-700 font-medium transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden lg:inline">Ajustar espacios</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick helper banner in edit mode */}
      {isEditMode && (
        <div className="mb-3.5 p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <FileText className="w-4 h-4 text-[#8C7A5B] shrink-0" />
            <span>
              <strong>Área de texto autoexpandible:</strong> Puedes pegar directamente todo tu procedimiento continuo desde Word, PDF o notas digitales. El cuadro crecerá automáticamente sin límites según agregues contenido.
            </span>
          </div>
          {stats.chars > 0 && (
            <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500 shrink-0 self-end sm:self-auto bg-white px-2.5 py-1 rounded border border-[#DDD5C7]">
              <span><strong>{stats.paragraphs}</strong> {stats.paragraphs === 1 ? 'paso' : 'pasos'}</span>
              <span>•</span>
              <span><strong>{stats.words}</strong> palabras</span>
              <span>•</span>
              <span><strong>{stats.chars}</strong> caracteres</span>
            </div>
          )}
        </div>
      )}

      {/* Editor or Clean Display */}
      {isEditMode ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={currentText}
            onChange={(e) => {
              onChangeProcedimiento(e.target.value);
              adjustHeight();
            }}
            onInput={adjustHeight}
            rows={8}
            placeholder={`Escribe o pega aquí todo el procedimiento completo de la receta...\n\nEjemplo:\n1. Mise en place general: Pesaje de ingredientes con balanza de precisión, lavado y desinfección a 50 ppm por 5 minutos.\n2. Cortes técnicos: Picar cebolla en brunoise fino de 2 mm y reservar la proteína en refrigeración a 4°C.\n3. Tratamiento térmico primario: Sellar la proteína a fuego vivo con el aceite achiotado para lograr reacción de Maillard.\n4. Integración y cocción: Nacarar el arroz durante 2 minutos, incorporar el fondo caliente a 85°C y salar.\n5. Concentración: Cocinar destapado hasta evaporar el caldo superficial, tapar y reducir a fuego mínimo por 18 min.\n6. Reposo y montaje: Dejar en reposo pasivo 5 minutos, añadir hierbas frescas y servir en plato hondo precalentado a 68°C.`}
            className="w-full bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] focus:bg-white border-2 border-[#DDD5C7] focus:border-[#8C7A5B] rounded-xl p-4 sm:p-5 text-sm text-[#1C1E21] leading-relaxed placeholder:text-stone-300 outline-hidden transition-all shadow-inner resize-none font-sans"
            style={{ minHeight: '220px' }}
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3 text-[#8C7A5B]" />
              El tamaño del cuadro se adapta automáticamente al volumen de texto que pegues o redactes.
            </span>
            <span className="font-mono text-[10px]">
              Tip: Puedes usar numeración (1., 2., 3.) o viñetas según prefieras.
            </span>
          </div>
        </div>
      ) : (
        /* Read-only / Preview Mode */
        <div className="space-y-3">
          {parsedParagraphs.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-xs italic bg-[#FAF8F5] rounded-xl border border-dashed border-[#DDD5C7]">
              No se ha registrado técnica culinaria para esta receta. Activa el modo edición para redactar o pegar el procedimiento completo.
            </div>
          ) : (
            parsedParagraphs.map((para, index) => (
              <div
                key={index}
                className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl p-3.5 sm:p-4 text-xs flex items-start gap-3 transition-colors hover:border-[#D5CDC0]"
              >
                {para.isNumbered ? (
                  <div className="w-7 h-7 rounded-full bg-[#242A24] text-[#FAF8F5] font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {para.number}
                  </div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8C7A5B] shrink-0 mt-1.5 ml-2" />
                )}

                <div className="flex-1">
                  {para.isNumbered && (
                    <div className="font-editorial text-[11px] font-bold text-[#8C7A5B] uppercase tracking-wider mb-0.5">
                      Paso {para.number}
                    </div>
                  )}
                  <p className="text-[#2C332D] text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-medium">
                    {para.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};
