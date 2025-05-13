<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <link rel="stylesheet" href="../public/css/restablecer_pass.css">
    <link rel="stylesheet" href="../public/css/messages.css">
</head>
<body>
        <!-- Mensaje de confirmacion del cambio de contraseña-->
    <?php
    $mensaje = '';
    $tipo_mensaje = '';

    if (isset($_GET['mensaje'])) {
        // Array asociativo que mapea los valores de mensaje
        $mensajes = [
            'error_enviar_codigo' => ['Error al enviar el código de verificación. Por favor, inténtelo de nuevo.', 'error'],
            'correo_no_encontrado' => ['No se encontró ninguna cuenta asociada a este correo electrónico.', 'error'],
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
    <div class="container">
        <h2>Recuperación de la cuenta</h2>
        <p>Por favor, ingresa tu correo electrónico para recibir un código de verificación.</p>
        <form action="../controllers/authController.php" method="POST">
            <label for="email">Correo electrónico:</label>
            <input type="email" name="email" required>
            <button type="submit" name="enviar_codigo" id="enviar_codigo">Enviar código</button>
        </form>
    </div>

</body>
<script src="../public/js/formulario_scripts.js"></script>
</html>