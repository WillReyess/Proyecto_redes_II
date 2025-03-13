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

    // Mostrar y ocultar las contraseñas al hacer clic en el ícono
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm_password");
    const passwordIcon = document.getElementById("password-icon"); // ID único para el ícono de la contraseña
    const confirmPasswordIcon = document.getElementById("confirm-password-icon"); // ID único para el ícono de la confirmación
    const signInPass = document.getElementById("signInpass"); //id de la contraseña en el Sign-in
    const signInIcon = document.getElementById("iconSignIn");//id del icono de contraseña en el sign-in

    // Función para alternar el tipo de campo y el ícono
    function passwordVisibility(inputField, icon) {
        icon.addEventListener("click", () => {
            if (inputField.type === "password") {
                inputField.type = "text";
                icon.classList.remove("fa-eye"); // Eliminar el ícono de ojo cerrado
                icon.classList.add("fa-eye-slash"); // Agregar el ícono de ojo abierto
            } else {
                inputField.type = "password";
                icon.classList.remove("fa-eye-slash"); // Eliminar el ícono de ojo abierto
                icon.classList.add("fa-eye"); // Agregar el ícono de ojo cerrado
            }
        });
    }

    // Llamar a la función para los dos campos de contraseña
    passwordVisibility(passwordField, passwordIcon);
    passwordVisibility(confirmPasswordField, confirmPasswordIcon);
    // llamar la funcion para el campo de contraseña del sign in
    passwordVisibility(signInPass, signInIcon);
});
