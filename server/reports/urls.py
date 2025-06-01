from django.urls import path
from . import views

urlpatterns = [
    # Upload de archivos CSV
    path('upload/', views.CSVFileUploadView.as_view(), name='csv-upload'),
    
    # Gestión de archivos CSV
    path('csv-files/', views.UserCSVFilesView.as_view(), name='user-csv-files'),
    path('csv-files/<int:csv_file_id>/reprocess/', views.reprocess_csv_view, name='reprocess-csv'),
    path('csv-files/<int:csv_file_id>/delete/', views.delete_csv_file_view, name='delete-csv'),
    
    # Informes
    path('reports/', views.UserReportsView.as_view(), name='user-reports'),
    path('reports/<int:pk>/', views.ReportDetailView.as_view(), name='report-detail'),
    
    # PDF
    path('reports/<int:report_id>/generate-pdf/', views.generate_pdf_view, name='generate-pdf'),
    path('reports/<int:report_id>/regenerate-pdf/', views.regenerate_pdf_view, name='regenerate-pdf'),
    path('reports/<int:report_id>/download-pdf/', views.download_pdf_view, name='download-pdf'),
    
    # Dashboard
    path('dashboard/', views.dashboard_summary_view, name='dashboard-summary'),
] 