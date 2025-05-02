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
        <form action="" method="">
            <h1>Ingresar código </h1>
            <h2>Ingresar el código de 6 dígitos que enviamos a su correo 
                <?php echo isset($_SESSION['Correo']) ? enmascararCorreo($_SESSION['Correo']) : ''; ?>
                para activar su cuenta:</h2>
            <div class="codigo">
                <input type="text" class="codigo" maxlength="1" required>
                <input type="text" class="codigo" maxlength="1" required>
                <input type="text" class="codigo" maxlength="1" required>
                <input type="text" class="codigo" maxlength="1" required>
                <input type="text" class="codigo" maxlength="1" required>
                <input type="text" class="codigo" maxlength="1" required>
            </div>
            <button type="submit" id="reenviar">Reenviar codigo</button>
            <button type="submit" id="verificar">Verificar</button>
            <button type="submit" id="volver">Volver</button>
        </form>
    </div>
    <script src="http://localhost/proyecto_redes_II/public/js/verificacion.js"></script>
</body>
</html>

