document.addEventListener("DOMContentLoaded", function () {

    //datos del formulario
    const newPass = document.getElementById("new_password");
    const confirNewPass = document.getElementById("confirm_pass");
    const checkbox = document.getElementById("mostrar_contraseña");
    const form = document.getElementById("cambiar_pass_form");

    //muestra las contraseñas
    mostrarPass(checkbox, newPass, confirNewPass);
    
    //compara las contraseñas
    compararPass(form, newPass, confirNewPass);

});