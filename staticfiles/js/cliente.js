document.addEventListener("DOMContentLoaded", () => {

    const analisisContainer = document.getElementById('analisis_container');
    const mensajeInicial = document.getElementById('mensaje_inicial');
    const panelAnalisis = document.getElementById('panel-analisis');
    const panelEstrategia = document.getElementById('panel-estrategia');
    const robotViewer = document.getElementById('robot-viewer');

    // 🔥 EVENTO GLOBAL (SOLUCIÓN)
    document.addEventListener("click", async (e) => {

        const btn = e.target.closest("button");
        if (!btn) return;

        // =========================
        // 🔵 BOTÓN ANALIZAR
        // =========================
        if (btn.classList.contains("btn-analizar")) {

            mensajeInicial.style.display = 'none';
            analisisContainer.classList.add('active');

            let id = btn.dataset.id;

            try {
                // Mostrar el panel de análisis
                mensajeInicial.style.display = 'none';
                analisisContainer.classList.add('active');

                panelAnalisis.innerText = "⏳ Analizando...";
                panelEstrategia.innerText = "";

                let response = await fetch(`/analizar_cliente/${id}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()
                    }
                });

                let data = await response.json();

                panelAnalisis.innerHTML = `
                    <h3>🚨 Riesgo: ${data.riesgo}</h3>
                    <p>${data.analisis}</p>
                `;

                panelEstrategia.innerHTML = `
                    <p>${data.estrategia}</p>
                `;

                // 🔁 Cambiar botón a VER
                btn.innerText = "Ver";
                btn.classList.remove("btn-analizar");
                btn.classList.add("btn-ver-analisis");

                btn.dataset.analisis = data.analisis;
                btn.dataset.estrategia = data.estrategia;

            } catch (error) {
    console.error(error);

    mensajeInicial.style.display = 'none';
    analisisContainer.classList.add('active');

    panelAnalisis.innerHTML = `
        <div style="color:red;">
            ❌ Error al analizar cliente
        </div>
    `;
    panelEstrategia.innerText = "";
}
        }

        // =========================
        // 🟢 BOTÓN VER
        // =========================
        if (btn.classList.contains("btn-ver-analisis")) {

            mensajeInicial.style.display = 'none';
            analisisContainer.classList.add('active');

            panelAnalisis.textContent = btn.dataset.analisis;
            panelEstrategia.textContent = btn.dataset.estrategia;
        }

    });

});
    // 🗑 BOTONES ELIMINAR
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



// 🔐 CSRF
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}