import React, { useState, useRef } from 'react';
import { Recipe } from '../types/recipe';
import { calculateRecipeTotals, formatCurrency } from '../utils/calculations';
import {
  X,
  Plus,
  Search,
  BookOpen,
  Copy,
  Trash2,
  Calendar,
  Users,
  Building2,
  Upload,
  CheckCircle,
} from 'lucide-react';

interface RecipeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  activeRecipeId: string;
  onSelectRecipe: (id: string) => void;
  onNewRecipe: () => void;
  onDuplicateRecipe: (id: string) => void;
  onDeleteRecipe: (id: string) => void;
  onImportRecipeJSON: (imported: Recipe) => void;
}

export const RecipeDrawer: React.FC<RecipeDrawerProps> = ({
  isOpen,
  onClose,
  recipes,
  activeRecipeId,
  onSelectRecipe,
  onNewRecipe,
  onDuplicateRecipe,
  onDeleteRecipe,
  onImportRecipeJSON,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredRecipes = recipes.filter(
    (r) =>
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.establecimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.creador.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.nombre && Array.isArray(parsed.ingredientes)) {
            // Assign a new ID to prevent colliding
            parsed.id = 'receta_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
            onImportRecipeJSON(parsed as Recipe);
          } else {
            alert('El archivo JSON seleccionado no tiene el formato válido de Receta Estándar.');
          }
        } catch (err) {
          alert('Error al leer el archivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#DDD5C7] shadow-2xl flex flex-col text-[#1C1E21]">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E5DFD3] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#2E372E] text-[#D1BD9B]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl font-bold uppercase tracking-tight text-[#1C1E21]">
                  MIS RECETAS
                </h2>
                <p className="text-xs text-stone-500">
                  {recipes.length} receta{recipes.length === 1 ? '' : 's'} guardada{recipes.length === 1 ? '' : 's'} en el sistema
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action bar inside drawer */}
          <div className="p-4 border-b border-[#E8E2D5] bg-[#F4F0E8] flex items-center gap-2">
            <button
              onClick={() => {
                onNewRecipe();
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#2E372E] text-white text-xs font-semibold hover:bg-[#1E251E] shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#D1BD9B]" />
              <span>Nueva Receta</span>
            </button>

            <button
              onClick={() => importInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#DDD5C7] bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors shadow-2xs"
              title="Importar archivo JSON de receta estándar"
            >
              <Upload className="w-3.5 h-3.5 text-[#8C7A5B]" />
              <span>Importar</span>
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>

          {/* Search box */}
          <div className="p-4 border-b border-[#E8E2D5]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, establecimiento o chef..."
                className="w-full bg-white border border-[#DDD5C7] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1C1E21] placeholder:text-stone-400 focus:border-[#8C7A5B] outline-hidden shadow-2xs"
              />
            </div>
          </div>

          {/* Recipe List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                {searchTerm
                  ? 'No se encontraron recetas que coincidan con la búsqueda.'
                  : 'Aún no tienes recetas registradas.'}
              </div>
            ) : (
              filteredRecipes.map((recipe) => {
                const isActive = recipe.id === activeRecipeId;
                const calcs = calculateRecipeTotals(recipe);

                return (
                  <div
                    key={recipe.id}
                    className={`border rounded-xl p-3.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white border-[#8C7A5B] shadow-md ring-1 ring-[#8C7A5B]'
                        : 'bg-white/80 border-[#E0D8CB] hover:border-[#8C7A5B]/60 hover:bg-white'
                    }`}
                    onClick={() => {
                      onSelectRecipe(recipe.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {isActive && (
                          <CheckCircle className="w-4 h-4 text-[#8C7A5B] shrink-0" />
                        )}
                        <h3 className="font-editorial text-base font-bold text-[#1C1E21] truncate">
                          {recipe.nombre || 'Receta sin título'}
                        </h3>
                      </div>

                      {/* Card actions */}
                      <div
                        className="flex items-center gap-1 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onDuplicateRecipe(recipe.id)}
                          className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded"
                          title="Duplicar receta"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {recipes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onDeleteRecipe(recipe.id)}
                            className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Eliminar receta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-stone-500 mb-2">
                      <div className="flex items-center gap-1 truncate">
                        <Calendar className="w-3 h-3 text-[#8C7A5B]" />
                        <span>{recipe.fecha || 'Sin fecha'}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <Users className="w-3 h-3 text-[#8C7A5B]" />
                        <span>{recipe.pax} PAX</span>
                      </div>
                      <div className="flex items-center gap-1 col-span-2 truncate">
                        <Building2 className="w-3 h-3 text-[#8C7A5B]" />
                        <span>{recipe.establecimiento || 'Cocina'}</span>
                      </div>
                    </div>

                    {/* Financial Pill */}
                    <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-sans">
                          Costo MP:
                        </span>
                        <span className="font-semibold text-stone-800">
                          {formatCurrency(calcs.costoMateriaPrimaTotal)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#8C7A5B] block font-sans font-semibold">
                          Precio Venta Real:
                        </span>
                        <span className="font-bold text-[#2E372E]">
                          {formatCurrency(calcs.precioRealVenta)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-[#DDD5C7] text-center text-[10px] font-mono text-stone-400 bg-[#FAF8F5]">
            Datos guardados localmente en su navegador
          </div>
        </div>
      </div>
    </div>
  );
};
