
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="./public/css/login.css">
    <link rel="stylesheet" href="./public/css/messages.css">
</head>
<body>
    <!-- Mensaje de confirmacion del cambio de contraseña-->
    <?php
    $mensaje = '';
    $tipo_mensaje = '';

    if (isset($_GET['mensaje'])) {
        // Array asociativo que mapea los valores de mensaje
        $mensajes = [
            'contrasena_actualizada' => ['Contraseña actualizada correctamente. Puedes iniciar sesión.', 'exito'],
            'contrasena_incorrecta' => ['Contraseña incorrecta. Intenta de nuevo.', 'error'],
            'contrasenas_no_coinciden' => ['Las contraseñas no coinciden. Intenta de nuevo.', 'error'],
            'Usuario_no_encontrado' => ['No pudimos encontrar tu cuenta. ¡Por favor, regístrate para continuar!', 'error'],
            'Usuario_no_verificado' => ['Tu cuenta está pendiente de verificación. Por favor, activa tu cuenta para acceder', 'error'],
            'acceso_denegado' => ['Acceso denegado. Por favor, inicia sesión para continuar.', 'error'],
        ];

        $mensajeKey = $_GET['mensaje'];

        if (isset($mensajes[$mensajeKey])) {
            list($mensaje, $tipo_mensaje) = $mensajes[$mensajeKey];
        }
    }
    ?>

    <?php if ($mensaje): ?>
        <div id="mensaje-<?php echo $tipo_mensaje; ?>" class="alert-<?php echo $tipo_mensaje; ?>">
            <?php echo $mensaje; ?>
        </div>
    <?php endif; ?>

    <div class="container" id="main">
        
        <!-- Formulario de registro -->
        <div class="sign-up">
            <form action="./controllers/authController.php" method="post" id="SignUpForm">
                <h1 id="titulo">Registrarse</h1>
                
                <!-- Campos para nombre y apellido -->
                <div class="input-group">
                    <input type="text" id="name" name="name" placeholder="Nombre" required>
                    <input type="text" id="last_name" name="last_name" placeholder="Apellido" required>
                </div>

                <!-- Campo para el correo electrónico -->
                <div class="signUp_email_container">
                    <input type="email" id="correo" name="correo" placeholder="Email" required>
                    <i class="fa-regular fa-envelope" id="icon_email"></i> 
                </div>

                <!-- Campo para la contraseña -->
                <div class="passContainer">
                    <input type="password" id="password" name="password" placeholder="Contraseña" required>
                    <i class="fa-solid fa-lock" id="icon_password"></i> 

                </div>

                <!-- Campo para confirmar la contraseña -->
                <div class="passConfirmContainer">
                    <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirmar Contraseña" required>
                    <i class="fa-solid fa-lock" id="icon_password"></i> 
                </div>

                <!-- Checkbox para mostrar contraseña -->
                <div class="checkbox-container">
                    <input type="checkbox" id="mostrar_contraseña_registro">
                    <label for="mostrar_contraseña_registro" id="mostrar_pass">Mostrar contraseña</label>
                </div>
                
                <!-- Botón para enviar el formulario -->
                <button type="submit" name="registrar">Registrar</button>
            </form>
        </div>
        
        <!-- Formulario de inicio de sesión -->
        <div class="sign-in">
            <form action="./controllers/authController.php" method="post">
                <h1 id="titulo">Inicio de Sesión</h1> 
                
                <!-- Campo para el correo electrónico -->
                <div class="signIn_Email_Container">
                    <input type="email" name="Email" placeholder="Email" required>
                    <i class="fa-regular fa-envelope" id="icon_email"></i> <!-- Icono de email -->
                </div>

                <!-- Campo para la contraseña -->
                <div class="signInPassContainer">
                    <input type="password" id="Password" name="Password" placeholder="Password" required>
                    <i class="fa-solid fa-lock" id="icon_password"></i>
                </div>

                <!-- Checkbox para mostrar contraseña -->
                <div class="checkbox-container">
                    <input type="checkbox" id="mostrar_contraseña_login">
                    <label for="mostrar_contraseña_login" id="mostrar_pass">Mostrar contraseña</label>
                </div>

                <a href="./views/restablecer_pass.php" id="olvido_contraseña"> ¿Olvidó la contraseña?</a> 
                <button type="submit" name="signInBtn">Iniciar Sesión</button> 
            </form>
        </div>

        <!-- Contenedor de la superposición (para cambiar entre formularios de registro e inicio de sesión) -->
        <div class="overlay-container">
            <div class="overlay">
                
                <div class="overlay-left">
                    <h1>!Bienvenido de vuelta!</h1> 
                    <p>Para seguir disfrutando del juego ingrese con sus datos</p> 
                    <button id="signIn">Iniciar Sesión</button> 
                </div>

                <!-- Lado derecho de la superposición (registro) -->
                <div class="overlay-right">
                    <h1>¡Hola Amigo!</h1> 
                    <p>Ingrese su informacion para iniciar esta nueva aventura</p> 
                    <button id="signUp">Registrar</button> 
                </div>
            </div>
        </div>
    </div>

    <script src="./public/js/loginScript.js"></script>
    <script src="./public/js/formulario_scripts.js"></script>
    
</body>
</html>
