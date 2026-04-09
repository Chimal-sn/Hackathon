from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500"])

MI_LLAVE = "AIzaSyBNamAAEEQ6yLin34EazcFtqRHKUmFhAYY"

client = genai.Client(api_key=MI_LLAVE)


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        mensaje = data.get("message", "").lower()

        # 🟢 saludos
        if mensaje in ["hola", "hi", "buenas", "hello"]:
            return jsonify({
                "reply": "👋 Hola! Envíame datos del cliente para analizar su riesgo."
            })

        prompt = f"""
Eres un sistema de análisis de clientes.

RESPONDE SOLO EN ESTE FORMATO JSON:

{{
  "riesgo": "bajo | medio | alto",
  "explicacion": "máximo 2 líneas",
  "acciones": "máximo 3 acciones cortas en lista"
}}

NO expliques nada más.
NO escribas texto fuera del JSON.
NO agregues introducciones.

Cliente:
{mensaje}
"""


        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({
            "reply": "❌ Error en IA"
        }), 500


if __name__ == "__main__":
    app.run(debug=True)