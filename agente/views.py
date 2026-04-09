from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def home(request):
    return HttpResponse("<h1>¡Agente funcionando!</h1>")

from .models import Cliente

def clientes(request):
    lista_clientes = Cliente.objects.all()
    
    contexto = {
        'clientes': lista_clientes
    }
    
    return render(request, 'clientes.html', contexto)

