from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.lib.utils import ImageReader
from io import BytesIO
import matplotlib.pyplot as plt
import seaborn as sns
from django.core.files.base import ContentFile
import os
from datetime import datetime

class PDFReportService:
    """
    Servicio para generar informes PDF a partir de los datos analizados
    """
    
    def __init__(self, report):
        self.report = report
        self.styles = getSampleStyleSheet()
        self.story = []
        
        # Configurar estilos personalizados
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor('#1f2937'),
            alignment=1  # Centrado
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            textColor=colors.HexColor('#374151')
        )
        
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=12
        )
    
    def format_currency(self, amount):
        """
        Formatea un monto como moneda en soles peruanos
        """
        try:
            if amount is None:
                return "S/ 0.00"
            # Formatear número con separadores de miles y símbolo de soles
            return f"S/ {float(amount):,.2f}"
        except (ValueError, TypeError):
            return "S/ 0.00"
    
    def generate_pdf(self):
        """
        Genera el informe PDF completo
        """
        # Crear el documento PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        # Construir el contenido
        self._build_title()
        self._build_summary()
        self._build_metrics_section()
        self._build_charts_section()
        self._build_insights_section()
        self._build_data_table()
        
        # Construir el PDF
        doc.build(self.story)
        
        # Guardar el archivo
        pdf_content = buffer.getvalue()
        buffer.close()
        
        # Crear el nombre del archivo
        filename = f"informe_{self.report.csv_file.original_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        # Guardar en el modelo
        self.report.pdf_file.save(
            filename,
            ContentFile(pdf_content),
            save=True
        )
        
        return self.report.pdf_file
    
    def _build_title(self):
        """
        Construye la sección del título
        """
        title = Paragraph("Informe de Análisis de Ventas", self.title_style)
        self.story.append(title)
        self.story.append(Spacer(1, 12))
        
        # Información del archivo
        file_info = f"""
        <b>Archivo:</b> {self.report.csv_file.original_name}<br/>
        <b>Fecha de generación:</b> {datetime.now().strftime('%d/%m/%Y %H:%M')}<br/>
        <b>Período analizado:</b> {self.report.date_range_start.strftime('%d/%m/%Y')} - {self.report.date_range_end.strftime('%d/%m/%Y')}
        """
        info_para = Paragraph(file_info, self.normal_style)
        self.story.append(info_para)
        self.story.append(Spacer(1, 20))
    
    def _build_summary(self):
        """
        Construye la sección de resumen ejecutivo
        """
        heading = Paragraph("Resumen Ejecutivo", self.heading_style)
        self.story.append(heading)
        
        summary_data = [
            ['Métrica', 'Valor'],
            ['Ventas Totales', self.format_currency(self.report.total_sales)],
            ['Total de Registros', f"{self.report.total_records:,}"],
            ['Productos Únicos', f"{len(self.report.top_products.get('labels', []))}"],
            ['Regiones', f"{len(self.report.sales_by_region.get('labels', []))}"]
        ]
        
        table = Table(summary_data, colWidths=[3*inch, 2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        self.story.append(table)
        self.story.append(Spacer(1, 20))
    
    def _build_metrics_section(self):
        """
        Construye la sección de métricas clave
        """
        heading = Paragraph("Métricas Clave", self.heading_style)
        self.story.append(heading)
        
        # Top 5 productos
        if self.report.top_products and self.report.top_products.get('labels'):
            sub_heading = Paragraph("Top 5 Productos por Ventas", self.normal_style)
            self.story.append(sub_heading)
            
            top_5_data = [['Producto', 'Ventas']]
            labels = self.report.top_products['labels'][:5]
            data = self.report.top_products['data'][:5]
            
            for label, value in zip(labels, data):
                top_5_data.append([label, self.format_currency(value)])
            
            table = Table(top_5_data, colWidths=[3*inch, 2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            self.story.append(table)
            self.story.append(Spacer(1, 15))
    
    def _build_charts_section(self):
        """
        Construye la sección de gráficos
        """
        heading = Paragraph("Análisis Visual", self.heading_style)
        self.story.append(heading)
        
        # Generar gráfico de tendencias mensuales
        if self.report.monthly_trends:
            chart_img = self._create_monthly_trends_chart()
            if chart_img:
                self.story.append(chart_img)
                self.story.append(Spacer(1, 15))
        
        # Generar gráfico de productos top
        if self.report.top_products and self.report.top_products.get('data'):
            chart_img = self._create_top_products_chart()
            if chart_img:
                self.story.append(chart_img)
                self.story.append(Spacer(1, 15))
    
    def _create_monthly_trends_chart(self):
        """
        Crea gráfico de tendencias mensuales usando matplotlib
        """
        try:
            plt.figure(figsize=(10, 6))
            
            months = [item['month'] for item in self.report.monthly_trends]
            sales = [item['sales'] for item in self.report.monthly_trends]
            
            plt.plot(months, sales, marker='o', linewidth=2, markersize=8)
            plt.title('Tendencia de Ventas Mensuales', fontsize=16, fontweight='bold')
            plt.xlabel('Mes', fontsize=12)
            plt.ylabel('Ventas (S/)', fontsize=12)
            plt.xticks(rotation=45)
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
            
            # Guardar en buffer
            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
            buffer.seek(0)
            plt.close()
            
            # Crear imagen para ReportLab
            img = Image(buffer, width=6*inch, height=3.6*inch)
            return img
            
        except Exception as e:
            print(f"Error creando gráfico de tendencias: {e}")
            return None
    
    def _create_top_products_chart(self):
        """
        Crea gráfico de barras de productos top
        """
        try:
            plt.figure(figsize=(10, 6))
            
            labels = self.report.top_products['labels'][:8]  # Top 8
            data = self.report.top_products['data'][:8]
            
            bars = plt.bar(range(len(labels)), data, color='#3b82f6', alpha=0.8)
            plt.title('Top 8 Productos por Ventas', fontsize=16, fontweight='bold')
            plt.xlabel('Productos', fontsize=12)
            plt.ylabel('Ventas (S/)', fontsize=12)
            plt.xticks(range(len(labels)), labels, rotation=45, ha='right')
            
            # Agregar valores en las barras
            for bar, value in zip(bars, data):
                plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(data)*0.01,
                        self.format_currency(value), ha='center', va='bottom', fontsize=9)
            
            plt.tight_layout()
            
            # Guardar en buffer
            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
            buffer.seek(0)
            plt.close()
            
            # Crear imagen para ReportLab
            img = Image(buffer, width=6*inch, height=3.6*inch)
            return img
            
        except Exception as e:
            print(f"Error creando gráfico de productos: {e}")
            return None
    
    def _build_insights_section(self):
        """
        Construye la sección de insights automáticos
        """
        heading = Paragraph("Insights Automáticos", self.heading_style)
        self.story.append(heading)
        
        insights_text = self.report.auto_insights.replace('\n', '<br/>')
        insights_para = Paragraph(insights_text, self.normal_style)
        self.story.append(insights_para)
        self.story.append(Spacer(1, 20))
    
    def _build_data_table(self):
        """
        Construye una tabla con una muestra de los datos
        """
        heading = Paragraph("Muestra de Datos", self.heading_style)
        self.story.append(heading)
        
        # Obtener una muestra de los datos
        sample_data = self.report.sales_data.all()[:10]
        
        if sample_data:
            table_data = [['Fecha', 'Producto', 'Categoría', 'Región', 'Ventas']]
            
            for data in sample_data:
                table_data.append([
                    data.date.strftime('%d/%m/%Y'),
                    data.product[:30] + '...' if len(data.product) > 30 else data.product,
                    data.category[:20] + '...' if len(data.category) > 20 else data.category,
                    data.region,
                    self.format_currency(data.sales_amount)
                ])
            
            table = Table(table_data, colWidths=[1*inch, 2.5*inch, 1.5*inch, 1*inch, 1*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366f1')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 1), (-1, -1), 9)
            ]))
            
            self.story.append(table)
            
            note = Paragraph("<i>Nota: Se muestran solo los primeros 10 registros como muestra.</i>", self.normal_style)
            self.story.append(Spacer(1, 10))
            self.story.append(note) 