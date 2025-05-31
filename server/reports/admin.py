from django.contrib import admin
from .models import CSVFile, Report, SalesData

@admin.register(CSVFile)
class CSVFileAdmin(admin.ModelAdmin):
    """
    Administrador para archivos CSV
    """
    list_display = ('original_name', 'user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('original_name', 'user__email', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    """
    Administrador para informes
    """
    list_display = ('csv_file', 'total_sales', 'total_records', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('csv_file__original_name', 'csv_file__user__email')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('csv_file',)
        }),
        ('Métricas', {
            'fields': ('total_sales', 'total_records', 'date_range_start', 'date_range_end')
        }),
        ('Análisis', {
            'fields': ('top_products', 'sales_by_region', 'sales_by_date', 'monthly_trends'),
            'classes': ('collapse',)
        }),
        ('Insights', {
            'fields': ('auto_insights',)
        }),
        ('Archivos', {
            'fields': ('pdf_file',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(SalesData)
class SalesDataAdmin(admin.ModelAdmin):
    """
    Administrador para datos de ventas
    """
    list_display = ('product', 'date', 'sales_amount', 'region', 'category')
    list_filter = ('date', 'region', 'category')
    search_fields = ('product', 'region', 'category')
    ordering = ('-date',)
    
    fieldsets = (
        ('Información del Producto', {
            'fields': ('product', 'category', 'quantity')
        }),
        ('Información de Venta', {
            'fields': ('date', 'sales_amount', 'region')
        }),
        ('Datos Adicionales', {
            'fields': ('additional_data',),
            'classes': ('collapse',)
        }),
    ) 