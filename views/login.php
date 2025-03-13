<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="../public/css/login.css">

</head>
<body>
    <div class="container" id = "main">
        <div class="sign-up">
            <form action="../controllers/authController.php" method="post" id="SignUpForm">
                <h1>Create Acount</h1>
                <div class="social-container">
                    <a href="#" class="social"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="social"><i class="fab fa-x"></i></a>
                    <a href="#" class="social"><i class="fab fa-google"></i></a>
                </div>
                <p>or use your email for registration</p>
                <div class="input-group">
                    <input type="" id="name" name="name" placeholder="Nombre" required>
                    <input ttextype="text" id="last_name" name="last_name" placeholder="Apellido" required>
                </div>
                <!-- contenedor para el correo-->
                <div class="signUp_email_container">
                    <input type="email" id="correo" name="correo" placeholder="Email" required>
                    <i class="fa-regular fa-envelope" id="icon_email_signUp"></i><!--icono de email-->
                </div>
                
                <!-- contenedor para la contraseña-->
                <div class="passContainer">
                    <input type="password" id="password" name="password" placeholder="Contraseña" required>
                    <i class="fa-regular fa-eye" id="password-icon"></i> 
                </div>

                <!-- contenedor para confirmar la contraseña-->
                <div class="passConfirmContainer">
                    <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirmar Contraseña" required>
                    <i class="fa-regular fa-eye" id="confirm-password-icon"></i> 
                </div>      
                <button type="submit" name="registrar">Sign Up</button>
            </form>
        </div>
        <div class="sign-in">
            <form action="../controllers/authController.php" method="post">
                <h1>Sign In</h1>

                <!-- contenedor para las redes sociales-->
                <div class="social-container">
                    <a href="#" class="social"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="social"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="#" class="social"><i class="fab fa-google"></i></a>
                </div>
                <p>or use your account</p>

                <!-- contenedero para el correo-->
                <div class="signIn_Email_Container">
                    <input type="email" name="Email" placeholder="Email" required="">
                    <i class="fa-regular fa-envelope" id="icon_email"></i><!--icono de email-->
                </div>

                <!-- contenedor para la contraseña-->
                <div class="signInPassContainer">
                    <input type="password" id="signInpass" name="Password" placeholder="Password" required="">
                    <i class="fa-regular fa-eye" id="iconSignIn"></i> <!--icono de contraseña-->
                </div>
                <a href="#"> Forget your password?</a>
                <button type="submit" name="signInBtn" >Sign In</button>
            </form>
        </div>
        <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>To keep connected with us please login with your personal info</p>
                    <button id="signIn">Sign In</button>
                </div>
                <div class="overlay-right">
                    <h1>Hello Friend</h1>
                    <p>Enter your personal details and start journey with us</p>
                    <button id="signUp">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
    <script src="../public/js/loginScript.js"></script>
</body>
</html>