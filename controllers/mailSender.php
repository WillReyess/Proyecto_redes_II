<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
// Cargar el archivo .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

function enviarCorreoDeVerificacion($emailUsuario, $nombreUsuario, $apellidoUsuario, $codigo) {
    session_start();

    $nombreCompleto = $nombreUsuario . ' ' . $apellidoUsuario;

    // Determinar el asunto según el tipo de verificación
    $asunto = 'Código de verificación';
    if (isset($_SESSION['tipo_verificacion'])) {
        if ($_SESSION['tipo_verificacion'] === 'registro') {
            $asunto = 'Activación de cuenta';
        } elseif ($_SESSION['tipo_verificacion'] === 'recuperacion') {
            $asunto = 'Reseteo de contraseña';
        }
    }

    // Enviar correo con PHPMailer
    try {
        $mail = new PHPMailer(true);

        $mail->setLanguage('es');
        $mail->CharSet = 'UTF-8';

        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['EMAIL_ADDRESS'];
        $mail->Password   = $_ENV['EMAIL_PASSWORD']; //contraseña
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom($_ENV['EMAIL_ADDRESS'], 'USO WARGAME');
        $mail->addAddress($emailUsuario, $nombreCompleto);

        $mail->isHTML(true);
        $mail->Subject = $asunto;
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