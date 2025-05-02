<?php

function generarCodigo() {
    // Generar un código de 6 dígitos
    $codigo = random_int(100000, 999999);
    
    // Guardar el código en la sesión para su verificación posterior
    session_start();
    $_SESSION['codigo'] = $codigo;
    
    return $codigo;
}

?>