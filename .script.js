// script.js
// Obtiene el formulario de reserva
const form = document.getElementById('reservationForm');

// Obtiene el elemento donde se mostrarán los mensajes del formulario
const messageEl = document.getElementById('successMessage');

// Escucha el evento "submit" del formulario
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que la página se recargue al enviar

    // --- Validación de fechas ---
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;

    // Si la fecha de salida es igual o anterior a la de entrada → error
    if (checkin && checkout && new Date(checkin) >= new Date(checkout)) {
        messageEl.style.color = 'crimson';
        messageEl.textContent = 'La fecha de salida debe ser posterior a la de entrada.';
        return; // Detiene el proceso
    }

    // Obtiene el nombre del usuario y usa "Huésped" si está vacío
    const name = document.getElementById('name').value.trim() || 'Huésped';

    // Muestra mensaje momentáneo mientras "procesa"
    messageEl.style.color = 'green';
    messageEl.textContent = 'Procesando reserva...';

    // Simula un pequeño tiempo de carga (800 ms)
    setTimeout(() => {

        // Reemplaza completamente el formulario por un mensaje de confirmación
        form.innerHTML = `
            <div style="padding:1rem;border-radius:10px;background:#f7fff9;border:1px solid #e6f8ee">
                <h4>¡Reserva completada!</h4>
                <p>Gracias, <strong>${escapeHtml(name)}</strong>. Hemos registrado tu reserva.</p>
                <p>Te enviaremos un correo con los detalles.</p>
                <button class="btn" onclick="location.reload()">Hacer otra reserva</button>
            </div>
        `;
    }, 800);
});

// Función para evitar que el nombre del usuario pueda inyectar código HTML
// (Protección básica contra XSS)
function escapeHtml(str) {
    return String(str).replace(/[&<>"'`=\/]/g, function (s) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        })[s];
    });
}