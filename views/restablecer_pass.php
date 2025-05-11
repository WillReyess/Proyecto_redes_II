<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <link rel="stylesheet" href="../public/css/restablecer_pass.css">
</head>
<body>
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
</html>