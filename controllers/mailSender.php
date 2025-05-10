<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

function enviarCorreoDeVerificacion($emailUsuario, $nombreUsuario, $apellidoUsuario, $codigo) {
    $nombreCompleto = $nombreUsuario . ' ' . $apellidoUsuario;

    // Enviar correo con PHPMailer
    try {
        $mail = new PHPMailer(true);

        $mail->setLanguage('es');
        $mail->CharSet = 'UTF-8';

        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'prueba.verif14@gmail.com';
        $mail->Password   = 'C'; //contraseña
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('prueba.verif14@gmail.com', 'USO WARGAME');
        $mail->addAddress($emailUsuario, $nombreCompleto);

        $mail->isHTML(true);
        $mail->Subject = 'Activación de cuenta';
        $mail->Body    = "
            <h2>Hola, $nombreCompleto</h2>
            <p>Tu código de verificación es:</p>
            <h1 style='color: #2E86C1;'>$codigo</h1>
            <p>Este código expirará en 5 minutos.</p>
        ";

        $mail->send();
        return ['status' => 'success', 'message' => 'Correo enviado correctamente'];
    } catch (Exception $e) {
        return ['status' => 'error', 'message' => "Error al enviar el correo: {$mail->ErrorInfo}"];
    }
}