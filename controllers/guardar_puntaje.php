<?php
session_start();
header('Content-Type: application/json');

require_once '../config/dataBase.php';

$database = new Database();
$conn = $database->getConnection();

try {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'No se encontró el ID del jugador en la sesión']);
        exit();
    }

    $idJugador = $_SESSION['user_id'];

    $datos = json_decode(file_get_contents('php://input'), true);

    if (!$datos) {
        echo json_encode([
            'status' => 'error',
            'message' => 'No se recibieron datos válidos'
        ]);
        exit();
    }

    if (isset($datos['puntaje'], $datos['tiempo'])) {
        $puntaje = $conn->real_escape_string($datos['puntaje']);
        $tiempo = $conn->real_escape_string($datos['tiempo']);

        $query = "INSERT INTO scores (player_id, score, tiempo_jugado) VALUES ('$idJugador', '$puntaje', '$tiempo')";
        if ($conn->query($query) === TRUE) {
            echo json_encode(['status' => 'success', 'message' => 'Puntaje guardado correctamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al guardar puntaje: ' . $conn->error]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    $conn->close();
}
