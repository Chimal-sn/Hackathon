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