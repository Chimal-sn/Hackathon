document.addEventListener("DOMContentLoaded", () => {

    const analisisContainer = document.getElementById('analisis_container');
    const mensajeInicial = document.getElementById('mensaje_inicial');
    const panelAnalisis = document.getElementById('panel-analisis');
    const panelEstrategia = document.getElementById('panel-estrategia');
    const robotViewer = document.getElementById('robot-viewer');

    // =========================
    // 🔵 BOTÓN ANALIZAR
    // =========================
    document.querySelectorAll(".btn-analizar").forEach(btn => {
        btn.addEventListener("click", async () => {

            let id = btn.dataset.id;

            // Mostrar el panel inmediatamente
            mensajeInicial.style.display = 'none';
            analisisContainer.classList.add('active');
            panelAnalisis.innerText = "⏳ Analizando...";
            panelEstrategia.innerText = "";

            // Animación del robot
            if (robotViewer) {
                robotViewer.animationName = 'Sentarse';
                robotViewer.play();
                setTimeout(() => {
                    if (robotViewer.animationName === 'Sentarse') {
                        robotViewer.animationName = 'Esperar';
                        robotViewer.play();
                    }
                }, 920);
            }

            try {
                let response = await fetch(`/analizar_cliente/${id}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()
                    }
                });

                if (!response.ok) throw new Error("Error en servidor");

                let data = await response.json();

                if (!data.analisis || !data.estrategia || !data.riesgo) throw new Error("Datos incompletos");

                // 🎨 Clase de riesgo
                let claseRiesgo = "";
                if (data.riesgo === "alto") claseRiesgo = "riesgo-alto";
                else if (data.riesgo === "medio") claseRiesgo = "riesgo-medio";
                else claseRiesgo = "riesgo-bajo";

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

                // Color visual
                let riesgoBox = document.querySelector(".riesgo_section");
                if (data.riesgo === "alto") riesgoBox.style.background = "#ff4d4d";
                else if (data.riesgo === "medio") riesgoBox.style.background = "#f0cb5b";
                else riesgoBox.style.background = "#28a745";

                // Cambiar botón a "Ver"
                btn.innerText = "Ver";
                btn.classList.remove("btn-analizar");
                btn.classList.add("btn-ver-analisis");
                btn.setAttribute("data-analisis", data.analisis);
                btn.setAttribute("data-estrategia", data.estrategia);

                // Animación al terminar
                if (robotViewer) {
                    robotViewer.animationName = 'Alegre';
                    robotViewer.play();
                }

            } catch (error) {
                console.error(error);
                panelAnalisis.innerText = "❌ Error con IA";
                panelEstrategia.innerText = "Intenta de nuevo";
            }
        });
    });

    // =========================
    // 🟢 BOTÓN VER
    // =========================
    document.querySelectorAll('.btn-ver-analisis').forEach(boton => {
        boton.addEventListener('click', (e) => {
            mensajeInicial.style.display = 'none';
            analisisContainer.classList.add('active');

            const analisis = e.target.getAttribute('data-analisis');
            const estrategia = e.target.getAttribute('data-estrategia');

            panelAnalisis.textContent = analisis;
            panelEstrategia.textContent = estrategia;

            if (robotViewer) {
                robotViewer.animationName = 'Alegre';
                robotViewer.play();
            }
        });
    });

    // =========================
    // 🗑 BOTONES ELIMINAR
    // =========================
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (!confirm('¿Seguro que quieres eliminar este cliente?')) return;

            try {
                const response = await fetch(`/eliminar_cliente/${id}/`, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': getCSRFToken() }
                });
                const data = await response.json();
                if (data.ok) {
                    location.reload();
                }
            } catch (e) {
                console.error('Error eliminando cliente:', e);
            }
        });
    });

    // =========================
    // 🔥 MODAL AGREGAR CLIENTE
    // =========================
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