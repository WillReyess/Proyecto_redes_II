<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluye el autoload de Composer
require_once __DIR__ . '/../vendor/autoload.php';

// Crear una instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';         // Servidor SMTP de Gmail
    $mail->SMTPAuth   = true;
    $mail->Username   = 'tucorreo@gmail.com';      
    $mail->Password   = 'tu_contraseña_o_app_pass';
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    // Remitente y destinatario
    $mail->setFrom('tucorreo@gmail.com', 'Tu Nombre o App');
    $mail->addAddress('destinatario@gmail.com'); 

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Asunto de prueba';
    $mail->Body    = '<h1>¡Correo enviado desde XAMPP!</h1><p>Esto es un mensaje de prueba usando PHPMailer.</p>';
    $mail->AltBody = 'Esto es un mensaje de prueba usando PHPMailer (texto alternativo)';

    $mail->send();
    echo 'Correo enviado correctamente';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
