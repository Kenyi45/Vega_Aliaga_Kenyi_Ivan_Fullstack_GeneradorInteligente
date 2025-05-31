from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from .models import CSVFile, Report, SalesData
from .serializers import (
    CSVFileSerializer, CSVFileUploadSerializer, 
    ReportSerializer, ReportSummarySerializer
)
from .services import DataAnalysisService
from .pdf_service import PDFReportService
import os

class CSVFileUploadView(generics.CreateAPIView):
    """
    Vista para subir archivos CSV
    """
    serializer_class = CSVFileUploadSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            csv_file = serializer.save()
            
            # Procesar el archivo automáticamente
            try:
                analysis_service = DataAnalysisService(csv_file)
                report = analysis_service.process_csv()
                
                return Response({
                    'message': 'Archivo subido y procesado exitosamente',
                    'csv_file': CSVFileSerializer(csv_file).data,
                    'report_id': report.id
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                csv_file.status = 'error'
                csv_file.save()
                return Response({
                    'error': f'Error procesando el archivo: {str(e)}',
                    'csv_file': CSVFileSerializer(csv_file).data
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserCSVFilesView(generics.ListAPIView):
    """
    Vista para listar archivos CSV del usuario
    """
    serializer_class = CSVFileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CSVFile.objects.filter(user=self.request.user).order_by('-created_at')

class UserReportsView(generics.ListAPIView):
    """
    Vista para listar informes del usuario
    """
    serializer_class = ReportSummarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Report.objects.filter(
            csv_file__user=self.request.user
        ).order_by('-created_at')

class ReportDetailView(generics.RetrieveAPIView):
    """
    Vista para obtener los detalles de un informe específico
    """
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Report.objects.filter(csv_file__user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reprocess_csv_view(request, csv_file_id):
    """
    Reprocesar un archivo CSV específico
    """
    try:
        csv_file = get_object_or_404(CSVFile, id=csv_file_id, user=request.user)
        
        # Verificar que el archivo existe
        if not csv_file.file or not os.path.exists(csv_file.file.path):
            return Response({
                'error': 'El archivo no existe en el servidor'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Procesar el archivo
        analysis_service = DataAnalysisService(csv_file)
        report = analysis_service.process_csv()
        
        return Response({
            'message': 'Archivo reprocesado exitosamente',
            'report': ReportSerializer(report, context={'request': request}).data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error reprocesando el archivo: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_pdf_view(request, report_id):
    """
    Generar PDF para un informe específico
    """
    try:
        report = get_object_or_404(Report, id=report_id, csv_file__user=request.user)
        
        # Generar el PDF
        pdf_service = PDFReportService(report)
        pdf_file = pdf_service.generate_pdf()
        
        return Response({
            'message': 'PDF generado exitosamente',
            'pdf_url': request.build_absolute_uri(pdf_file.url)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error generando PDF: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_pdf_view(request, report_id):
    """
    Descargar PDF de un informe
    """
    try:
        report = get_object_or_404(Report, id=report_id, csv_file__user=request.user)
        
        if not report.pdf_file:
            # Si no existe, generarlo automáticamente
            pdf_service = PDFReportService(report)
            pdf_file = pdf_service.generate_pdf()
        
        # Servir el archivo
        if report.pdf_file and os.path.exists(report.pdf_file.path):
            with open(report.pdf_file.path, 'rb') as pdf:
                response = HttpResponse(pdf.read(), content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="{report.pdf_file.name}"'
                return response
        else:
            raise Http404("Archivo PDF no encontrado")
            
    except Exception as e:
        return Response({
            'error': f'Error descargando PDF: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary_view(request):
    """
    Vista para obtener resumen del dashboard del usuario
    """
    user_csv_files = CSVFile.objects.filter(user=request.user)
    user_reports = Report.objects.filter(csv_file__user=request.user)
    
    # Estadísticas generales
    total_files = user_csv_files.count()
    total_reports = user_reports.count()
    completed_files = user_csv_files.filter(status='completed').count()
    processing_files = user_csv_files.filter(status='processing').count()
    error_files = user_csv_files.filter(status='error').count()
    
    # Últimos informes
    recent_reports = user_reports.order_by('-created_at')[:5]
    
    # Calcular totales
    total_sales = sum(report.total_sales or 0 for report in user_reports)
    total_records = sum(report.total_records or 0 for report in user_reports)
    
    return Response({
        'statistics': {
            'total_files': total_files,
            'total_reports': total_reports,
            'completed_files': completed_files,
            'processing_files': processing_files,
            'error_files': error_files,
            'total_sales': float(total_sales),
            'total_records': total_records
        },
        'recent_reports': ReportSummarySerializer(recent_reports, many=True).data
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_csv_file_view(request, csv_file_id):
    """
    Eliminar archivo CSV y su informe asociado
    """
    try:
        csv_file = get_object_or_404(CSVFile, id=csv_file_id, user=request.user)
        
        # Eliminar archivos físicos
        if csv_file.file and os.path.exists(csv_file.file.path):
            os.remove(csv_file.file.path)
        
        # Si tiene informe con PDF, eliminarlo también
        try:
            report = csv_file.report
            if report.pdf_file and os.path.exists(report.pdf_file.path):
                os.remove(report.pdf_file.path)
        except Report.DoesNotExist:
            pass
        
        # Eliminar de la base de datos (cascada eliminará el informe)
        csv_file.delete()
        
        return Response({
            'message': 'Archivo eliminado exitosamente'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error eliminando archivo: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST) 