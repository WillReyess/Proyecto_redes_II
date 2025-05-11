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

    // Verifica que las contraseñas ingresadas sean las mismas
    document.getElementById("SignUpForm").addEventListener("submit", function(event){
        const password = document.getElementById("password").value.trim();
        const confirm_password = document.getElementById("confirm_password").value.trim();

        if(password !== confirm_password){
            alert("Las contraseñas no coinciden. Por favor, inténtelo nuevamente.");
            event.preventDefault(); // Evita que el formulario se envíe
        }
    });

    // Mostrar/Ocultar contraseñas al marcar checkbox (registro)
    const mostrarContraseñaRegistro = document.getElementById("mostrar_contraseña_registro");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");

    mostrarContraseñaRegistro.addEventListener("change", function () {
        const tipo = this.checked ? "text" : "password";
        passwordInput.type = tipo;
        confirmPasswordInput.type = tipo;
    });

    // Mostrar/Ocultar contraseña al marcar checkbox (login)
    const mostrarContraseñaLogin = document.getElementById("mostrar_contraseña_login");
    const loginPasswordInput = document.getElementById("Password");

    mostrarContraseñaLogin.addEventListener("change", function () {
        loginPasswordInput.type = this.checked ? "text" : "password";
    });
});
