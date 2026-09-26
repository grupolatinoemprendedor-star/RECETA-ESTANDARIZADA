import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Save,
  Copy,
  Printer,
  FileSpreadsheet,
  Download,
  Trash2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  FileCode,
  FileText,
  FileDown,
  CheckCircle2,
  Clock,
  Eye,
  Edit3,
} from 'lucide-react';

interface NavbarProps {
  mode: 'edit' | 'preview';
  setMode: (mode: 'edit' | 'preview') => void;
  recipesCount: number;
  onOpenDrawer: () => void;
  onNewRecipe: () => void;
  onSaveRecipe: () => void;
  onDuplicateRecipe: () => void;
  onDeleteRecipe: () => void;
  onClearRecipe: () => void;
  onRecalculate: () => void;
  onPrint: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  isSaved: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  recipesCount,
  onOpenDrawer,
  onNewRecipe,
  onSaveRecipe,
  onDuplicateRecipe,
  onDeleteRecipe,
  onClearRecipe,
  onRecalculate,
  onPrint,
  onExportPDF,
  onExportCSV,
  onExportJSON,
  isSaved,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5DFD3] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#242A24] text-[#E8E2D5] flex items-center justify-center font-editorial text-2xl font-bold border border-[#8C7A5B]/40 shadow-xs">
                RE
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#1C1E21] uppercase">
                    RECETA ESTÁNDAR
                  </h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#3D483D] text-[#EFEBE4] tracking-wider uppercase">
                    Técnico en Cocina
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] hidden sm:block">
                  Sistema profesional de estandarización, costeo y documentación gastronómica
                </p>
              </div>
            </div>

            {/* Mobile drawer trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenDrawer}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D5CDC0] bg-white text-[#2C332D]"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span>Mis Recetas ({recipesCount})</span>
              </button>
            </div>
          </div>

          {/* Central Controls: Mode switch & Save status */}
          <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
            {/* Save Status Badge */}
            <div className="flex items-center gap-1.5 text-xs text-[#5C636E]">
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Guardado</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span className="font-medium text-amber-800">Cambios sin guardar</span>
                </>
              )}
            </div>

            {/* Mode Toggle: Edit vs Sheet */}
            <div className="inline-flex p-1 bg-[#ECE6DC] rounded-lg border border-[#DDD5C7]">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'edit'
                    ? 'bg-white text-[#1C1E21] shadow-xs'
                    : 'text-[#616B5E] hover:text-[#1C1E21]'
                }`}
                title="Modo Edición: Introducir y modificar información técnica"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span>Modo Edición</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'preview'
                    ? 'bg-[#242A24] text-[#FAF8F5] shadow-xs'
                    : 'text-[#616B5E] hover:text-[#1C1E21]'
                }`}
                title="Modo Ficha: Visualizar ficha técnica gastronómica limpia"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Modo Ficha</span>
              </button>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Mis Recetas Drawer (Desktop) */}
              <button
                onClick={onOpenDrawer}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D5CDC0] bg-white text-[#2C332D] hover:bg-[#F3EFE9] transition-colors shadow-2xs"
                title="Ver y administrar recetas almacenadas"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span>Mis Recetas</span>
                <span className="ml-1 px-1.5 py-0.2 bg-[#ECE6DC] text-[#2C332D] text-[10px] rounded-full font-bold">
                  {recipesCount}
                </span>
              </button>

              {/* Nueva Receta */}
              <button
                onClick={onNewRecipe}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D5CDC0] bg-white text-[#2C332D] hover:bg-[#F3EFE9] transition-colors shadow-2xs"
                title="Crear nueva ficha de receta en blanco"
              >
                <Plus className="w-3.5 h-3.5 text-[#3D483D]" />
                <span className="hidden sm:inline">Nueva Receta</span>
              </button>

              {/* Guardar Receta */}
              <button
                onClick={onSaveRecipe}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2E372E] text-white hover:bg-[#1E251E] transition-colors shadow-xs"
                title="Guardar receta en memoria del sistema"
              >
                <Save className="w-3.5 h-3.5 text-[#D1BD9B]" />
                <span>Guardar</span>
              </button>

              {/* Recalcular */}
              <button
                onClick={onRecalculate}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#D5CDC0] bg-white text-[#2C332D] hover:bg-[#F3EFE9] transition-colors"
                title="Recalcular fórmulas y cantidades inmediatamente"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span className="sr-only sm:not-sr-only">Recalcular</span>
              </button>

              {/* Duplicar Receta */}
              <button
                onClick={onDuplicateRecipe}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#D5CDC0] bg-white text-[#2C332D] hover:bg-[#F3EFE9] transition-colors"
                title="Duplicar receta actual como copia independiente"
              >
                <Copy className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span className="hidden lg:inline">Duplicar</span>
              </button>

              {/* Imprimir / Guardar PDF */}
              <button
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#8C7A5B] bg-[#F7F3EB] text-[#242A24] hover:bg-[#ECE4D4] transition-colors shadow-2xs"
                title="Imprimir ficha técnica en tamaño Carta o guardar como PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span className="font-semibold">Imprimir / PDF</span>
              </button>

              {/* Exportar Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#D5CDC0] bg-white text-[#2C332D] hover:bg-[#F3EFE9] transition-colors"
                  title="Opciones de exportación"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                </button>

                {showExportMenu && (
                  <div
                    className="absolute right-0 mt-1 w-48 bg-white border border-[#DDD5C7] rounded-lg shadow-lg py-1 z-50 text-xs"
                    onMouseLeave={() => setShowExportMenu(false)}
                  >
                    <button
                      onClick={() => {
                        onExportPDF();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#2C332D] hover:bg-[#FAF8F5] flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4 text-[#8C7A5B]" />
                      <div>
                        <div className="font-medium">Descargar PDF Directo</div>
                        <div className="text-[10px] text-[#6B7280]">Ficha técnica oficial</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onExportCSV();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#2C332D] hover:bg-[#FAF8F5] flex items-center gap-2 border-t border-[#F0EBE1]"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="font-medium">Exportar a CSV</div>
                        <div className="text-[10px] text-[#6B7280]">Costeo e ingredientes</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onExportJSON();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#2C332D] hover:bg-[#FAF8F5] flex items-center gap-2 border-t border-[#F0EBE1]"
                    >
                      <FileCode className="w-4 h-4 text-[#8C7A5B]" />
                      <div>
                        <div className="font-medium">Copia de Seguridad JSON</div>
                        <div className="text-[10px] text-[#6B7280]">Archivo estructurado</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Limpiar / Eliminar */}
              <button
                onClick={onDeleteRecipe}
                className="inline-flex items-center p-1.5 text-xs font-medium rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                title="Eliminar receta actual"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
