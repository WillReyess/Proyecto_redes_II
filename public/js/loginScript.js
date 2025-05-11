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
    const signupForm = document.getElementById("SignUpForm");
    const checkbox = document.getElementById("mostrar_contraseña_registro");

    //compara las contraseñas
    compararPass(signupForm, pass, confirmPass);
    
    //muestra las contraseñas
    mostrarPass(checkbox, pass, confirmPass);

    //datos del acceso
    const PassLogin = document.getElementById("Password");
    const checkboxLogin = document.getElementById("mostrar_contraseña_login");

    //mostrar las contraseñas
    mostrarPass(checkboxLogin, PassLogin);

    const mensaje = document.getElementById('mensaje-exito');
    if (mensaje) {
        setTimeout(function () {
            mensaje.style.opacity = '0';

            // Esperamos a que se desvanezca, luego recargamos la página
            setTimeout(() => {
                window.location.href = window.location.pathname;
            }, 500); 
        }, 3000);
    }

});
