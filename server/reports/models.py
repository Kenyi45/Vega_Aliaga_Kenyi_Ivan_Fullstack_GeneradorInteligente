from django.db import models
from django.conf import settings
import os

def upload_to(instance, filename):
    """Función para organizar la subida de archivos"""
    return f'csv_files/{instance.user.id}/{filename}'

class CSVFile(models.Model):
    """
    Modelo para almacenar archivos CSV subidos por los usuarios
    """
    STATUS_CHOICES = [
        ('uploaded', 'Subido'),
        ('processing', 'Procesando'),
        ('completed', 'Completado'),
        ('error', 'Error'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='csv_files')
    file = models.FileField(upload_to=upload_to)
    original_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploaded')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.original_name} - {self.user.email}"
    
    class Meta:
        verbose_name = "Archivo CSV"
        verbose_name_plural = "Archivos CSV"

class Report(models.Model):
    """
    Modelo para almacenar informes generados
    """
    csv_file = models.OneToOneField(CSVFile, on_delete=models.CASCADE, related_name='report')
    
    # Métricas calculadas
    total_sales = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    total_records = models.IntegerField(null=True, blank=True)
    date_range_start = models.DateField(null=True, blank=True)
    date_range_end = models.DateField(null=True, blank=True)
    
    # Datos analizados (JSON)
    top_products = models.JSONField(default=dict, blank=True)
    sales_by_region = models.JSONField(default=dict, blank=True)
    sales_by_date = models.JSONField(default=dict, blank=True)
    monthly_trends = models.JSONField(default=dict, blank=True)
    
    # Insights automáticos
    auto_insights = models.TextField(blank=True)
    
    # Archivo PDF generado
    pdf_file = models.FileField(upload_to='reports/pdf/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Informe - {self.csv_file.original_name}"
    
    class Meta:
        verbose_name = "Informe"
        verbose_name_plural = "Informes"

class SalesData(models.Model):
    """
    Modelo para almacenar datos individuales de ventas procesados
    """
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='sales_data')
    
    # Campos comunes de datos de ventas
    date = models.DateField()
    product = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    sales_amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    
    # Campos adicionales (flexibles)
    additional_data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.product} - {self.date} - ${self.sales_amount}"
    
    class Meta:
        verbose_name = "Dato de Venta"
        verbose_name_plural = "Datos de Ventas" 