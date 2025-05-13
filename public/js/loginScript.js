document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const main = document.getElementById('main');

    signUpButton.addEventListener('click', () => {
        main.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
        main.classList.remove("right-panel-active");
    });

    //datos del registro
    const pass = document.getElementById("password");
    const confirmPass = document.getElementById("confirm_password");
    const checkbox = document.getElementById("mostrar_contraseña_registro");

    //muestra las contraseñas
    mostrarPass(checkbox, pass, confirmPass);

    //datos del acceso
    const PassLogin = document.getElementById("Password");
    const checkboxLogin = document.getElementById("mostrar_contraseña_login");

    //mostrar las contraseñas
    mostrarPass(checkboxLogin, PassLogin);

    const mensajeError = document.getElementById("mensaje-error");
    const mensajeExito = document.getElementById("mensaje-exito");

    if (mensajeError) {
        aplicarDesvanecimiento(mensajeError);
    }
    if (mensajeExito) {
        aplicarDesvanecimiento(mensajeExito);
    }
});
