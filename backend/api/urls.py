from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health),
    path('logs/', views.get_logs),
    path('mappings/', views.get_mappings),
    path('sync/trigger/', views.trigger_sync),
    path('config/test-odoo/', views.test_odoo),
]
