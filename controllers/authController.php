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
        $query = "INSERT INTO players (Nombre, Apellido, Correo, Password) VALUES ('$name', '$lastName', '$email', '$password')";

        if ($this->conn->query($query)) {
            session_start();

            $_SESSION['Correo'] = $email; // Guardar el correo en la sesión para usarlo en la verificación
            $_SESSION['Nombre'] = $name; // Guardar el nombre en la sesión para enviar el correo de activación
            $_SESSION['Apellido'] = $lastName; // Guardar el apellido en la sesión para eviar el correo de activación

            header("Location: http://localhost/proyecto_redes_II/views/verification.php");
            exit();
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
            if (password_verify($password, $user['Password'])) {

                session_start();
                $_SESSION['user_id'] = $user['player_id']; // se guarda el id para poder usarlo al guardar el puntaje
            
                //redirije al usuario a la pagina principal
                header("Location: ../views/wheel.html");
                
                exit();
            } else {
                header("Location: http://localhost/Proyecto_redes_II/views/login.php?error=Contraseña incorrecta");
                exit();
            }
        } else {
            header("Location: http://localhost/Proyecto_redes_II/views/login.php?error=Usuario no encontrado");
            exit(); 
        }
    }
    
    //medoto para cerrar sesion
    public function logout() {
        session_start();
        session_unset(); // Elimina todas las variables de sesión
        session_destroy(); // Destruye la sesión
        header("Location: http://localhost/Proyecto_redes_II/index.php"); // Redirige al usuario a la página de login
        exit();
    }
}

///funcion para enmascarar el correo
function enmascararCorreo($correo) {
    //se calcula la posicion del @
    $posArroba = strpos($correo, '@');
    if ($posArroba !== false) {
        $primerasDosLetras = substr($correo, 0, 2); // Primeras dos letras
        $dominio = substr($correo, $posArroba); // Dominio completo
        return $primerasDosLetras . '*****' . $dominio; // Enmascarar el resto
    }
    return $correo; // Si no se encuentra el @, devolver el correo original
}

// Verificar si se ha enviado el formulario de registro o login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['registrar'])) {
        // Recibir los datos del formulario de registro
        $name = $_POST['name'];
        $lastName = $_POST['last_name'];
        $email = $_POST['correo'];
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
}elseif (isset($_GET['logout'])) {
    // Crear instancia de AuthController y llamar al método logout
    $auth = new AuthController();
    $auth->logout();
}
?>
