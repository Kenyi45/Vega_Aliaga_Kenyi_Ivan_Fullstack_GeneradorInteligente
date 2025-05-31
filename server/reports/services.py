import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from decimal import Decimal
from django.core.files.base import ContentFile
from .models import CSVFile, Report, SalesData
import os
import json

class DataAnalysisService:
    """
    Servicio para analizar datos de ventas de archivos CSV
    """
    
    def __init__(self, csv_file):
        self.csv_file = csv_file
        self.df = None
        
    def process_csv(self):
        """
        Procesa el archivo CSV y crea el informe
        """
        try:
            # Actualizar estado a procesando
            self.csv_file.status = 'processing'
            self.csv_file.save()
            
            # Leer el archivo CSV
            self.df = pd.read_csv(self.csv_file.file.path)
            
            # Limpiar y normalizar datos
            self._clean_data()
            
            # Crear o obtener el informe
            report, created = Report.objects.get_or_create(csv_file=self.csv_file)
            
            # Realizar análisis
            self._analyze_sales_data(report)
            
            # Guardar datos individuales
            self._save_sales_data(report)
            
            # Generar insights automáticos
            self._generate_insights(report)
            
            # Actualizar estado a completado
            self.csv_file.status = 'completed'
            self.csv_file.save()
            
            return report
            
        except Exception as e:
            self.csv_file.status = 'error'
            self.csv_file.save()
            raise e
    
    def _clean_data(self):
        """
        Limpia y normaliza los datos del DataFrame
        """
        # Convertir nombres de columnas a minúsculas y quitar espacios
        self.df.columns = self.df.columns.str.lower().str.strip()
        
        # Mapear posibles nombres de columnas
        column_mapping = {
            'fecha': 'date',
            'producto': 'product',
            'categoría': 'category',
            'categoria': 'category',
            'región': 'region',
            'region': 'region',
            'ventas': 'sales_amount',
            'venta': 'sales_amount',
            'monto': 'sales_amount',
            'cantidad': 'quantity',
            'qty': 'quantity'
        }
        
        self.df.rename(columns=column_mapping, inplace=True)
        
        # Asegurar que las columnas necesarias existan
        required_columns = ['date', 'product', 'sales_amount']
        for col in required_columns:
            if col not in self.df.columns:
                raise ValueError(f"Columna requerida '{col}' no encontrada en el CSV")
        
        # Convertir fecha
        self.df['date'] = pd.to_datetime(self.df['date'], errors='coerce')
        
        # Convertir monto de ventas
        self.df['sales_amount'] = pd.to_numeric(self.df['sales_amount'], errors='coerce')
        
        # Manejar cantidad si no existe
        if 'quantity' not in self.df.columns:
            self.df['quantity'] = 1
        else:
            self.df['quantity'] = pd.to_numeric(self.df['quantity'], errors='coerce').fillna(1)
        
        # Eliminar filas con datos faltantes críticos
        self.df.dropna(subset=['date', 'product', 'sales_amount'], inplace=True)
        
        # Rellenar valores faltantes opcionales
        self.df['category'].fillna('Sin Categoría', inplace=True)
        self.df['region'].fillna('Sin Región', inplace=True)
    
    def _analyze_sales_data(self, report):
        """
        Realiza el análisis de los datos de ventas
        """
        # Métricas básicas
        report.total_sales = Decimal(str(self.df['sales_amount'].sum()))
        report.total_records = len(self.df)
        report.date_range_start = self.df['date'].min().date()
        report.date_range_end = self.df['date'].max().date()
        
        # Top productos
        top_products = self.df.groupby('product')['sales_amount'].sum().sort_values(ascending=False).head(10)
        report.top_products = {
            'labels': top_products.index.tolist(),
            'data': top_products.values.tolist()
        }
        
        # Ventas por región
        if 'region' in self.df.columns:
            sales_by_region = self.df.groupby('region')['sales_amount'].sum()
            report.sales_by_region = {
                'labels': sales_by_region.index.tolist(),
                'data': sales_by_region.values.tolist()
            }
        
        # Ventas por fecha (agrupado por mes)
        self.df['year_month'] = self.df['date'].dt.to_period('M')
        monthly_sales = self.df.groupby('year_month')['sales_amount'].sum()
        report.sales_by_date = {
            'labels': [str(period) for period in monthly_sales.index],
            'data': monthly_sales.values.tolist()
        }
        
        # Tendencias mensuales
        monthly_trends_data = []
        for i, (period, sales) in enumerate(monthly_sales.items()):
            if i > 0:
                prev_sales = monthly_sales.iloc[i-1]
                growth = ((sales - prev_sales) / prev_sales) * 100 if prev_sales > 0 else 0
            else:
                growth = 0
            
            monthly_trends_data.append({
                'month': str(period),
                'sales': float(sales),
                'growth': round(growth, 2)
            })
        
        report.monthly_trends = monthly_trends_data
        
        report.save()
    
    def _save_sales_data(self, report):
        """
        Guarda los datos individuales de ventas
        """
        # Eliminar datos existentes
        SalesData.objects.filter(report=report).delete()
        
        # Crear nuevos registros
        sales_data_objects = []
        for _, row in self.df.iterrows():
            additional_data = {}
            
            # Agregar columnas adicionales que no son campos estándar
            for col in self.df.columns:
                if col not in ['date', 'product', 'category', 'region', 'sales_amount', 'quantity', 'year_month']:
                    additional_data[col] = str(row[col]) if pd.notna(row[col]) else None
            
            sales_data = SalesData(
                report=report,
                date=row['date'].date(),
                product=row['product'],
                category=row.get('category', 'Sin Categoría'),
                region=row.get('region', 'Sin Región'),
                sales_amount=Decimal(str(row['sales_amount'])),
                quantity=int(row['quantity']),
                additional_data=additional_data
            )
            sales_data_objects.append(sales_data)
        
        # Crear en lotes para mejor rendimiento
        SalesData.objects.bulk_create(sales_data_objects, batch_size=1000)
    
    def _generate_insights(self, report):
        """
        Genera insights automáticos basados en el análisis
        """
        insights = []
        
        # Insight sobre ventas totales
        insights.append(f"Las ventas totales ascienden a ${report.total_sales:,.2f} con {report.total_records} registros.")
        
        # Insight sobre producto top
        if report.top_products and report.top_products['data']:
            top_product = report.top_products['labels'][0]
            top_sales = report.top_products['data'][0]
            insights.append(f"El producto más vendido es '{top_product}' con ventas de ${top_sales:,.2f}.")
        
        # Insight sobre tendencias mensuales
        if len(report.monthly_trends) >= 2:
            last_month = report.monthly_trends[-1]
            prev_month = report.monthly_trends[-2]
            
            if last_month['growth'] > 10:
                insights.append(f"¡Excelente crecimiento! Las ventas aumentaron {last_month['growth']:.1f}% en {last_month['month']}.")
            elif last_month['growth'] < -10:
                insights.append(f"Atención: Las ventas disminuyeron {abs(last_month['growth']):.1f}% en {last_month['month']}.")
            else:
                insights.append(f"Las ventas se mantuvieron estables en {last_month['month']} con un cambio de {last_month['growth']:.1f}%.")
        
        # Insight sobre diversificación de productos
        num_products = len(report.top_products['labels']) if report.top_products else 0
        if num_products > 0:
            insights.append(f"El portafolio incluye {num_products} productos diferentes en el top 10.")
        
        # Insight sobre regiones
        if report.sales_by_region:
            num_regions = len(report.sales_by_region['labels'])
            if num_regions > 1:
                top_region = report.sales_by_region['labels'][0]
                insights.append(f"Las operaciones abarcan {num_regions} regiones, siendo '{top_region}' la más exitosa.")
        
        report.auto_insights = '\n'.join(insights)
        report.save() 