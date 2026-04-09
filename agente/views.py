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



from django.http import JsonResponse
from .models import Cliente
from google import genai
import json

def analizar_cliente(request, id):
    try:
        cliente = Cliente.objects.get(id=id)

        client = genai.Client(api_key="TU_API_KEY")

        prompt = f"""
        Cliente:
        Nombre: {cliente.nombre}
        NPS: {cliente.nps}
        Quejas: {cliente.num_quejas}

        Responde en JSON:
        {{
            "riesgo": "alto|medio|bajo",
            "explicacion": "...",
            "acciones": "..."
        }}
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )

        texto = response.text

        return JsonResponse({
            "analisis": texto,
            "estrategia": texto
        })

    except Exception as e:
        print("ERROR IA:", e)

        # 🔥 RESPUESTA CONTROLADA (NO truena frontend)
        return JsonResponse({
            "analisis": "⚠️ IA no disponible (límite alcanzado)",
            "estrategia": "Intenta más tarde o usa modo manual"
        })