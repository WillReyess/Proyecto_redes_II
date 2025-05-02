<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//se incluye el archivo de configuración de la base de datos
require_once 'http://localhost/proyecto_redes_II/config/database.php';


// Incluye el autoload de Composer
require 'http://localhost/proyecto_redes_II/vendor/autoload.php';

//se hace la consulta a la base de datos para obtener el correo y el nombre del usuario
$database = new Database();
$conn = $database->getConnection();

try {
    session_start();
    if (!isset($_SESSION['Correo']) || !isset($_SESSION['Nombre']) || !isset($_SESSION['Apellido'])) {
        echo json_encode(['status' => 'error', 'message' => 'No se encontró la información la sesión']);
        exit();
    }

    $emailUsuario = $_SESSION['Correo'];
    $nombreUsuario = $_SESSION['Nombre'];
    $apellidoUsuario = $_SESSION['Apellido'];
    
    $datos = json_decode(file_get_contents('php://input'), true); // Obtener los datos del cuerpo de la solicitud
    
    if (!$datos) {
        echo json_encode(['status' => 'error', 'message' => 'No se recibieron datos válidos']);
        exit();
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener datos de la sesión']);
    exit();
}

// Crear una instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';         // Servidor SMTP de Gmail
    $mail->SMTPAuth   = true;
    $mail->Username   = 'prueba.verif14@gmail.com';      
    $mail->Password   = $contrasenia; // Contraseña de la cuenta de Gmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Habilitar TLS
    $mail->Port       = 587;

    // Remitente y destinatario
    $mail->setFrom('prueba.verif14@gmail.com', 'USO WARGAME');
    $nombreCompleto = $nombreUsuario . ' ' . $apellidoUsuario;
    $mail->addAddress($emailUsuario, $nombreCompleto); // Agregar destinatario

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Activacion de cuenta';
    $mail->Body    = '<h1>¡Correo enviado desde XAMPP!</h1><p>Esto es un mensaje de prueba usando PHPMailer.</p>';

    $mail->send();
    echo 'Correo enviado correctamente';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
