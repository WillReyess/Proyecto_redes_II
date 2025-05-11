<?php

require_once '../config/database.php';

// Función para generar un código de verificación aleatorio de 6 dígitos
function generarCodigo() {
    return random_int(100000, 999999); // Genera un código de 6 dígitos
}

class AuthController {
    private $conn;

    // Constructor que crea la conexión a la base de datos
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Método de registro de nuevo usuario
    public function register($name, $lastName, $email, $password, $confirm_password) {
        // Verifica si las contraseñas coinciden
        if ($password !== $confirm_password) {
            return "Error: Las contraseñas no coinciden";
        }
        session_start();

        // Limpiar datos (para prevenir inyecciones SQL)
        $name = $this->conn->real_escape_string($name);
        $lastName = $this->conn->real_escape_string($lastName);
        $email = $this->conn->real_escape_string($email);
        $password = password_hash($password, PASSWORD_DEFAULT); // Se aplica hash a la contraseña

        // Inserción en la base de datos
        $query = "INSERT INTO players (Nombre, Apellido, Correo, Password) VALUES ('$name', '$lastName', '$email', '$password')";

        $_SESSION['tipo_verificacion'] = 'registro'; // Tipo de verificación para manejar el flujo posterior

        if ($this->conn->query($query)) {
            // Guardamos los datos del usuario en la sesión para continuar el flujo
            $_SESSION['Correo'] = $email;
            $_SESSION['Nombre'] = $name;
            $_SESSION['Apellido'] = $lastName;

            // Generar y almacenar un código de verificación
            $codigo = generarCodigo();
            $_SESSION['codigo_verificacion'] = $codigo;
            $_SESSION['codigo_expiracion'] = time() + 300; // Código válido por 5 minutos

            // Llamada a la función para enviar el correo de verificación
            require_once './mailSender.php';
            $resultadoEnvio = enviarCorreoDeVerificacion($email, $name, $lastName, $codigo);

            if ($resultadoEnvio['status'] === 'success') {
                // Redirigir al usuario a la página de verificación
                header("Location: ../views/verification.php");
                exit();
            } else {
                return "Error al enviar el correo de verificación: " . $resultadoEnvio['message'];
            }
        } else {
            return "Error al registrar usuario: " . $this->conn->error;
        }
    }

    // Método de login para un usuario registrado
    public function login($email, $password) {
        // Limpiar datos (para prevenir inyecciones SQL)
        $email = $this->conn->real_escape_string($email);
        $query = "SELECT * FROM players WHERE Correo = '$email' LIMIT 1";
        $result = $this->conn->query($query);
        session_start();


        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Verificar si el usuario está activo
            if ($user['activa'] == 0) {
                header("Location: ../views/login.php?error=Usuario no verificado");
                exit();
            }

            // Verificar la contraseña ingresada
            if (password_verify($password, $user['Password'])) {
                // Guardar la sesión con el ID del usuario
                $_SESSION['user_id'] = $user['player_id'];
                header("Location: ../views/wheel.html"); // Redirigir al usuario a la página de bienvenida
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

    // Método para cerrar sesión
    public function logout() {
        session_start();
        session_unset(); // Elimina todas las variables de sesión
        session_destroy(); // Destruye la sesión
        header("Location: ../index.php"); // Redirige al usuario a la página de login
        exit();
    }
}

// Función para enmascarar el correo
function enmascararCorreo($correo) {
    $posArroba = strpos($correo, '@');
    if ($posArroba !== false) {
        $primerasDosLetras = substr($correo, 0, 2);
        $dominio = substr($correo, $posArroba);
        return $primerasDosLetras . '*****' . $dominio;
    }
    return $correo;
}

// Verificar si se ha enviado el formulario de registro o login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $auth = new AuthController();

    // Registro de usuario
    if (isset($_POST['registrar'])) {
        $result = $auth->register($_POST['name'], $_POST['last_name'], $_POST['correo'], $_POST['password'], $_POST['confirm_password']);
        echo $result;
    } 
    // Login de usuario
    elseif (isset($_POST['signInBtn'])) {
        $result = $auth->login($_POST['Email'], $_POST['Password']);
        echo $result;
    }
} 
// Cerrar sesión
elseif (isset($_GET['logout'])) {
    $auth = new AuthController();
    $auth->logout();
}

// Proceso de verificación de cuenta / reenvío de código
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once './mailSender.php';


    // Reenvío de código de verificación
    if (isset($_POST['reenviar'])) {
        if (isset($_SESSION['Correo'])) {
            session_start();
            // Generar nuevo código y reenviarlo
            $codigo = generarCodigo();
            $_SESSION['codigo_verificacion'] = $codigo;
            $_SESSION['codigo_expiracion'] = time() + 300;

            $resultadoEnvio = enviarCorreoDeVerificacion($_SESSION['Correo'], $_SESSION['Nombre'], $_SESSION['Apellido'], $codigo);

            echo $resultadoEnvio['status'] === 'success' ? "Correo reenviado correctamente" : "Error al reenviar el correo: " . $resultadoEnvio['message'];
        } else {
            echo "Error: No se ha encontrado el correo en la sesión.";
        }
    } 
    // Verificación de código ingresado
    elseif (isset($_POST['verificar'])) {
        session_start();
        if (!isset($_POST['codigo'], $_SESSION['codigo_verificacion'], $_SESSION['codigo_expiracion'])) {
            echo "Error: Código no enviado o sesión inválida.";
            exit();
        }
        

        if (time() > $_SESSION['codigo_expiracion']) {
            echo "Error: El código ha expirado. Solicita uno nuevo.";
            exit();
        }

        $codigoIngresado = implode('', $_POST['codigo']);

        if ($codigoIngresado == $_SESSION['codigo_verificacion']) {
            unset($_SESSION['codigo_verificacion'], $_SESSION['codigo_expiracion']); // Limpiar el código

            $database = new Database();
            $conn = $database->getConnection();
            $email = $conn->real_escape_string($_SESSION["Correo"]);

            // Activación de cuenta
            if ($_SESSION['tipo_verificacion'] === 'registro') {
                $query = "UPDATE players SET activa = 1 WHERE Correo = '$email'";
                if ($conn->query($query)) {
                    header("Location: ../views/wheel.html");
                    exit();
                } else {
                    echo "Error al activar cuenta: " . $conn->error;
                }
            } 
            // Recuperación de contraseña
            elseif ($_SESSION['tipo_verificacion'] === 'recuperacion') {
                header("Location: ../views/nueva_contraseña.php");
                exit();
            }
        } else {
            echo "Código incorrecto.";
        }
    } 
    // Si el usuario decide volver a la página de login
    elseif (isset($_POST['volver'])) {
        session_unset(); // Limpiar sesión
        session_destroy(); // Destruir sesión
        header("Location: ../index.php"); // Redirigir al login
        exit();
    } 
    // Enviar código para recuperación de contraseña
    elseif (isset($_POST['enviar_codigo'])) {

        session_start();

        $_SESSION['tipo_verificacion'] = 'recuperacion';
        $database = new Database();
        $conn = $database->getConnection();
        $email = $conn->real_escape_string($_POST['email']);
        $query = "SELECT * FROM players WHERE Correo = '$email' LIMIT 1";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            $codigo = generarCodigo();
            $_SESSION['codigo_verificacion'] = $codigo;
            $_SESSION['codigo_expiracion'] = time() + 300;
            $_SESSION['Correo'] = $email;
            $_SESSION['Nombre'] = $user['Nombre'];
            $_SESSION['Apellido'] = $user['Apellido'];

            $resultadoEnvio = enviarCorreoDeVerificacion($email, $user['Nombre'], $user['Apellido'], $codigo);

            if ($resultadoEnvio['status'] === 'success') {
                header("Location: ../views/verification.php");
                exit();
            } else {
                echo "Error al enviar el código: " . $resultadoEnvio['message'];
            }
        } else {
            echo "Correo no registrado en el sistema.";
        }
    } 
    // Cambio de contraseña
    elseif (isset($_POST['cambiar_password'])) {
        session_start();
        if (!isset($_SESSION['Correo'])) {
            echo "Sesión expirada o inválida.";
            exit();
        }

        $password = $_POST['new_password'];
        $confirm = $_POST['confirm_password'];

        if ($password !== $confirm) {
            echo "Las contraseñas no coinciden.";
            exit();
        }

        $database = new Database();
        $conn = $database->getConnection();
        $email = $conn->real_escape_string($_SESSION['Correo']);
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $query = "UPDATE players SET Password = '$hashedPassword' WHERE Correo = '$email'";

        if ($conn->query($query)) {
            session_unset(); // Limpiar sesión
            session_destroy(); // Destruir sesión
            header("Location: ../index.php?mensaje=contrasena_actualizada");
            exit();
        } else {
            echo "Error al actualizar la contraseña: " . $conn->error;
        }
    }
}
?>
