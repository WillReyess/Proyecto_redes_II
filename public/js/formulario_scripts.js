//activar contraseñas
function mostrarPass(checkbox, ...inputs) { //guarda los valores de los inputs en arreglo
    if (checkbox && inputs.length) {
        checkbox.addEventListener("change", function () {
            inputs.forEach(input => { ///recorre el arreglo de inputs
                if (input) { ///verifica que el input exista
                    input.type = checkbox.checked ? "text" : "password";
                }
            });
        });
    }
}

///comprar las contraseñas 
function compararPass(formElement, passInput, confirmPassInput) {
    formElement.addEventListener("submit", function(event) {
        const passValue = passInput.value.trim();
        const confirmValue = confirmPassInput.value.trim();

        if (passValue !== confirmValue) {
            event.preventDefault(); // Evita el envío del formulario
            alert("Las contraseñas no coinciden. Por favor, verifícalas.");
        }
    });
}