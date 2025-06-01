#!/usr/bin/env python
"""
Script para limpiar todos los PDFs existentes y forzar regeneración con formato de soles
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from reports.models import Report

def clear_all_pdfs():
    """
    Limpia todos los PDFs existentes para forzar regeneración
    """
    print("🔄 Iniciando limpieza de PDFs existentes...")
    
    reports_with_pdf = Report.objects.filter(pdf_file__isnull=False)
    count = reports_with_pdf.count()
    
    if count == 0:
        print("✅ No hay PDFs para limpiar.")
        return
    
    print(f"📄 Encontrados {count} PDFs para limpiar...")
    
    cleaned_count = 0
    for report in reports_with_pdf:
        try:
            # Eliminar archivo físico si existe
            if report.pdf_file and os.path.exists(report.pdf_file.path):
                os.remove(report.pdf_file.path)
                print(f"  🗑️  Eliminado: {report.pdf_file.name}")
            
            # Limpiar referencia en la base de datos
            report.pdf_file.delete(save=False)
            report.pdf_file = None
            report.save()
            
            cleaned_count += 1
            
        except Exception as e:
            print(f"  ❌ Error limpiando PDF del informe {report.id}: {e}")
    
    print(f"✅ Limpieza completada: {cleaned_count}/{count} PDFs eliminados.")
    print("💰 Los próximos PDFs generados usarán formato de soles (S/) automáticamente.")

if __name__ == "__main__":
    clear_all_pdfs() 