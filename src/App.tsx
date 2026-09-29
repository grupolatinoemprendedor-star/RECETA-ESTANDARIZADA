import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Recipe, IngredientItem } from './types/recipe';
import { DEFAULT_RECIPES, createNewRecipe } from './data/defaultRecipes';
import {
  loadStoredRecipes,
  saveStoredRecipes,
  getActiveRecipeId,
  setActiveRecipeId,
  exportRecipeAsCSV,
  exportRecipeAsJSON,
} from './services/storage';
import { calculateRecipeTotals } from './utils/calculations';
import { Navbar } from './components/Navbar';
import { RecipeHeader } from './components/RecipeHeader';
import { IngredientTable } from './components/IngredientTable';
import { CostSummary } from './components/CostSummary';
import { ProcedureSection } from './components/ProcedureSection';
import { RecipeSheetView } from './components/RecipeSheetView';
import { RecipeDrawer } from './components/RecipeDrawer';
import { ConfirmModal } from './components/ConfirmModal';
import { generateRecipePDF } from './services/pdfExport';
import { RotateCw, Check, Loader2 } from 'lucide-react';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadStoredRecipes());
  const [activeId, setActiveId] = useState<string>(() => getActiveRecipeId(recipes));
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [recalcToast, setRecalcToast] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfToast, setPdfToast] = useState<string | null>(null);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Active recipe reference
  const currentRecipe = useMemo(() => {
    const found = recipes.find((r) => r.id === activeId);
    if (found) return found;
    return recipes[0] || createNewRecipe();
  }, [recipes, activeId]);

  // Central Calculation Engine
  const calculations = useMemo(() => {
    return calculateRecipeTotals(currentRecipe);
  }, [currentRecipe]);

  // Persist recipes automatically whenever they change
  useEffect(() => {
    saveStoredRecipes(recipes);
    setActiveRecipeId(activeId);
  }, [recipes, activeId]);

  // Update recipe fields with auto-save & timestamp
  const updateCurrentRecipe = useCallback(
    (fields: Partial<Recipe>) => {
      setRecipes((prev) =>
        prev.map((r) => {
          if (r.id === activeId) {
            return {
              ...r,
              ...fields,
              updatedAt: Date.now(),
            };
          }
          return r;
        })
      );
      setIsSaved(false);
      // Auto-save debounce indicator
      setTimeout(() => setIsSaved(true), 600);
    },
    [activeId]
  );

  // Ingredients handlers
  const handleAddIngredient = () => {
    const currentList = currentRecipe.ingredientes || [];
    const newItem: IngredientItem = {
      id: 'ing_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      item: currentList.length + 1,
      ingrediente: '',
      miseEnPlace: '',
      unidad: 'g',
      cantidadPorPax: 0,
      valorUnidadMinima: 0,
    };
    updateCurrentRecipe({ ingredientes: [...currentList, newItem] });
  };

  const handleUpdateIngredient = (id: string, updated: Partial<IngredientItem>) => {
    const updatedIngredients = currentRecipe.ingredientes.map((item) =>
      item.id === id ? { ...item, ...updated } : item
    );
    updateCurrentRecipe({ ingredientes: updatedIngredients });
  };

  const handleRemoveIngredient = (id: string) => {
    const filtered = currentRecipe.ingredientes.filter((item) => item.id !== id);
    // Renumber remaining items
    const renumbered = filtered.map((item, index) => ({
      ...item,
      item: index + 1,
    }));
    updateCurrentRecipe({ ingredientes: renumbered });
  };

  const handleMoveIngredient = (fromIndex: number, toIndex: number) => {
    const list = [...currentRecipe.ingredientes];
    if (toIndex < 0 || toIndex >= list.length) return;
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    // Renumber items
    const renumbered = list.map((item, idx) => ({
      ...item,
      item: idx + 1,
    }));
    updateCurrentRecipe({ ingredientes: renumbered });
  };

  // Step handlers
  const handleAddStep = () => {
    const currentSteps = currentRecipe.pasos || [];
    const newStep = {
      id: 'step_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      numero: currentSteps.length + 1,
      descripcion: '',
    };
    updateCurrentRecipe({ pasos: [...currentSteps, newStep] });
  };

  const handleUpdateStep = (id: string, descripcion: string) => {
    const updated = currentRecipe.pasos.map((s) =>
      s.id === id ? { ...s, descripcion } : s
    );
    updateCurrentRecipe({ pasos: updated });
  };

  const handleRemoveStep = (id: string) => {
    const filtered = currentRecipe.pasos.filter((s) => s.id !== id);
    const renumbered = filtered.map((s, idx) => ({ ...s, numero: idx + 1 }));
    updateCurrentRecipe({ pasos: renumbered });
  };

  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    const list = [...currentRecipe.pasos];
    if (toIndex < 0 || toIndex >= list.length) return;
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    const renumbered = list.map((s, idx) => ({ ...s, numero: idx + 1 }));
    updateCurrentRecipe({ pasos: renumbered });
  };

  // Recipe Lifecycle Actions
  const handleNewRecipe = () => {
    const newRec = createNewRecipe();
    setRecipes((prev) => [newRec, ...prev]);
    setActiveId(newRec.id);
    setMode('edit');
    setIsSaved(true);
  };

  const handleDuplicateRecipe = (idToDuplicate?: string) => {
    const targetId = idToDuplicate || activeId;
    const target = recipes.find((r) => r.id === targetId);
    if (!target) return;

    const copy: Recipe = {
      ...target,
      id: 'receta_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      nombre: `${target.nombre} (Copia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setRecipes((prev) => [copy, ...prev]);
    setActiveId(copy.id);
    setMode('edit');
    setIsSaved(true);
  };

  const handleDeleteRecipePrompt = (idToDelete?: string) => {
    const targetId = idToDelete || activeId;
    const target = recipes.find((r) => r.id === targetId);
    if (!target) return;

    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Receta Estándar',
      message: `¿Estás seguro de que deseas eliminar permanentemente la receta "${target.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar Receta',
      isDestructive: true,
      onConfirm: () => {
        setRecipes((prev) => {
          const remaining = prev.filter((r) => r.id !== targetId);
          if (remaining.length === 0) {
            const fallback = createNewRecipe();
            setActiveId(fallback.id);
            return [fallback];
          }
          if (activeId === targetId) {
            setActiveId(remaining[0].id);
          }
          return remaining;
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleClearRecipePrompt = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Limpiar Formulario de Receta',
      message:
        '¿Deseas restablecer todos los campos e ingredientes de esta receta? Los datos actuales se borrarán.',
      confirmText: 'Limpiar Todo',
      isDestructive: true,
      onConfirm: () => {
        const clean = createNewRecipe();
        updateCurrentRecipe({
          nombre: 'Receta sin título',
          imagen: '',
          ingredientes: clean.ingredientes,
          pasos: clean.pasos,
          mermaPorcentaje: 15,
          porcentajeCosto: 30,
          impoconsumoActivo: true,
          impoconsumoPorcentaje: 8,
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleManualSave = () => {
    saveStoredRecipes(recipes);
    setIsSaved(true);
  };

  const handleRecalculate = () => {
    // Force recalculation check and show confirmation toast
    setRecalcToast(true);
    setTimeout(() => setRecalcToast(false), 2000);
  };

  const handlePrint = () => {
    // If user is in edit mode, switch to sheet view so the clean technical sheet is immediately visible
    if (mode !== 'preview') {
      setMode('preview');
    }
    // Give react time to render the sheet view before calling print dialog
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.warn('Error invoking window.print():', err);
        // Fallback: trigger PDF export directly
        handleExportPDF();
      }
    }, 150);
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    setPdfToast('Generando Ficha Técnica en PDF...');

    try {
      const success = await generateRecipePDF(currentRecipe, calculations);
      if (success) {
        setPdfToast('¡Ficha Técnica descargada en PDF con éxito!');
      } else {
        setPdfToast('Abriendo ventana de impresión del navegador...');
        window.print();
      }
    } catch (e) {
      console.error('Error generating PDF:', e);
      window.print();
    } finally {
      setIsExportingPDF(false);
      setTimeout(() => setPdfToast(null), 3500);
    }
  };

  const handleExportCSV = () => {
    exportRecipeAsCSV(currentRecipe);
  };

  const handleExportJSON = () => {
    exportRecipeAsJSON(currentRecipe);
  };

  const handleImportRecipeJSON = (imported: Recipe) => {
    setRecipes((prev) => [imported, ...prev]);
    setActiveId(imported.id);
    setMode('edit');
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1E21]">
      {/* Navigation Header */}
      <Navbar
        mode={mode}
        setMode={setMode}
        recipesCount={recipes.length}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNewRecipe={handleNewRecipe}
        onSaveRecipe={handleManualSave}
        onDuplicateRecipe={() => handleDuplicateRecipe()}
        onDeleteRecipe={() => handleDeleteRecipePrompt()}
        onClearRecipe={handleClearRecipePrompt}
        onRecalculate={handleRecalculate}
        onPrint={handlePrint}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        isSaved={isSaved}
      />

      {/* PDF Export Feedback Toast Alert */}
      {pdfToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#242A24] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#8C7A5B] no-print animate-in fade-in slide-in-from-top-2">
          {isExportingPDF ? (
            <Loader2 className="w-5 h-5 text-[#D1BD9B] animate-spin shrink-0" />
          ) : (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Ficha Técnica Gastronómica
            </div>
            <div className="text-xs text-stone-200 mt-0.5">{pdfToast}</div>
          </div>
        </div>
      )}

      {/* Recalculate Toast Alert */}
      {recalcToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#242A24] text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-[#8C7A5B] no-print animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[#D1BD9B]" />
          <span className="text-xs font-mono">
            Todas las fórmulas y costos actualizados con exactitud matemática.
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {mode === 'edit' ? (
          <div className="no-print">
            {/* Encabezado: Título, Metadatos, PAX e Imagen */}
            <RecipeHeader
              recipe={currentRecipe}
              onChange={updateCurrentRecipe}
              isEditMode={true}
            />

            {/* Tabla Principal de Ingredientes (9 Columnas) */}
            <IngredientTable
              ingredients={currentRecipe.ingredientes}
              calculations={calculations}
              pax={currentRecipe.pax}
              isEditMode={true}
              onAddIngredient={handleAddIngredient}
              onUpdateIngredient={handleUpdateIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onMoveIngredient={handleMoveIngredient}
            />

            {/* Estructura de Costos y Precio de Venta */}
            <CostSummary
              calculations={calculations}
              pax={currentRecipe.pax}
              margenErrorPorcentaje={currentRecipe.margenErrorPorcentaje !== undefined ? currentRecipe.margenErrorPorcentaje : 10}
              mermaPorcentaje={currentRecipe.mermaPorcentaje}
              porcentajeCosto={currentRecipe.porcentajeCosto}
              impoconsumoActivo={currentRecipe.impoconsumoActivo}
              impoconsumoPorcentaje={currentRecipe.impoconsumoPorcentaje}
              redondearPrecios={currentRecipe.redondearPrecios !== false}
              metodoRedondeo={currentRecipe.metodoRedondeo || 'mil'}
              isEditMode={true}
              onUpdateRecipe={updateCurrentRecipe}
            />

            {/* Paso a Paso de Técnica Aplicada */}
            <ProcedureSection
              steps={currentRecipe.pasos}
              isEditMode={true}
              onAddStep={handleAddStep}
              onUpdateStep={handleUpdateStep}
              onRemoveStep={handleRemoveStep}
              onMoveStep={handleMoveStep}
            />
          </div>
        ) : (
          <div>
            {/* Modo Ficha Técnica Oficial (Visualización Limpia) */}
            <RecipeSheetView
              recipe={currentRecipe}
              calculations={calculations}
              onSwitchToEdit={() => setMode('edit')}
              onPrint={handlePrint}
              onExportPDF={handleExportPDF}
            />
          </div>
        )}

        {/* Dedicated Print Sheet: Always rendered cleanly for the browser print system */}
        <div className="print-only hidden">
          <RecipeSheetView
            recipe={currentRecipe}
            calculations={calculations}
            containerId="recipe-sheet-hidden-print"
            onSwitchToEdit={() => {}}
            onPrint={() => {}}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8E2D5] py-4 text-center text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="font-editorial text-sm font-bold text-[#1C1E21]">
            RECETA ESTÁNDAR · TÉCNICO EN COCINA
          </div>
          <div className="text-[11px] text-stone-400">
            Desarrollado para estandarización gastronómica profesional, control de mermas y costeo técnico.
          </div>
        </div>
      </footer>

      {/* Recipe Management Drawer */}
      <RecipeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        recipes={recipes}
        activeRecipeId={activeId}
        onSelectRecipe={(id) => {
          setActiveId(id);
          setIsSaved(true);
        }}
        onNewRecipe={handleNewRecipe}
        onDuplicateRecipe={(id) => handleDuplicateRecipe(id)}
        onDeleteRecipe={(id) => handleDeleteRecipePrompt(id)}
        onImportRecipeJSON={handleImportRecipeJSON}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
