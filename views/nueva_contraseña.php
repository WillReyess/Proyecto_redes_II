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
        <form action="../controllers/authController.php" method="POST">
            <h2>Establecer nueva contraseña</h2>
            <label for="new_password">Nueva contraseña:</label>
            <input type="password" name="new_password" required><br>
            <label for="confirm_password">Confirmar contraseña:</label>
            <input type="password" name="confirm_password" required><br>
            <button type="submit" name="cambiar_password">Cambiar contraseña</button>
        </form>
    </div>
</body>
</html>