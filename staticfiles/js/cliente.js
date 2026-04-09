document.addEventListener("DOMContentLoaded", () => {

    const analisisContainer = document.getElementById('analisis_container');
    const mensajeInicial = document.getElementById('mensaje_inicial');
    const panelAnalisis = document.getElementById('panel-analisis');
    const panelEstrategia = document.getElementById('panel-estrategia');

    // 🔥 BOTONES VER (ya analizados)
    document.querySelectorAll('.btn-ver-analisis').forEach(boton => {
        boton.addEventListener('click', (e) => {

            mensajeInicial.style.display = 'none';
            analisisContainer.classList.add('active');

            const analisis = e.target.getAttribute('data-analisis');
            const estrategia = e.target.getAttribute('data-estrategia');

            panelAnalisis.textContent = analisis;
            panelEstrategia.textContent = estrategia;
        });
    });

    // 🔥 BOTONES ANALIZAR
    document.querySelectorAll(".btn-analizar").forEach(btn => {

        btn.addEventListener("click", async () => {

            let id = btn.dataset.id;

            try {
                panelAnalisis.innerText = "⏳ Analizando...";
                panelEstrategia.innerText = "";

                let response = await fetch(`/analizar_cliente/${id}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()
                    }
                });

                if (!response.ok) {
                    let errorText = await response.text();
                    console.error("ERROR BACKEND:", errorText);
                    throw new Error("Error en servidor");
                }

                let data = await response.json();

                // 🔥 VALIDAR
                if (!data.analisis || !data.estrategia || !data.riesgo) {
                    throw new Error("Datos incompletos");
                }

                // 🎨 CLASE DE RIESGO
                let claseRiesgo = "";
                if (data.riesgo === "alto") claseRiesgo = "riesgo-alto";
                else if (data.riesgo === "medio") claseRiesgo = "riesgo-medio";
                else claseRiesgo = "riesgo-bajo";

                // 🔥 HTML BONITO
                panelAnalisis.innerHTML = `
                    <div class="resultado-ia ${claseRiesgo}">
                        <h3>🚨 Riesgo: ${data.riesgo.toUpperCase()}</h3>
                        <p><b>Explicación:</b> ${data.analisis}</p>
                    </div>
                `;

                panelEstrategia.innerHTML = `
                    <div class="resultado-ia">
                        <h3>📌 Acciones</h3>
                        <p>${data.estrategia}</p>
                    </div>
                `;

                // 🔥 COLOR VISUAL
                let riesgoBox = document.querySelector(".riesgo_section");

                if (data.riesgo === "alto") {
                    riesgoBox.style.background = "#ff4d4d";
                } else if (data.riesgo === "medio") {
                    riesgoBox.style.background = "#f0cb5b";
                } else {
                    riesgoBox.style.background = "#28a745";
                }

                // 🔥 CAMBIAR BOTÓN A "VER"
                btn.innerText = "Ver";
                btn.classList.remove("btn-analizar");
                btn.classList.add("btn-ver-analisis");

                btn.setAttribute("data-analisis", data.analisis);
                btn.setAttribute("data-estrategia", data.estrategia);

            } catch (error) {
                console.error(error);

                panelAnalisis.innerText = "❌ Error con IA";
                panelEstrategia.innerText = "Intenta de nuevo";
            }

        });

    });

    // 🔥 MODAL
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

// 🔐 CSRF
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}