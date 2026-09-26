import React, { useRef } from 'react';
import { Recipe } from '../types/recipe';
import { Camera, Trash2, Calendar, User, Building2, Users, Clock, Thermometer } from 'lucide-react';

interface RecipeHeaderProps {
  recipe: Recipe;
  onChange: (fields: Partial<Recipe>) => void;
  isEditMode: boolean;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe, onChange, isEditMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen seleccionada supera los 5MB. Por favor selecciona una imagen más ligera.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ imagen: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange({ imagen: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val <= 0) {
      onChange({ pax: 1 });
    } else {
      onChange({ pax: val });
    }
  };

  const incrementPax = () => {
    onChange({ pax: (recipe.pax || 1) + 1 });
  };

  const decrementPax = () => {
    if ((recipe.pax || 1) > 1) {
      onChange({ pax: (recipe.pax || 1) - 1 });
    }
  };

  return (
    <section className="bg-white border border-[#DDD5C7] rounded-xl shadow-xs p-5 md:p-7 mb-6 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Recipe Details & Meta */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-5">
          {/* Main Title */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold tracking-widest text-[#8C7A5B] uppercase font-mono">
                Documento de Estandarización Culinaria
              </span>
            </div>

            {isEditMode ? (
              <div className="relative">
                <label htmlFor="recipe-name" className="sr-only">
                  Nombre de la Receta
                </label>
                <input
                  id="recipe-name"
                  type="text"
                  value={recipe.nombre}
                  onChange={(e) => onChange({ nombre: e.target.value })}
                  placeholder="Ej: Amuleto de Arroz Campesino con Pollo Criollo"
                  className="w-full font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1E21] border-b-2 border-[#DDD5C7] focus:border-[#8C7A5B] bg-transparent py-1 px-0 outline-hidden transition-colors placeholder:text-stone-300"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Nombre técnico oficial del plato o preparación
                </span>
              </div>
            ) : (
              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1E21] tracking-tight leading-tight">
                {recipe.nombre || 'Receta Sin Nombre'}
              </h2>
            )}
          </div>

          {/* Technical Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
            {/* Fecha */}
            <div className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-lg p-2.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#666F64] uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span>Fecha de Elaboración</span>
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={recipe.fecha}
                  onChange={(e) => onChange({ fecha: e.target.value })}
                  className="w-full bg-white border border-[#DDD5C7] rounded px-2 py-1 text-xs text-[#1C1E21] font-medium outline-hidden focus:border-[#8C7A5B]"
                />
              ) : (
                <div className="text-xs font-semibold text-[#1C1E21] py-1">
                  {recipe.fecha || 'Sin fecha especificada'}
                </div>
              )}
            </div>

            {/* Creador */}
            <div className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-lg p-2.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#666F64] uppercase tracking-wider mb-1">
                <User className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span>Creador / Chef</span>
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={recipe.creador}
                  onChange={(e) => onChange({ creador: e.target.value })}
                  placeholder="Nombre del técnico o chef"
                  className="w-full bg-white border border-[#DDD5C7] rounded px-2 py-1 text-xs text-[#1C1E21] font-medium outline-hidden focus:border-[#8C7A5B]"
                />
              ) : (
                <div className="text-xs font-semibold text-[#1C1E21] py-1 truncate">
                  {recipe.creador || 'Técnico en Cocina'}
                </div>
              )}
            </div>

            {/* Establecimiento */}
            <div className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-lg p-2.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#666F64] uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span>Establecimiento</span>
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={recipe.establecimiento}
                  onChange={(e) => onChange({ establecimiento: e.target.value })}
                  placeholder="Restaurante / Taller"
                  className="w-full bg-white border border-[#DDD5C7] rounded px-2 py-1 text-xs text-[#1C1E21] font-medium outline-hidden focus:border-[#8C7A5B]"
                />
              ) : (
                <div className="text-xs font-semibold text-[#1C1E21] py-1 truncate">
                  {recipe.establecimiento || 'Producción Culinaria'}
                </div>
              )}
            </div>
          </div>

          {/* Key Factor: NO. PAX Banner */}
          <div className="bg-[#F4F1EA] border border-[#DDD5C7] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#2E372E] text-[#D1BD9B] shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#2E372E] flex items-center gap-1.5">
                  <span>NÚMERO DE PAX (Porciones)</span>
                  <span className="text-[10px] font-normal text-[#666F64] lowercase">
                    (control de escalado)
                  </span>
                </div>
                <p className="text-[11px] text-[#616B5E] mt-0.5">
                  Factor multiplicador en tiempo real: <span className="font-semibold text-[#1C1E21]">Cantidad Total = Cantidad × 1 Pax × {recipe.pax}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {isEditMode ? (
                <div className="flex items-center border border-[#C5BBAA] rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={decrementPax}
                    className="px-3 py-1.5 text-stone-600 hover:bg-[#FAF8F5] hover:text-[#1C1E21] font-bold text-base transition-colors select-none"
                    title="Disminuir PAX"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={recipe.pax}
                    onChange={handlePaxChange}
                    className="w-16 py-1.5 text-center font-mono text-base font-bold text-[#1C1E21] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={incrementPax}
                    className="px-3 py-1.5 text-stone-600 hover:bg-[#FAF8F5] hover:text-[#1C1E21] font-bold text-base transition-colors select-none"
                    title="Aumentar PAX"
                  >
                    +
                  </button>
                </div>
              ) : (
                <div className="px-4 py-1.5 bg-[#2E372E] text-white rounded-lg font-mono font-bold text-base tracking-wide flex items-center gap-1.5 shadow-2xs">
                  <span>{recipe.pax}</span>
                  <span className="text-xs font-normal text-[#D1BD9B]">PAX</span>
                </div>
              )}
            </div>
          </div>

          {/* Secondary fields: Temperatura & Tiempo */}
          {isEditMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <Thermometer className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span className="text-stone-500 font-medium">Temp. de Servicio:</span>
                <input
                  type="text"
                  value={recipe.temperaturaServicio || ''}
                  onChange={(e) => onChange({ temperaturaServicio: e.target.value })}
                  placeholder="Ej: 65°C a 70°C"
                  className="flex-1 bg-white border border-[#DDD5C7] rounded px-2 py-0.5 text-xs text-[#1C1E21] outline-hidden focus:border-[#8C7A5B]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-[#8C7A5B]" />
                <span className="text-stone-500 font-medium">Tiempo Preparación:</span>
                <input
                  type="text"
                  value={recipe.tiempoPreparacion || ''}
                  onChange={(e) => onChange({ tiempoPreparacion: e.target.value })}
                  placeholder="Ej: 45 minutos"
                  className="flex-1 bg-white border border-[#DDD5C7] rounded px-2 py-0.5 text-xs text-[#1C1E21] outline-hidden focus:border-[#8C7A5B]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Dish Photography with Upload / Replace / Remove */}
        <div className="lg:col-span-4 w-full">
          <div className="border border-[#DDD5C7] rounded-xl p-3 bg-[#FAF8F5] flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666F64]">
                Fotografía del Plato
              </span>
              {recipe.imagen && isEditMode && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-stone-400 hover:text-red-600 transition-colors p-1"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-[#ECE6DC] border border-[#D5CDC0] flex items-center justify-center group">
              {recipe.imagen ? (
                <img
                  src={recipe.imagen}
                  alt={recipe.nombre || 'Fotografía de la receta'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="p-3 rounded-full bg-[#FAF8F5] text-[#8C7A5B] mb-2 shadow-2xs">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-stone-600">Sin fotografía del plato</span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    {isEditMode ? 'Carga una imagen representativa' : 'No se adjuntó imagen'}
                  </span>
                </div>
              )}

              {/* Upload Overlay in Edit Mode */}
              {isEditMode && (
                <label
                  htmlFor="dish-image-input"
                  className={`absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-opacity ${
                    recipe.imagen ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  <Camera className="w-5 h-5 text-[#FAF8F5]" />
                  <span className="text-xs font-semibold">
                    {recipe.imagen ? 'Cambiar fotografía' : 'Cargar fotografía'}
                  </span>
                  <span className="text-[10px] text-stone-200">JPG, PNG o WEBP (máx. 5MB)</span>
                </label>
              )}

              <input
                ref={fileInputRef}
                id="dish-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={!isEditMode}
              />
            </div>
            <p className="text-[10px] text-stone-400 text-center mt-2">
              Fotografía real de presentación y emplatado técnico
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
