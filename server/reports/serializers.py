from rest_framework import serializers
from .models import CSVFile, Report, SalesData
import os

class CSVFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVFile
        fields = ['id', 'original_name', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

class CSVFileUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField()
    
    class Meta:
        model = CSVFile
        fields = ['file']
    
    def validate_file(self, value):
        """
        Validar que el archivo sea un CSV válido
        """
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError("Solo se permiten archivos CSV (.csv)")
        
        if value.size > 50 * 1024 * 1024:  # 50MB
            raise serializers.ValidationError("El archivo es demasiado grande. Máximo 50MB permitido.")
        
        return value
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['original_name'] = validated_data['file'].name
        return super().create(validated_data)

class SalesDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesData
        fields = ['id', 'date', 'product', 'category', 'region', 'sales_amount', 'quantity', 'additional_data']

class ReportSerializer(serializers.ModelSerializer):
    csv_file = CSVFileSerializer(read_only=True)
    sales_data_sample = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id', 'csv_file', 'total_sales', 'total_records', 
            'date_range_start', 'date_range_end', 'top_products', 
            'sales_by_region', 'sales_by_date', 'monthly_trends',
            'auto_insights', 'created_at', 'updated_at', 
            'sales_data_sample', 'pdf_url'
        ]
    
    def get_sales_data_sample(self, obj):
        """
        Obtener una muestra de los datos de ventas para el dashboard
        """
        sample = obj.sales_data.all()[:20]  # Primeros 20 registros
        return SalesDataSerializer(sample, many=True).data
    
    def get_pdf_url(self, obj):
        """
        Obtener la URL del archivo PDF si existe
        """
        if obj.pdf_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.pdf_file.url)
        return None

class ReportSummarySerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de informes
    """
    csv_file = CSVFileSerializer(read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id', 'csv_file', 'total_sales', 'total_records',
            'date_range_start', 'date_range_end', 'created_at'
        ] 