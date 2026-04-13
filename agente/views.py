from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import Cliente
from .forms import ClienteForm
from google import genai
import json
import re
import os

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

def analizar_cliente(request, id):
    try:
        cliente = Cliente.objects.get(id=id)

        api_key = "[ENCRYPTION_KEY]"
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
        limpio = re.sub(r"```json|```", "", texto).strip()

        try:
            data = json.loads(limpio)
        except:
            return JsonResponse({
                "analisis": "Error interpretando IA",
                "estrategia": limpio,
                "riesgo": "medio"
            })

        cliente.analisis_ia = data["explicacion"]
        cliente.estrategia_ia = data["acciones"]
        cliente.riesgo_score = data["riesgo"]

        cliente.save()

        return JsonResponse({
            "analisis": data["explicacion"],
            "estrategia": data["acciones"],
            "riesgo": data["riesgo"]
        })

    except Exception as e:
        import traceback
        traceback.print_exc()

        return JsonResponse({
            "analisis": str(e),
            "estrategia": "Error real mostrado",
            "riesgo": "medio"
        }, status=500)


def eliminar_cliente(request, id):
    if request.method == 'POST':
        try:
            cliente = Cliente.objects.get(id=id)
            cliente.delete()
            return JsonResponse({"ok": True})
        except Cliente.DoesNotExist:
            return JsonResponse({"ok": False, "error": "No encontrado"}, status=404)
    return JsonResponse({"ok": False, "error": "Método no permitido"}, status=405)