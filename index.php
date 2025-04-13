<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login</title>
    <!-- Carga la fuente y los iconos de FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <!-- Carga el archivo CSS local para el estilo del login -->
    <link rel="stylesheet" href="./public/css/login.css">
</head>
<body>
    <div class="container" id="main">
        <!-- Formulario de registro -->
        <div class="sign-up">
            <form action="./controllers/authController.php" method="post" id="SignUpForm">
                <h1>Registrarse</h1> <!-- Título del formulario -->
                
                <!-- Contenedor para las redes sociales -->
                <div class="social-container">
                    <a href="#" class="social"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="social"><i class="fab fa-x"></i></a>
                    <a href="#" class="social"><i class="fab fa-google"></i></a>
                </div>
                <p>o use su correo para registrar</p> <!-- Texto que indica que también se puede registrar con correo electrónico -->
                
                <!-- Campos para nombre y apellido -->
                <div class="input-group">
                    <input type="text" id="name" name="name" placeholder="Nombre" required>
                    <input type="text" id="last_name" name="last_name" placeholder="Apellido" required>
                </div>

                <!-- Campo para el correo electrónico -->
                <div class="signUp_email_container">
                    <input type="email" id="correo" name="correo" placeholder="Email" required>
                    <i class="fa-regular fa-envelope" id="icon_email_signUp"></i> <!-- Icono de email -->
                </div>

                <!-- Campo para la contraseña -->
                <div class="passContainer">
                    <input type="password" id="password" name="password" placeholder="Contraseña" required>
                    <i class="fa-regular fa-eye" id="password-icon"></i> <!-- Icono de visibilidad de la contraseña -->
                </div>

                <!-- Campo para confirmar la contraseña -->
                <div class="passConfirmContainer">
                    <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirmar Contraseña" required>
                    <i class="fa-regular fa-eye" id="confirm-password-icon"></i> <!-- Icono de visibilidad de la contraseña -->
                </div>

                <!-- Botón para enviar el formulario -->
                <button type="submit" name="registrar">Registrar</button>
            </form>
        </div>
        
        <!-- Formulario de inicio de sesión -->
        <div class="sign-in">
            <form action="./controllers/authController.php" method="post">
                <h1>Inicio de Sesión</h1> <!-- Título del formulario -->

                <?php
                    // Muestra un mensaje de error si está presente en la sesión
                    if (isset($_SESSION['error_message'])) {
                        echo "<p class='error'>" . $_SESSION['error_message'] . "</p>";
                        unset($_SESSION['error_message']);  // Elimina el mensaje de error de la sesión después de mostrarlo
                    }
                ?>

                <!-- Contenedor para las redes sociales -->
                <div class="social-container">
                    <a href="#" class="social"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="social"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="#" class="social"><i class="fab fa-google"></i></a>
                </div>
                <p>o use su cuenta.</p> <!-- Texto que indica que también se puede iniciar sesión con cuenta -->
                
                <!-- Campo para el correo electrónico -->
                <div class="signIn_Email_Container">
                    <input type="email" name="Email" placeholder="Email" required>
                    <i class="fa-regular fa-envelope" id="icon_email"></i> <!-- Icono de email -->
                </div>

                <!-- Campo para la contraseña -->
                <div class="signInPassContainer">
                    <input type="password" id="signInpass" name="Password" placeholder="Password" required>
                    <i class="fa-regular fa-eye" id="iconSignIn"></i> <!-- Icono de visibilidad de la contraseña -->
                </div>
                <a href="#"> ¿Olvidó la contraseña?</a> <!-- Enlace para recuperar la contraseña -->
                <button type="submit" name="signInBtn">Iniciar Sesión</button> <!-- Botón para enviar el formulario -->
            </form>
        </div>

        <!-- Contenedor de la superposición (para cambiar entre formularios de registro e inicio de sesión) -->
        <div class="overlay-container">
            <div class="overlay">
                <!-- Lado izquierdo de la superposición (inicio de sesión) -->
                <div class="overlay-left">
                    <h1>!Bienvenido de vuelta!</h1> <!-- Título de bienvenida -->
                    <p>Para seguir disfrutando del juego ingrese con sus datos</p> <!-- Instrucciones -->
                    <button id="signIn">Iniciar Sesión</button> <!-- Botón para iniciar sesión -->
                </div>

                <!-- Lado derecho de la superposición (registro) -->
                <div class="overlay-right">
                    <h1>¡Hola Amigo!</h1> <!-- Título de bienvenida para nuevos usuarios -->
                    <p>Ingrese su informacion para iniciar esta nueva aventura</p> <!-- Instrucciones -->
                    <button id="signUp">Registrar</button> <!-- Botón para registrarse -->
                </div>
            </div>
        </div>
    </div>

    <!-- Carga el archivo de JavaScript para la interacción de los formularios -->
    <script src="./public/js/loginScript.js"></script>
</body>
</html>
