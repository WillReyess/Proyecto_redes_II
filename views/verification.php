<?php
session_start();
require_once '../controllers/authController.php';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificacion</title>
    <link rel="stylesheet" href="../public/css/verificacion.css">
    <link rel="stylesheet" href="../public/css/messages.css">
</head>
<body>
    <?php
    $mensaje = '';
    $tipo_mensaje = '';

    if (isset($_GET['mensaje'])) {
        $mensajes = [
            'correo_reenviado_correctamente' => ['El correo de verificación ha sido reenviado correctamente.', 'exito'],
            'error_reenviar_codigo' => ['Error al reenviar el código de verificación. Por favor, inténtelo de nuevo.', 'error'],
            'sesion_invalida' => ['La sesión ha expirado. Por favor, inicie sesión nuevamente.', 'error'],
            'codigo_no_enviado/sesion_invalida' => ['No se recibió el código o la sesión ha expirado. Por favor, solicita un nuevo código.', 'error'],
            'codigo_expirado' => ['El código ha expirado. Por favor, solicita un nuevo código.', 'error'],
            'error_activar_cuenta' => ['Error al activar la cuenta. Por favor, inténtelo de nuevo.', 'error'],
            'codigo_incorrecto' => ['El código ingresado es incorrecto. Por favor, verifique e intente nuevamente.', 'error'],
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
    <div class="maincontainer">
        <form action="../controllers/authController.php" method="POST">
            <h1>Ingresar código </h1>
            <h2>Ingresar el código de 6 dígitos que enviamos a su correo 
                <?php echo isset($_SESSION['Correo']) ? enmascararCorreo($_SESSION['Correo']) : ''; ?>
                para activar su cuenta:</h2>
            <div class="codigo">
                <input type="text" name="codigo[]" maxlength="1" required inputmode="numeric" pattern="\d*" class="codigo-input">
                <input type="text" name="codigo[]" maxlength="1" required inputmode="numeric" pattern="\d*" class="codigo-input">
                <input type="text" name="codigo[]" maxlength="1" required inputmode="numeric" pattern="\d*" class="codigo-input">
                <input type="text" name="codigo[]" maxlength="1" required inputmode="numeric" pattern="\d*" class="codigo-input">
                <input type="text" name="codigo[]" maxlength="1" required inputmode="numeric" pattern="\d*" class="codigo-input">
                <input type="text" name="codigo[]" maxlength="1" required inputmode="numeric" pattern="\d*" class="codigo-input">
            </div>
            <button type="submit" name="reenviar" id="reenviar" formnovalidate>Reenviar código</button>
            <button type="submit" name ="verificar" id="verificar">Verificar</button>
            <button type="submit" name = "volver" id="volver" formnovalidate>Volver</button>
        </form>
    </div>
    <script src="../public/js/verificacion.js"></script>
    <script src="../public/js/formulario_scripts.js"></script>
</body>
</html>

