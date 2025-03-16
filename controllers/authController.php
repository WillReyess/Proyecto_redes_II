<?php
require_once '../config/database.php';

class AuthController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Método de registro
    public function register($name, $lastName, $email, $password, $confirm_password) {
        if ($password !== $confirm_password) {
            return "Error: Las contraseñas no coinciden";
        }

        // Limpiar datos
        $name = $this->conn->real_escape_string($name);
        $lastName = $this->conn->real_escape_string($lastName);
        $email = $this->conn->real_escape_string($email);
        $password = password_hash($this->conn->real_escape_string($password), PASSWORD_DEFAULT);

        // Insertar los datos del nuevo usuario en la base de datos
        $query = "INSERT INTO players (Nombre, Apellido, Correo, Contraseña) VALUES ('$name', '$lastName', '$email', '$password')";

        if ($this->conn->query($query)) {
            return "Registro exitoso";
        } else {
            return "Error al registrar usuario: " . $this->conn->error;
        }
    }

    // Método de login
    public function login($email, $password) {
        $email = $this->conn->real_escape_string($email);
        $query = "SELECT * FROM players WHERE Correo = '$email' LIMIT 1";
        $result = $this->conn->query($query);

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Verificar la contraseña
            if (password_verify($password, $user['Contraseña'])) {
                
                //redirije al usuario a la pagina principal
                header("Location: ../game.php");
                exit();
            } else {
                header("Location: ../views/login.php?error=Contraseña incorrecta");
                exit();
            }
        } else {
            header("Location: ../views/login.php?error=Usuario no encontrado");
            exit(); 
        }
    }
}

// Verificar si se ha enviado el formulario de registro o login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['registrar'])) {
        // Recibir los datos del formulario de registro
        $name = $_POST['name'];
        $lastName = $_POST['last_name'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        // Crear instancia de AuthController y llamar al método register
        $auth = new AuthController();
        $result = $auth->register($name, $lastName, $email, $password, $confirm_password);
        echo $result;
    } elseif (isset($_POST['signInBtn'])) {
        // Recibir los datos del formulario de login
        $email = $_POST['Email'];
        $password = $_POST['Password'];

        // Crear instancia de AuthController y llamar al método login
        $auth = new AuthController();
        $result = $auth->login($email, $password);
        echo $result;
    }
}
?>
