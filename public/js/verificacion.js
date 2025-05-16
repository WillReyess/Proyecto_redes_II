document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".codigo-input");

    inputs.forEach((input, index) => {
        // Solo permite números y avanza automáticamente
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Permitir ir al anterior con Backspace
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && input.value === '' && index > 0) {
                inputs[index - 1].focus();
            }
        });

        // Pegar código completo
        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
            if (paste.length === inputs.length) {
                inputs.forEach((inputEl, i) => {
                    inputEl.value = paste.charAt(i);
                });
                inputs[inputs.length - 1].focus();
            }
        });
    });

    const mensajeError = document.getElementById("mensaje-error");
    const mensajeExito = document.getElementById("mensaje-exito");

    if (mensajeError) {
        aplicarDesvanecimiento(mensajeError);
    }
    if (mensajeExito) {
        aplicarDesvanecimiento(mensajeExito);
    }
});
