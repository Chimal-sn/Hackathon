document.addEventListener('DOMContentLoaded', () => {
    const analisisContainer = document.getElementById('analisis_container');
    const mensajeInicial = document.getElementById('mensaje_inicial');
    const botones = document.querySelectorAll('.btn-ver-analisis');
    const panelAnalisis = document.getElementById('panel-analisis');
    const panelEstrategia = document.getElementById('panel-estrategia');

    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {

            mensajeInicial.style.display = 'none';
            analisisContainer.classList.add('active');
            const analisis = e.target.getAttribute('data-analisis');
            const estrategia = e.target.getAttribute('data-estrategia');
            panelAnalisis.textContent = analisis;
            panelEstrategia.textContent = estrategia;
        });
    });

    // Lógica para abrir y cerrar el formulario
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const modalFormulario = document.querySelector('.formulario_container');

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', () => {
            modalFormulario.classList.add('active');
        });
    }

    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            modalFormulario.classList.remove('active');
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".btn-analizar").forEach(btn => {

        btn.addEventListener("click", async () => {

            let id = btn.dataset.id;
            let nombre = btn.dataset.nombre;
            let nps = btn.dataset.nps;
            let quejas = btn.dataset.quejas;

            try {
                document.getElementById("panel-analisis").innerText = "⏳ Analizando...";
document.getElementById("panel-estrategia").innerText = "";
                let response = await fetch(`/analizar_cliente/${id}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()
                    },
                    body: JSON.stringify({
                        nombre,
                        nps,
                        quejas
                    })
                });

                // 🚨 validar respuesta del servidor
                if (!response.ok) {
                    let errorText = await response.text();
                    console.error("ERROR BACKEND:", errorText);
                    throw new Error("Error en servidor");
                }

                // 🔥 intentar leer JSON
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    let raw = await response.text();
                    console.error("No es JSON:", raw);
                    throw new Error("Respuesta inválida del servidor");
                }

                // 🔥 validar contenido
                if (!data.analisis || !data.estrategia) {
                    console.error("Respuesta incompleta:", data);
                    throw new Error("Datos incompletos");
                }

                // 🔥 mostrar en panel
                document.getElementById("panel-analisis").innerText = data.analisis;
                document.getElementById("panel-estrategia").innerText = data.estrategia;

                

            } catch (error) {
                console.error(error);

                document.getElementById("panel-analisis").innerText = "❌ Error con IA";
                document.getElementById("panel-estrategia").innerText = "Intenta de nuevo";
            }

        });

    });

});

// 🔐 CSRF
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}