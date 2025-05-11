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
</head>
<body>
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
            <button type="submit" name = "volver" id="volver">Volver</button>
        </form>
    </div>
    <script src="../public/js/verificacion.js"></script>
</body>
</html>

