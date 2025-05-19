<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../index.php?mensaje=acceso_denegado");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ruleta de la Suerte</title>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

  <!-- Estilos -->
  <link rel="stylesheet" href="../public/css/wheelStyle.css" />
  <link rel="stylesheet" href="./public/css/messages.css" />
</head>

<body>

  <!-- Imágenes decorativas -->
  <img src="../assets/imagen_izquierda-removed.png" alt="Decoración izquierda" class="izquierda" />
  <img src="../assets/imagen_derecha-removed.png" alt="Decoración derecha" class="derecha" />

  <!-- Contenedor de la ruleta -->
  <div class="wrapper">
    <div class="container">
      <canvas id="wheel"></canvas>
      <button id="spin-btn" aria-label="Girar la ruleta">Spin</button>
      <img src="../assets/Arrow-PNG-Picture.png" alt="Flecha ruleta" />
    </div>
    <div id="final-value">
      <p>Haga click en el botón para iniciar</p>
    </div>
  </div>

  <!-- Menú lateral -->
  <nav class="menu" aria-label="Menú lateral">
    <ul class="menu-content">
      <li><a href="#"><span class="material-symbols-outlined">home</span><span>Home</span></a></li>
      <li><a href="../views/dashboard_ranking.html"><span class="material-symbols-outlined">dashboard</span><span>Dashboard</span></a></li>
      <li><a href="#"><span class="material-symbols-outlined">history</span><span>Historial del Juego</span></a></li>
      <li><a href="#"><span class="material-symbols-outlined">group_add</span><span>Invitar Amigos</span></a></li>
      <li><a href="#"><span class="material-symbols-outlined">person</span><span>Cuenta</span></a></li>
      <li><a href="../controllers/authController.php?logout=true"><span class="material-symbols-outlined">logout</span><span>Logout</span></a></li>
    </ul>
  </nav>

  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-datalabels/2.1.0/chartjs-plugin-datalabels.min.js"></script>
  <script src="../public/js/wheelScript.js"></script>
  <script src="./public/js/formulario_scripts.js"></script>

</body>
</html>
