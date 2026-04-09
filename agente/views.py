from django.shortcuts import render, redirect
from django.http import HttpResponse

# Create your views here.
def home(request):
    return HttpResponse("<h1>¡Agente funcionando!</h1>")

from .models import Cliente
from .forms import ClienteForm

def clientes(request):
    # Si la página recibe datos de un formulario (POST)
    if request.method == 'POST':
        form = ClienteForm(request.POST) 
        if form.is_valid():
            form.save() # ¡Guardar en BD!
            return redirect('clientes') # Recargar la página limpia
    else:
        # Si la carga normal, crear un formulario vacío
        form = ClienteForm()

    # Traer la lista actualizada de clientes
    lista_clientes = Cliente.objects.all()
    
    contexto = {
        'clientes': lista_clientes,
        'form': form
    }
    
    return render(request, 'clientes.html', contexto)

