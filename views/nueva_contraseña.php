<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../public/css/new_password.css">
    <title>Restablecer Contraseña</title>
</head>
<body>
    <div class="container">
        <form action="../controllers/authController.php" method="POST" id="cambiar_pass_form">
            <h2>Establecer nueva contraseña</h2>

            <label for="new_password">Nueva contraseña:</label>
            <input type="password" class="input-password" id="new_password" name="new_password" placeholder="Nueva contraseña" required><br>

            <label for="confirm_pass">Confirmar contraseña:</label>
            <input type="password" class="input-password" id="confirm_pass" name="confirm_password" placeholder="Confirmar contraseña" required><br>

            <div class="checkbox-container">
                <input type="checkbox" id="mostrar_contraseña">
                <label for="mostrar_contraseña">Mostrar contraseña</label>
            </div>

            <button type="submit" name="cambiar_password">Cambiar contraseña</button>
        </form>
    </div>

    <script src="../public/js/formulario_scripts.js"></script>
    <script src="../public/js/nueva_pass.js"></script>
</body>
</html>
