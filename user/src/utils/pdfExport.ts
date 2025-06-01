import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DashboardStatistics } from '../types/dashboard';
import { formatCurrency } from './formatters';

export interface ExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

export const exportDashboardToPDF = async (
  elementId: string = 'dashboard-content',
  options: ExportOptions = {}
) => {
  const {
    filename = `dashboard-${new Date().toISOString().split('T')[0]}.pdf`,
    quality = 0.95,
    scale = 2
  } = options;

  try {
    // Mostrar loading
    const loadingToast = document.createElement('div');
    loadingToast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #3b82f6;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
    `;
    loadingToast.textContent = '📄 Generando PDF del dashboard...';
    document.body.appendChild(loadingToast);

    // Buscar el elemento del dashboard
    const dashboardElement = document.getElementById(elementId);
    if (!dashboardElement) {
      throw new Error(`No se encontró el elemento con ID: ${elementId}`);
    }

    // Configurar opciones para html2canvas
    const canvas = await html2canvas(dashboardElement, {
      allowTaint: true,
      useCORS: true,
      scale: scale,
      scrollX: 0,
      scrollY: 0,
      width: dashboardElement.scrollWidth,
      height: dashboardElement.scrollHeight,
      backgroundColor: '#f9fafb'
    });

    // Crear el PDF
    const imgData = canvas.toDataURL('image/png', quality);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calcular dimensiones
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calcular la escala para que la imagen quepa en la página
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;

    // Centrar la imagen en la página
    const x = (pdfWidth - finalWidth) / 2;
    const y = 10; // Margen superior

    // Agregar encabezado
    pdf.setFontSize(20);
    pdf.setTextColor(55, 65, 81); // text-gray-700
    pdf.text('📊 Dashboard - IntelliReport', 20, 20);
    
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // text-gray-500
    pdf.text(`Generado el: ${new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, 30);

    // Si la imagen es muy alta, dividirla en páginas
    let remainingHeight = finalHeight;
    let sourceY = 0;
    let pageNumber = 1;

    while (remainingHeight > 0) {
      const pageHeight = pdfHeight - 40; // Espacio para encabezados
      const currentPageHeight = Math.min(remainingHeight, pageHeight);
      
      if (pageNumber > 1) {
        pdf.addPage();
        // Agregar encabezado en páginas adicionales
        pdf.setFontSize(16);
        pdf.setTextColor(55, 65, 81);
        pdf.text('📊 Dashboard - IntelliReport (cont.)', 20, 20);
      }

      // Crear un canvas temporal para la sección actual
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imgWidth;
      tempCanvas.height = (currentPageHeight / ratio);
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        tempCtx.drawImage(
          canvas,
          0, sourceY / ratio,
          imgWidth, tempCanvas.height,
          0, 0,
          imgWidth, tempCanvas.height
        );
        
        const tempImgData = tempCanvas.toDataURL('image/png', quality);
        pdf.addImage(tempImgData, 'PNG', x, pageNumber === 1 ? 35 : 25, finalWidth, currentPageHeight);
      }

      remainingHeight -= currentPageHeight;
      sourceY += currentPageHeight;
      pageNumber++;
    }

    // Agregar pie de página
    const totalPages = pageNumber - 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i > 1) {
        pdf.setPage(i);
      }
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175); // text-gray-400
      pdf.text(
        `Página ${i} de ${totalPages} | IntelliReport`,
        pdfWidth - 60,
        pdfHeight - 10
      );
    }

    // Guardar el PDF
    pdf.save(filename);

    // Remover loading toast
    document.body.removeChild(loadingToast);

    // Mostrar success toast
    const successToast = document.createElement('div');
    successToast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
    `;
    successToast.textContent = '✅ PDF generado exitosamente!';
    document.body.appendChild(successToast);

    setTimeout(() => {
      if (document.body.contains(successToast)) {
        document.body.removeChild(successToast);
      }
    }, 3000);

    return true;

  } catch (error) {
    console.error('Error al generar PDF:', error);
    
    // Remover loading toast si existe
    const existingToast = document.querySelector('[style*="Generando PDF"]');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }

    // Mostrar error toast
    const errorToast = document.createElement('div');
    errorToast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc2626;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
    `;
    errorToast.textContent = '❌ Error al generar PDF. Inténtalo de nuevo.';
    document.body.appendChild(errorToast);

    setTimeout(() => {
      if (document.body.contains(errorToast)) {
        document.body.removeChild(errorToast);
      }
    }, 5000);

    return false;
  }
};

// Función específica para exportar estadísticas rápidas
export const exportQuickStats = async (stats: DashboardStatistics) => {
  const pdf = new jsPDF();
  
  // Encabezado
  pdf.setFontSize(24);
  pdf.setTextColor(55, 65, 81);
  pdf.text('📊 Resumen Ejecutivo', 20, 30);
  
  pdf.setFontSize(12);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 40);
  
  // Estadísticas
  let yPosition = 60;
  
  pdf.setFontSize(16);
  pdf.setTextColor(55, 65, 81);
  pdf.text('📈 Métricas Principales', 20, yPosition);
  
  yPosition += 20;
  pdf.setFontSize(12);
  pdf.setTextColor(31, 41, 55);
  
  const metrics = [
    { label: '💰 Total de Ventas', value: formatCurrency(stats.total_sales || 0) },
    { label: '📁 Archivos Procesados', value: `${stats.total_files || 0}` },
    { label: '📊 Informes Generados', value: `${stats.total_reports || 0}` },
    { label: '📋 Registros Analizados', value: `${stats.total_records?.toLocaleString() || '0'}` },
    { label: '💡 Promedio por Venta', value: formatCurrency(stats.total_records > 0 ? ((stats.total_sales || 0) / stats.total_records) : 0) }
  ];

  metrics.forEach((metric) => {
    pdf.text(`${metric.label}: ${metric.value}`, 30, yPosition);
    yPosition += 15;
  });

  // Guardar
  const filename = `resumen-ejecutivo-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
  
  return true;
}; 