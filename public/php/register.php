<?php
require_once '../../controllers/AuthController.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['registrar'])) {
    $auth = new AuthController();
    $mensaje = $auth->register($_POST['name'], $_POST['last_name'], $_POST['email'], $_POST['password'], $_POST['confirm_password']);

    echo $mensaje;
}
?>
