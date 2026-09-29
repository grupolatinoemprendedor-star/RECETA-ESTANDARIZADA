import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Recipe, RecipeCalculations } from '../types/recipe';
import { formatCurrency, formatQuantity } from '../utils/calculations';

/**
 * Generates a clean, professional, publication-ready PDF Ficha Técnica
 * using native vector jsPDF and autoTable.
 * 
 * Works 100% reliably in any browser or iframe without depending on DOM rendering,
 * window.print(), or external servers.
 */
export function generateNativeRecipePDF(recipe: Recipe, calculations: RecipeCalculations): boolean {
  try {
    // 1. Initialize Document: Letter size (215.9 x 279.4 mm), portrait
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 14;

    // --- HEADER / ENCABEZADO TÉCNICO ---
    doc.setFillColor(36, 42, 36); // #242A24 (Verde Botella Oscuro)
    doc.rect(margin, currentY, contentWidth, 24, 'F');

    // Title & Subtitle inside Header
    doc.setTextColor(209, 189, 155); // #D1BD9B (Dorado Culinario)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`DOCUMENTO TÉCNICO GASTRONÓMICO · CÓDIGO REG: REC-${recipe.id.slice(-6).toUpperCase()}`, margin + 5, currentY + 6);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('RECETA ESTÁNDAR', margin + 5, currentY + 14);

    doc.setTextColor(220, 220, 220);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('TÉCNICO EN COCINA · ESTANDARIZACIÓN Y COSTEO', margin + 5, currentY + 19);

    // Date & PAX badge on the right
    doc.setTextColor(209, 189, 155);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`PAX: ${recipe.pax} PORCIONES`, pageWidth - margin - 5, currentY + 11, { align: 'right' });

    doc.setTextColor(220, 220, 220);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`FECHA: ${recipe.fecha || new Date().toISOString().split('T')[0]}`, pageWidth - margin - 5, currentY + 18, { align: 'right' });

    currentY += 28;

    // --- METADATOS DE LA RECETA ---
    doc.setFillColor(250, 248, 245); // #FAF8F5
    doc.setDrawColor(221, 213, 199); // #DDD5C7
    doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

    // Nombre de la receta
    doc.setTextColor(28, 30, 33);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(recipe.nombre || 'Receta Sin Título', margin + 5, currentY + 7);

    // Datos secundarios
    doc.setTextColor(100, 110, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    const col1 = margin + 5;
    const col2 = margin + 65;
    const col3 = margin + 125;

    doc.text(`CREADOR / RESPONSABLE: ${recipe.creador || 'Chef / Técnico en Cocina'}`, col1, currentY + 13);
    doc.text(`ESTABLECIMIENTO: ${recipe.establecimiento || 'Cocina Central'}`, col1, currentY + 17);

    doc.text(`BASE PORCIONES: ${recipe.pax} PAX`, col2, currentY + 13);
    doc.text(`FECHA REGISTRO: ${recipe.fecha || 'Fecha actual'}`, col2, currentY + 17);

    doc.text(`TIEMPO PREPARACIÓN: ${recipe.tiempoPreparacion || '45 minutos'}`, col3, currentY + 13);
    doc.text(`TEMP. SERVICIO: ${recipe.temperaturaServicio || '65°C a 70°C'}`, col3, currentY + 17);

    currentY += 24;

    // --- TABLA DE INGREDIENTES (10 COLUMNAS con G.I) ---
    doc.setTextColor(28, 30, 33);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('1. LISTA TÉCNICA DE INGREDIENTES Y COSTEO AL GRAMO', margin, currentY);

    // G.I legend
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(110, 110, 110);
    doc.text(
      'G.I (Grupo de Inventario): F=Fruver | C=Cárnicos | L=Lácteos | E=Economato | S=Suministros',
      margin,
      currentY + 3.5
    );

    currentY += 5;

    const tableRows = calculations.ingredientesCalculados.map((item, idx) => [
      (idx + 1).toString(),
      item.grupoInventario ? item.grupoInventario.toUpperCase() : '-',
      item.ingrediente,
      item.miseEnPlace || '-',
      item.unidad,
      formatQuantity(item.cantidadPorPax),
      formatQuantity(item.cantidadTotal),
      formatCurrency(item.valorUnidadMinima),
      formatCurrency(item.valorPorPax),
      formatCurrency(item.valorTotal),
    ]);

    // Footer row with totals
    const footerRow = [
      '',
      '',
      'COSTO TOTAL DE MATERIA PRIMA',
      '',
      '',
      '',
      '',
      '',
      formatCurrency(calculations.costoMateriaPrimaPorPax),
      formatCurrency(calculations.costoMateriaPrimaTotal),
    ];

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [
        [
          'N°',
          'G.I',
          'INGREDIENTE',
          'MISE EN PLACE',
          'UNIDAD',
          'CANT. X PAX',
          `CANT. TOTAL (${recipe.pax})`,
          'VALOR UNIT.',
          'VALOR X PAX',
          'VALOR TOTAL',
        ],
      ],
      body: tableRows,
      foot: [footerRow],
      theme: 'grid',
      headStyles: {
        fillColor: [36, 42, 36],
        textColor: [240, 235, 225],
        fontSize: 6.5,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 7 },
        1: { halign: 'center', fontStyle: 'bold', cellWidth: 8 },
        2: { halign: 'left', fontStyle: 'bold', cellWidth: 38 },
        3: { halign: 'left', cellWidth: 30 },
        4: { halign: 'center', cellWidth: 13 },
        5: { halign: 'right', cellWidth: 15 },
        6: { halign: 'right', cellWidth: 17 },
        7: { halign: 'right', cellWidth: 18 },
        8: { halign: 'right', cellWidth: 19 },
        9: { halign: 'right', cellWidth: 21 },
      },
      footStyles: {
        fillColor: [240, 236, 228],
        textColor: [28, 30, 33],
        fontStyle: 'bold',
        fontSize: 7,
      },
      bodyStyles: {
        fontSize: 6.8,
        textColor: [30, 30, 30],
        cellPadding: 1.5,
      },
      alternateRowStyles: {
        fillColor: [253, 252, 250],
      },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 6;

    // Check if new page is needed for Financial Summary and Steps
    if (currentY > 210) {
      doc.addPage();
      currentY = 16;
    }

    // --- ESTRUCTURA DE COSTOS Y PRECIOS CERRADOS ---
    doc.setTextColor(28, 30, 33);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('2. ESTRUCTURA DE COSTOS Y PRECIO REAL DE VENTA', margin, currentY);

    currentY += 3;

    // Draw Cost Structure Box (Left 50%)
    const boxWidth = (contentWidth - 6) / 2;
    doc.setFillColor(250, 248, 245);
    doc.setDrawColor(221, 213, 199);
    doc.roundedRect(margin, currentY, boxWidth, 44, 2, 2, 'FD');

    doc.setFontSize(7.2);
    doc.setTextColor(70, 70, 70);
    doc.setFont('helvetica', 'normal');

    let leftTextY = currentY + 5.5;
    const addCostRow = (label: string, value: string, isBold = false) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(isBold ? 20 : 70, isBold ? 20 : 70, isBold ? 20 : 70);
      doc.text(label, margin + 4, leftTextY);
      doc.text(value, margin + boxWidth - 4, leftTextY, { align: 'right' });
      leftTextY += 5.2;
    };

    addCostRow('Costo Materia Prima Total:', formatCurrency(calculations.costoMateriaPrimaTotal));
    addCostRow(`+ Margen de Error (${calculations.margenErrorPorcentaje}%):`, `+${formatCurrency(calculations.valorMargenError)}`);
    addCostRow(`+ Merma de Cocción/Prod. (${calculations.mermaPorcentaje}%):`, formatCurrency(calculations.costoConMerma));
    addCostRow(`Margen de Utilidad Deseado:`, `${100 - calculations.porcentajeCosto}%`);
    addCostRow(`% Food Cost (Costo Materia Prima):`, `${calculations.porcentajeCosto}%`);
    addCostRow(`Precio Base (Costo ÷ % Food Cost):`, formatCurrency(calculations.precioVenta));
    addCostRow(`+ Impoconsumo (${recipe.impoconsumoActivo ? `${recipe.impoconsumoPorcentaje}%` : '0%'}):`, formatCurrency(calculations.valorImpoconsumo));

    // Draw PRECIO REAL DE VENTA Box (Right 50% - High Visual Accent)
    const rightBoxX = margin + boxWidth + 6;
    doc.setFillColor(36, 42, 36); // #242A24
    doc.setDrawColor(140, 122, 91); // #8C7A5B
    doc.setLineWidth(0.6);
    doc.roundedRect(rightBoxX, currentY, boxWidth, 44, 2, 2, 'FD');

    doc.setTextColor(209, 189, 155);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('DOCUMENTO OFICIAL DE VENTA (PRECIOS CERRADOS)', rightBoxX + 4, currentY + 6);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('PRECIO REAL DE VENTA', rightBoxX + 4, currentY + 12);

    // Total Lot Box
    doc.setFillColor(50, 58, 50);
    doc.roundedRect(rightBoxX + 4, currentY + 15, (boxWidth - 12) / 2, 16, 1, 1, 'F');
    doc.setTextColor(209, 189, 155);
    doc.setFontSize(6.5);
    doc.text(`TOTAL ${recipe.pax} PAX:`, rightBoxX + 6, currentY + 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(calculations.precioRealVenta), rightBoxX + 6, currentY + 27);

    // Carta 1 PAX Box (Highlighted)
    const cartaX = rightBoxX + 4 + (boxWidth - 12) / 2 + 4;
    doc.setFillColor(60, 52, 40);
    doc.roundedRect(cartaX, currentY + 15, (boxWidth - 12) / 2, 16, 1, 1, 'F');
    doc.setTextColor(238, 216, 174);
    doc.setFontSize(6.5);
    doc.text('POR 1 PAX (CARTA):', cartaX + 2, currentY + 20);
    doc.setFontSize(11);
    doc.text(formatCurrency(calculations.precioRealVentaPorPax), cartaX + 2, currentY + 27);

    // Redondeo Note below
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text(
      `Redondeo a millar cerrado: 13.100-13.400 -> 13.000 | 13.500-13.900 -> 14.000`,
      rightBoxX + 4,
      currentY + 36
    );

    currentY += 46;

    // --- PASO A PASO DE TÉCNICA APLICADA ---
    if (currentY > 220) {
      doc.addPage();
      currentY = 16;
    }

    doc.setTextColor(28, 30, 33);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('3. PASO A PASO DE TÉCNICA APLICADA (PROCEDIMIENTO CULINARIO)', margin, currentY);

    currentY += 4;

    recipe.pasos.forEach((paso) => {
      // Split description text to fit within column
      const stepNum = `${paso.numero}.`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 122, 91);
      doc.text(stepNum, margin + 2, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(40, 40, 40);

      const splitLines = doc.splitTextToSize(paso.descripcion, contentWidth - 12);
      doc.text(splitLines, margin + 10, currentY);

      currentY += splitLines.length * 3.8 + 2.5;

      // Add page if steps overflow
      if (currentY > 265) {
        doc.addPage();
        currentY = 16;
      }
    });

    // Save and Trigger Automatic Download
    const cleanName = (recipe.nombre || 'receta_estandar')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_');

    doc.save(`${cleanName}_ficha_tecnica.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating native PDF:', error);
    return false;
  }
}
