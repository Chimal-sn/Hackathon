from django.urls import path
from . import views

urlpatterns = [
    path('', views.clientes, name='clientes'),
    path('analizar_cliente/<int:id>/', views.analizar_cliente),
]
