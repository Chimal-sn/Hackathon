from google import genai
import os

# --- CONFIGURACIÓN ---
# Asegúrate de que la llave esté bien copiada, sin espacios.
MI_LLAVE = "AIzaSyCDO7r0mfGuBaZehNyZz3hmrll8FCVhK2E" 
client = genai.Client(api_key=MI_LLAVE)

def hacer_consulta():
    print("🛰️ Conectado al Guardián de Traxion (Gemini 2.5 Flash Lite)")
    print("Escribe 'salir' para terminar.\n")
    
    while True:
        # 1. Pedir la consulta al usuario
        pregunta = input("👤 Tú: ")
        
        if pregunta.lower() == 'salir':
            print("👋 Cerrando conexión. ¡Adiós!")
            break
            
        try:
            # 2. Enviar la consulta al modelo
            response = client.models.generate_content(
                model="gemini-2.5-flash-lite", 
                contents=pregunta
            )
            
            # 3. Mostrar la respuesta
            print(f"🤖 Guardián: {response.text}\n")
            
        except Exception as e:
            print(f"❌ Error al consultar: {e}\n")

if __name__ == "__main__":
    hacer_consulta()