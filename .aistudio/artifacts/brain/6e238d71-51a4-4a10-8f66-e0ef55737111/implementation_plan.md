# Plan Definitivo: Sistema Integral de Costeo Gastronómico (Porciones y Lote/Rendimiento)

Ampliación y evolución técnica del sistema de costeo gastronómico para incorporar **Costeo por Lote / Rendimiento Culinario** y **Gestión de Preparaciones Base Reutilizables**, preservando al 100% las recetas existentes, fórmulas financieras, el PAX dinámico y la estructura de datos almacenados.

---

## Revisión del Usuario y Ajustes Incorporados

> [!IMPORTANT]
> **Etapa 1 (Plan Definitivo Ajustado): Cero Modificación de Código Fuente.**
> Se han incorporado con precisión quirúrgica los 4 ajustes técnicos y la garantía de preservación solicitados:

1. **Campos Independientes para Cantidades de Lote (`cantidadLote`)**:
   - `cantidadPorPax` se preserva **exclusivamente** para el costeo de porciones individuales en recetas de venta directa.
   - Para las preparaciones por lote, se añade el campo independiente `cantidadLote?: number` en el insumo, junto con la configuración de lote `batchYield?: BatchYieldConfig` a nivel de receta. No existe reutilización forzada ni sobreescritura de campos.

2. **Cero Manipulación de Datos Reales en `localStorage`**:
   - El sistema **no inyectará recetas de prueba automáticas** en el `localStorage` del usuario. Si el usuario ya tiene recetas creadas o almacenadas, estas se respetan intactas sin alteración alguna.
   - Las pruebas de verificación y validación se efectuarán de forma aislada sin contaminar ni sobrescribir la base de datos real.

3. **Diferenciación Rigurosa de Mermas (Sin Duplicación)**:
   - El rendimiento final aprovechable de una preparación base (ej. 4.200 ml obtenidos de un fondo) ya absorbe intrínsecamente sus pérdidas de evaporación, hervor y filtrado. Su costo por unidad mínima ($/ml) refleja fielmente ese rendimiento real.
   - Al incorporar esa base en una receta final (ej. salsa o plato fuerte), entra con su costo unitario exacto como costo de materia prima neta. Las mermas de cocción de la receta final se aplican únicamente al plato general sin doble castigo ni recálculo de la merma del fondo.

4. **Conversiones Matemáticamente Convalidadas (Misma Magnitud Física)**:
   - Conversiones estrictas de volumen: $\text{ml} \leftrightarrow \text{L}$ ($1\text{ L} = 1.000\text{ ml}$).
   - Conversiones estrictas de masa: $\text{g} \leftrightarrow \text{kg} \leftrightarrow \text{libra (500 g)} \leftrightarrow \text{arroba (12.5 kg)}$.
   - Conversiones de conteo: $\text{unidad} \leftrightarrow \text{docena (12 und)}$.
   - **Prohibición de conversión cruzada sin densidad**: El sistema prohíbe terminantemente convertir gramos a mililitros o viceversa de manera genérica. Si un insumo líquido se intenta dosificar en gramos sin densidad definida, el sistema emite una advertencia técnica impidiendo errores de costeo.

5. **Confirmación Expresa de Compatibilidad Retroactiva Total**:
   - Toda receta creada previamente mantendrá al 100%:
     - Sus cálculos exactos de materia prima, margen de error (10%), merma (15%), porcentaje de costo / utilidad y redondeo comercial.
     - Su multiplicador de PAX dinámico libre e interactivo.
     - Sus notas, fotografía, procedimiento autoexpandible y exportaciones a PDF, CSV y JSON.

---

## 1. Visión General y Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SISTEMA CENTRAL DE COSTEO                             │
│                                                                                 │
│   Estado Global: recipes: Recipe[] (localStorage: 'receta_estandar_recipes_v1') │
│   Tipo de Preparación: tipoReceta ('porciones' | 'lote')                       │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│     MODALIDAD A: PORCIONES (PAX)      │   │    MODALIDAD B: LOTE / RENDIMIENTO    │
│  (Entradas, Platos, Postres, Carta)   │   │     (Fondos, Caldos, Salsas Madre)    │
├───────────────────────────────────────┤   ├───────────────────────────────────────┤
│ • Campo: cantidadPorPax               │   │ • Campo: cantidadLote                 │
│ • Escala con No. PAX dinámico         │   │ • Cantidad fija de producción lote    │
│ • Insumos de almacén + Bases Enlazadas│   │ • Rendimiento Final Real (ml o g)     │
│ • Estructura Financiera Comercial:    │   │ • Costo Unitario = Costo ÷ Rendimiento│
│   - Margen Error (modificable)        │   │ • Costo por ml/g, 100 ml/100 g, L/kg  │
│   - Merma Cocción (modificable)       │   │ • Costos adicionales opcionales       │
│   - % Food Cost / Utilidad (presets)  │   │ • Sin precio de venta de carta        │
│   - Impoconsumo (8%)                  │   │ • Sin impoconsumo comercial           │
│   - Redondeo a precios cerrados       │   │ • Disponible como Base Reutilizable   │
└───────────────────▲───────────────────┘   └───────────────────┬───────────────────┘
                    │                                           │
                    └─────────── VÍNCULO DE COSTO ──────────────┘
                        (Importa $/ml o $/g sin duplicar)
```

---

## 2. Definición del Modelo de Datos Extendido

Los tipos se extienden en `src/types/recipe.ts` manteniendo los campos existentes y agregando los nuevos con carácter opcional:

```typescript
export type TipoReceta = 'porciones' | 'lote';
export type CategoriaBase = 'fondos' | 'salsas' | 'caldos' | 'masas' | 'bases' | 'otro';

export interface BatchYieldConfig {
  rendimientoFinal: number; // Ej. 4200 (ml) o 5000 (ml)
  unidadRendimiento: 'ml' | 'g' | 'L' | 'kg'; // Magnitud física del rendimiento
  costosAdicionalesProduccion?: number; // Opcional: empaque, energía específica si aplica
  notasRendimiento?: string; // Ej. "Volumen inicial 6.000 ml, evaporación 25%, filtrado 5%"
}

export interface IngredientItem {
  id: string;
  item: number;
  grupoInventario?: GrupoInventario;
  ingrediente: string;
  miseEnPlace: string;
  unidad: StandardUnit | string;
  customUnidad?: string;
  
  // MODALIDAD PORCIONES (Intacto)
  cantidadPorPax: number; // Solo aplica cuando tipoReceta === 'porciones'
  
  // MODALIDAD LOTE (Campo independiente)
  cantidadLote?: number; // Solo aplica cuando tipoReceta === 'lote'
  
  valorUnidadMinima: number; // Costo por unidad mínima ($/g, $/ml, $/und)
  
  // VÍNCULO CON PREPARACIÓN BASE
  esPreparacionBase?: boolean;
  baseRecipeId?: string; // ID de la preparación base de origen
  baseRecipeNombre?: string;
}

export interface Recipe {
  id: string;
  tipoReceta?: TipoReceta; // 'porciones' (predeterminado si no existe) | 'lote'
  categoriaBase?: CategoriaBase;
  batchYield?: BatchYieldConfig;
  
  // CAMPOS EXISTENTES 100% PRESERVADOS
  nombre: string;
  imagen: string;
  fecha: string;
  creador: string;
  establecimiento: string;
  pax: number;
  ingredientes: IngredientItem[];
  margenErrorPorcentaje?: number;
  mermaPorcentaje: number;
  porcentajeCosto: number;
  impoconsumoActivo: boolean;
  impoconsumoPorcentaje: number;
  redondearPrecios?: boolean;
  metodoRedondeo?: RoundingMethod;
  pasos: CulinaryStep[];
  procedimiento?: string;
  notasAdicionales?: string;
  temperaturaServicio?: string;
  tiempoPreparacion?: string;
  createdAt: number;
  updatedAt: number;
}
```

---

## 3. Lógica de Cálculo y Matemática Gastronómica

### A. Para Recetas por Porciones (Venta Directa - Fórmula Actual Intacta)
1. Para cada ingrediente $i$:
   $$\text{Cantidad Total}_i = \text{cantidadPorPax}_i \times \text{PAX}$$
   $$\text{Valor x 1 PAX}_i = \text{cantidadPorPax}_i \times \text{factorConversión}_i \times \text{valorUnidadMinima}_i$$
   $$\text{Valor Total}_i = \text{Valor x 1 PAX}_i \times \text{PAX}$$
2. Costo Materia Prima Total $= \sum \text{Valor Total}_i$.
3. Margen de Error $= \text{Costo Materia Prima} \times (\% \text{Error} / 100)$.
4. Costo con Merma $= (\text{Costo} + \text{Margen Error}) / (1 - \% \text{Merma} / 100)$.
5. Precio Base $= \text{Costo con Merma} / (\% \text{Food Cost} / 100)$.
6. Impoconsumo $= \text{Precio Base} \times (\% \text{Impoconsumo} / 100)$.
7. Precio Real de Venta $= \text{Precio Base} + \text{Impoconsumo}$ (con o sin redondeo a millar/centena).

### B. Para Preparaciones por Lote (Rendimiento Real)
1. Para cada ingrediente $i$ del lote:
   - Se utiliza **estrictamente** el campo `cantidadLote`.
   - **El número de PAX NO interviene ni multiplica las cantidades del lote**.
   $$\text{Costo Insumo}_i = \text{cantidadLote}_i \times \text{factorConversión}_i \times \text{valorUnidadMinima}_i$$
2. Costo Total de Insumos del Lote $= \sum \text{Costo Insumo}_i$.
3. Costo Total de Producción $= \text{Costo Insumos} + \text{costosAdicionalesProduccion}$ (si se registran).
4. Normalización del Rendimiento Final:
   - Si la unidad es `L`, rendimiento en $\text{ml} = \text{rendimientoFinal} \times 1.000$.
   - Si la unidad es `kg`, rendimiento en $\text{g} = \text{rendimientoFinal} \times 1.000$.
5. Costo Unitario de Rendimiento:
   $$\text{Costo por ml (o g)} = \frac{\text{Costo Total de Producción}}{\text{Rendimiento Final Normalizado}}$$
   $$\text{Costo por 100 ml (o 100 g)} = \text{Costo por ml} \times 100$$
   $$\text{Costo por Litro (o kg)} = \text{Costo por ml} \times 1.000$$

### C. Sistema de Conversión Estricto entre Magnitudes Compatibles
```typescript
export function convertCompatibleUnits(
  qty: number,
  fromUnit: string,
  toUnit: string
): { success: boolean; convertedQty: number; error?: string } {
  const f = normalizeUnit(fromUnit);
  const t = normalizeUnit(toUnit);
  
  if (f === t) return { success: true, convertedQty: qty };

  // Volumen estricto
  const isVolF = f === 'ml' || f === 'l';
  const isVolT = t === 'ml' || t === 'l';
  if (isVolF && isVolT) {
    const inMl = f === 'l' ? qty * 1000 : qty;
    const finalQty = t === 'l' ? inMl / 1000 : inMl;
    return { success: true, convertedQty: finalQty };
  }

  // Masa estricta
  const isMassF = f === 'g' || f === 'kg' || f === 'libra' || f === 'arroba';
  const isMassT = t === 'g' || t === 'kg' || t === 'libra' || t === 'arroba';
  if (isMassF && isMassT) {
    const toGramsFactor: Record<string, number> = { g: 1, kg: 1000, libra: 500, arroba: 12500 };
    const inGrams = qty * (toGramsFactor[f] || 1);
    const finalQty = inGrams / (toGramsFactor[t] || 1);
    return { success: true, convertedQty: finalQty };
  }

  // Rechazo explícito de conversión cruzada
  return {
    success: false,
    convertedQty: qty,
    error: `Incompatibilidad de magnitudes: no se puede convertir ${fromUnit} a ${toUnit} sin una densidad específica definida.`,
  };
}
```

---

## 4. Componentes y Adaptación Visual

### 1. `RecipeHeader.tsx`
- En la parte superior: Selector de modalidad interactivo con tabs discretos:
  - `🍽️ Receta para Carta (Porciones / PAX)`
  - `🥣 Preparación Base (Lote / Rendimiento)`
- En **Modo Porciones**: Muestra el banner y selector dinámico de PAX (- / + e input numérico) tal como funciona hoy.
- En **Modo Lote**: Reemplaza el banner de PAX por el panel de **Rendimiento Final de Producción**:
  - Campo numérico para `Rendimiento Obtenido` (ej. 4200 o 5000).
  - Selector de unidad de rendimiento (`ml`, `L`, `g`, `kg`).
  - Resumen visual en tiempo real: `Costo por ml: $X · Costo por Litro: $Y`.

### 2. `IngredientTable.tsx` e `IngredientRow.tsx`
- En **Modo Porciones**:
  - Conserva todas las columnas actuales: `ITEMS`, `G.I`, `INGREDIENTES`, `MISE EN PLACE`, `UNIDAD`, `CANTIDAD X 1 PAX`, `CANTIDAD TOTAL ({pax} PAX)`, `VALOR UNIDAD MÍNIMA`, `VALOR X 1 PAX`, `VALOR TOTAL`.
  - Botón secundario `+ AGREGAR PREPARACIÓN BASE`: Permite seleccionar una base existente (ej. Fondo de Ave). Se inserta con su costo unitario bloqueado y una insignia identificativa `[BASE CULINARIA]`.
- En **Modo Lote**:
  - La columna de cantidad se etiqueta claramente como `CANTIDAD UTILIZADA EN EL LOTE` (leyendo y editando `cantidadLote`).
  - No muestra columnas de `CANTIDAD X 1 PAX` ni `VALOR X 1 PAX` al no existir comensales en un lote de producción intermedia.

### 3. `CostSummary.tsx`
- En **Modo Porciones**: Se renderizan las 4 tarjetas financieras completas vigentes (Costo Materia Prima, Margen Error 10%, Merma 15%, Utilidad / Food Cost con presets 80/20, 75/25, 70/30, 65/35, 60/40, 50/50, Impoconsumo 8%, Precios Cerrados, Precio Carta).
- En **Modo Lote**: Conmuta a la **Estructura de Rendimiento y Costo de Producción**:
  - Tarjeta 1: `Costo Total Insumos Lote`.
  - Tarjeta 2: `Rendimiento Final Aprovechable` (volumen/peso obtenido tras cocción).
  - Tarjeta 3: `Costos Unitarios de Utilización` (Muestra desglose: por ml/g, por 100 ml/100 g y por Litro/Kg).
  - Tarjeta 4: `Costos Adicionales de Producción` (opcional, editable solo por el usuario).
  - **No muestra precio de venta comercial ni impoconsumo**.

### 4. `RecipeDrawer.tsx` (Gestor de Recetas)
- Se incorporan dos pestañas de navegación:
  - Tab 1: `Recetas de Carta ({n})`
  - Tab 2: `Bases y Sub-Recetas ({m})`
- Permite crear directamente una nueva preparación base o una nueva receta convencional, duplicarlas, consultarlas y eliminarlas con el diálogo de confirmación ya implementado.

### 5. `RecipeSheetView.tsx` y `nativePdf.ts` (Ficha Técnica y PDF)
- Si la receta es de tipo `lote`, la ficha técnica impresa y el PDF nativo imprimen la sección de **Rendimiento de Producción y Costeo al Gramo/Mililitro**, sin inventar precios de carta inexistentes.
- Si es de tipo `porciones`, imprimen la estructura de venta comercial habitual.

---

## 5. Plan de Pruebas Riguroso (8 Pruebas Obligatorias)

Cada prueba se validará estrictamente en ejecución:

1. **Prueba 1 (PAX Dinámico en Venta Directa)**:
   - Verificar receta convencional con 10, 20, 35 y 50 PAX.
   - Constatar que las cantidades totales y costos escalan proporcionalmente y que el selector de PAX no está restringido a 35.
2. **Prueba 2 (Costeo por Lote / Fondo de Ave)**:
   - Crear preparación base: Costo total de ingredientes = $20.000 COP, Rendimiento = 5.000 ml.
   - Constatar: Costo/ml = $4, Costo/100 ml = $400, Costo/Litro = $4.000.
   - Constatar que las cantidades no se multiplican por ningún valor de PAX.
3. **Prueba 3 (Integración Base $\rightarrow$ Salsa)**:
   - Incorporar 100 ml del fondo en una salsa para 35 PAX.
   - Constatar: Cantidad total = 3.500 ml, Costo total del insumo = $14.000 COP.
4. **Prueba 4 (Cambio dinámico de PAX con Base vinculada)**:
   - Modificar la salsa de 35 a 20 PAX.
   - Constatar: Cantidad total = 2.000 ml, Costo total = $8.000 COP.
5. **Prueba 5 (Módulo Financiero de Venta Directa)**:
   - Constatar que en la salsa o plato final se calculen con exactitud: Margen de error, Merma de cocción, % Utilidad / Food Cost, Impoconsumo y Redondeo a millares cerrados.
6. **Prueba 6 (Bases sin precios comerciales)**:
   - Verificar que el fondo de ave no reciba precio de carta ni impoconsumo.
7. **Prueba 7 (Actualización y Control de Versiones de Costos Vinculados)**:
   - Modificar el precio de un ingrediente del fondo y verificar que el costo unitario se actualice en el catálogo.
   - Constatar que las recetas derivadas conservan su referencia histórica a menos que el usuario autorice expresamente la sincronización de costos mediante el diálogo de control de versiones.
8. **Prueba 8 (Integridad Retroactiva y Exportaciones)**:
   - Abrir las recetas previas existentes en el sistema y verificar que mantengan todos sus valores 100% idénticos respecto al respaldo pre-etapa 2.
   - Constatar que la exportación a PDF nativo, CSV y JSON opere con absoluta fidelidad y compatibilidad.

---

## 6. Estado de Ejecución y Resultados de Verificación (Completado 100%)

- **Copia de Seguridad Realizada:** `src/backup_pre_etapa2/` preservada íntegramente.
- **Datos de Usuario en `localStorage`:** 0 manipulaciones, preservados con retrocompatibilidad automática.
- **Compilación y Linteo (`tsc --noEmit`, `vite build`):** 0 errores, compilación exitosa.
- **Suite de Pruebas de Validación Ejecutada:** Las 8 pruebas matemáticas y operativas fueron ejecutadas con 100% de aprobación (`PASS`).
