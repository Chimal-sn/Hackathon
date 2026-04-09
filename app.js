async function sendMessage() {

    let input = document.getElementById("userInput");
    let message = input.value;

    if (!message) return;

    let chat = document.getElementById("chat");

    chat.innerHTML += `<p><b>👤 Tú:</b> ${message}</p>`;

    input.value = "";

    try {
        let response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        // 🚨 validar respuesta
        if (!response.ok) {
            throw new Error("Error en el servidor Flask");
        }

        let data = await response.json();

let raw = data.reply;

// 🔥 limpiar ```json ``` si existe
raw = raw.replace(/```json/g, "").replace(/```/g, "");

// 🚨 AQUÍ VA EL FIX
let obj;

try {
    obj = JSON.parse(raw);
} catch (e) {
    // si NO es JSON, solo es texto normal (ej: saludo)
    chat.innerHTML += `
        <div style="padding:10px; margin:10px;">
            🤖 ${raw}
        </div>
    `;
    chat.scrollTop = chat.scrollHeight;
    return;
}


chat.innerHTML += `
<div style="border:1px solid #ccc; padding:10px; margin:10px;">
    <h3>🤖 IA Resultado</h3>
    <p><b>Riesgo:</b> ${obj.riesgo.toUpperCase()}</p>
    <p><b>Explicación:</b> ${obj.explicacion}</p>
    <p><b>Acciones:</b> ${obj.acciones}</p>
</div>
`;
        // 🔥 SCROLL automático
        chat.scrollTop = chat.scrollHeight;

        // 🔥 SIMULACIÓN DE RIESGO
        let riesgo = document.getElementById("riesgo");

if (obj.riesgo === "alto") {
    riesgo.innerText = "ALTO";
    riesgo.style.color = "red";
} else if (obj.riesgo === "medio") {
    riesgo.innerText = "MEDIO";
    riesgo.style.color = "orange";
} else {
    riesgo.innerText = "BAJO";
    riesgo.style.color = "green";
}

        let text = data.reply.toLowerCase();

        if (text.includes("alto")) {
            riesgo.innerText = "ALTO";
            riesgo.className = "rojo";
        } else if (text.includes("medio")) {
            riesgo.innerText = "MEDIO";
            riesgo.className = "amarillo";
        } else {
            riesgo.innerText = "BAJO";
            riesgo.className = "verde";
        }

    } catch (error) {
        console.error(error);
        chat.innerHTML += `<p style="color:red;"><b>Error:</b> No se pudo conectar con la IA</p>`;
    }
}