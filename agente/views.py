from django.shortcuts import render, redirect
from django.http import HttpResponse



from .models import Cliente
from .forms import ClienteForm

def clientes(request):
    if request.method == 'POST':
        form = ClienteForm(request.POST) 
        if form.is_valid():
            form.save()
            return redirect('clientes')
    else:
        form = ClienteForm()

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
import re
import os

def analizar_cliente(request, id):
    try:
        cliente = Cliente.objects.get(id=id)

        api_key = os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)


        prompt = f"""
Eres un sistema de análisis de clientes.

RESPONDE SOLO EN JSON:

{{
  "riesgo": "alto|medio|bajo",
  "explicacion": "máximo 2 líneas",
  "acciones": "máximo 3 acciones"
}}

Cliente:
Nombre: {cliente.nombre}
NPS: {cliente.nps}
Quejas: {cliente.num_quejas}
Comentario: {cliente.comentario}
"""

        response = client.models.generate_content(
            model="gemma-4-26b-a4b-it",
            contents=prompt
        )

        texto = response.text

        # 🔥 LIMPIAR ```json
        limpio = re.sub(r"```json|```", "", texto).strip()

        data = json.loads(limpio)

        # 🔥 GUARDAR EN BD (AQUÍ ESTÁ LA CLAVE)
        cliente.analisis_ia = data["explicacion"]
        cliente.estrategia_ia = data["acciones"]

        # si tienes campo riesgo_nivel
        if hasattr(cliente, "riesgo_nivel"):
            cliente.riesgo_nivel = data["riesgo"]

        cliente.save()

        # 🔥 RESPUESTA LIMPIA (YA NO STRING)
        return JsonResponse({
            "analisis": data["explicacion"],
            "estrategia": data["acciones"],
            "riesgo": data["riesgo"]
        })

    except Exception as e:
        print("ERROR IA:", e)

        return JsonResponse({
            "analisis": "❌ Error con IA",
            "estrategia": "Intenta de nuevo"
        }, status=500)
    
    