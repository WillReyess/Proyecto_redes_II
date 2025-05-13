<?php

require_once '../config/database.php';

// Función para generar un código de verificación aleatorio de 6 dígitos
function generarCodigo() {
    return random_int(100000, 999999); // Genera un código de 6 dígitos
}

function compararPass($pass, $confirmPass) {
    if ($pass !== $confirmPass) {
        header("Location: ../index.php?mensaje=contrasenas_no_coinciden");
        exit();
    }
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
        compararPass($password, $confirm_password);

        session_start();

        // Limpiar datos (para prevenir inyecciones SQL)
        $name = $this->conn->real_escape_string($name);
        $lastName = $this->conn->real_escape_string($lastName);
        $email = $this->conn->real_escape_string($email);
        $password = password_hash($password, PASSWORD_DEFAULT); // Se aplica hash a la contraseña

        // Inserción en la base de datos usando sentencia preparada
        $query = "INSERT INTO players (Nombre, Apellido, Correo, Password) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssss", $name, $lastName, $email, $password); // 'ssss' indica que son 4 parámetros de tipo string
        $stmt->execute();

        $_SESSION['tipo_verificacion'] = 'registro'; // Tipo de verificación para manejar el flujo posterior

        if ($stmt->affected_rows > 0) {
            //se obtiene el ID del jugador recién registrado
            $idJugador = $this->conn->insert_id; // Esto obtiene el ID generado automáticamente

            // Guardamos los datos del usuario en la sesión para continuar el flujo
            $_SESSION['Correo'] = $email;
            $_SESSION['Nombre'] = $name;
            $_SESSION['Apellido'] = $lastName;
            $_SESSION['user_id'] = $idJugador;

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
        $email = trim($email);

        // Preparar la consulta con sentencia preparada
        $query = "SELECT * FROM players WHERE Correo = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $email); // 's' indica que es un parámetro de tipo string
        $stmt->execute();
        $result = $stmt->get_result();
        session_start();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Verificar si el usuario está activo
            if ($user['activa'] == 0) {
                header("Location: ../index.php?mensaje=Usuario_no_verificado");
                exit();
            }

            // Verificar la contraseña ingresada
            if (password_verify($password, $user['Password'])) {
                // Guardar la sesión con el ID del usuario
                $_SESSION['user_id'] = $user['player_id'];
                header("Location: ../views/wheel.html"); 
                exit();
            } else {
                header("Location: ../index.php?mensaje=contrasena_incorrecta");
                exit();
            }
        } else {
            header("Location: ../index.php?mensaje=Usuario_no_encontrado");
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
        session_start();
        if (isset($_SESSION['Correo'])) {
            // Generar nuevo código y reenviarlo
            $codigo = generarCodigo();
            $_SESSION['codigo_verificacion'] = $codigo;
            $_SESSION['codigo_expiracion'] = time() + 300;

            $resultadoEnvio = enviarCorreoDeVerificacion(
                $_SESSION['Correo'],
                $_SESSION['Nombre'],
                $_SESSION['Apellido'],
                $codigo
            );

            if ($resultadoEnvio['status'] === 'success') {
                header("Location: ../views/verification.php?mensaje=correo_reenviado_correctamente");
            } else {
                header("Location: ../views/verification.php?mensaje=error_reenviar_codigo");
            }
            exit();
        } else {
            header("Location: ../views/verification.php?mensaje=sesion_invalida");
        }
    }

    // Verificación de código ingresado
    elseif (isset($_POST['verificar'])) {
        session_start();
        if (!isset($_POST['codigo'], $_SESSION['codigo_verificacion'], $_SESSION['codigo_expiracion'])) {
            header("Location: ../views/verification.php?mensaje=codigo_no_enviado/sesion_invalida");
            exit();
        }
        
        if (time() > $_SESSION['codigo_expiracion']) {
            header("Location ../views/verification.php?mensaje=codigo_expirado");
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
                $query = "UPDATE players SET activa = 1 WHERE Correo = ?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("s", $email);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    header("Location: ../views/wheel.html");
                    exit();
                } else {
                    header("Location: ../views/verification.php?mensaje=error_activar_cuenta");
                    exit();
                }
            } 
            // Recuperación de contraseña
            elseif ($_SESSION['tipo_verificacion'] === 'recuperacion') {
                header("Location: ../views/nueva_contraseña.php");
                exit();
            }
        } else {
            header("Location: ../views/verification.php?mensaje=codigo_incorrecto");
        }
    }
    // Si el usuario decide volver a la página de login
    elseif (isset($_POST['volver'])) {
        session_unset(); 
        session_destroy(); 
        header("Location: ../index.php"); 
        exit();
    } 
    // Enviar código para recuperación de contraseña
    elseif (isset($_POST['enviar_codigo'])) {
        session_start();

        $_SESSION['tipo_verificacion'] = 'recuperacion';
        $database = new Database();
        $conn = $database->getConnection();

        $email = trim($_POST['email']);
        
        $stmt = $conn->prepare("SELECT * FROM players WHERE Correo = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

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
                header("Location: ../views/restablecer_pass.php?mensaje=error_enviar_codigo");
                exit();
            }
        } else {
            header("Location: ../views/restablecer_pass.php?mensaje=correo_no_encontrado");
            exit();
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

        compararPass($password, $confirm);

        $database = new Database();
        $conn = $database->getConnection();

        $email = trim($_POST['email']); 
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $query = "UPDATE players SET Password = ? WHERE Correo = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $hashedPassword, $email); // 'ss' indica que son dos parámetros de tipo string
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
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
