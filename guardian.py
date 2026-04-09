from google import genai
import os

# --- CONFIGURACIÓN ---
# Asegúrate de que la llave esté bien copiada, sin espacios.


from flask import Flask, request, jsonify
from google import genai

app = Flask(__name__)

MI_LLAVE = "AIzaSyBNamAAEEQ6yLin34EazcFtqRHKUmFhAYY" 
client = genai.Client(api_key=MI_LLAVE)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    mensaje = data["message"]

    prompt = f"""
    Analiza este cliente:

    {mensaje}

    Clasifica el riesgo (bajo, medio o alto) y da acciones.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    return jsonify({
        "reply": response.text
    })

if __name__ == "__main__":
    app.run(debug=True)