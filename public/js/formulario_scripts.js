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

//desvanecimiento de mensajes de error y exito
function aplicarDesvanecimiento(mensajeElemento) {
    if (mensajeElemento) {
        setTimeout(function () {
            mensajeElemento.style.opacity = '0'; // Desvanecemos el mensaje

            setTimeout(() => {
                window.location.href = window.location.pathname; // Recargamos la página después del desvanecimiento
            }, 500);
        }, 3000); // Desvanecer después de 3 segundos
    }
}