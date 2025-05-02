<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once './codigoGenerator.php';
require_once __DIR__ . '/config/database.php'; 
require_once __DIR__ . '/vendor/autoload.php';

session_start();

// Verifica datos de sesión
if (!isset($_SESSION['Correo'], $_SESSION['Nombre'], $_SESSION['Apellido'], $_SESSION['codigo'])) {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró la información en la sesión']);
    exit();
}

$emailUsuario = $_SESSION['Correo'];
$nombreUsuario = $_SESSION['Nombre'];
$apellidoUsuario = $_SESSION['Apellido'];
$codigo = $_SESSION['codigo'];
$nombreCompleto = $nombreUsuario . ' ' . $apellidoUsuario;

// Verifica datos del cuerpo
$datos = json_decode(file_get_contents('php://input'), true);
if (!$datos) {
    echo json_encode(['status' => 'error', 'message' => 'No se recibieron datos válidos']);
    exit();
}

// Obtiene conexión a la base de datos
$database = new Database();
$conn = $database->getConnection();

// Guarda el código en la base de datos con expiración de 5 minutos
try {
    $stmt = $conn->prepare("INSERT INTO codigos_verificacion (correo, codigo, expiracion) VALUES (?, ?, ?)");
    $expiracion = date('Y-m-d H:i:s', strtotime('+5 minutes'));
    $stmt->execute([$emailUsuario, $codigo, $expiracion]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar el código en la base de datos']);
    exit();
}

// Enviar correo con PHPMailer
try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'prueba.verif14@gmail.com';
    $mail->Password   = 'TU_CONTRASENIA_AQUI'; // ¡MUY IMPORTANTE protegerla!
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
    echo json_encode(['status' => 'success', 'message' => 'Correo enviado correctamente']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => "Error al enviar el correo: {$mail->ErrorInfo}"]);
}
