import EscenaJuego from './GameScene.js';

let game = null;

function esDispositivoMovil() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function iniciarJuego() {
  const config = {
    type: Phaser.AUTO,
    parent: 'container',    
    width: innerWidth,
    height: innerHeight,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: innerHeight * 1.0 }, // Gravedad en porcentaje de la altura de la pantalla
        debug: false
      }
    },
    scene: [EscenaJuego],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  game = new Phaser.Game(config);
}

// Detectar al cargar y al girar
window.addEventListener('load', verificarOrientacion);
window.addEventListener('resize', verificarOrientacion);


function verificarOrientacion() {
  const esVertical = window.innerHeight > window.innerWidth;
  const advertencia = document.getElementById('advertencia-orientacion');
  const contenedorJuego = document.getElementById('container');
  const pantallaPrevia = document.getElementById('pantalla-previa');

  const estaEnFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;


  if (esDispositivoMovil() && esVertical) {
    // Mostrar mensaje y ocultar contenedor
    advertencia.style.display = 'flex';
    contenedorJuego.style.display = 'none';
    pantallaPrevia.style.display = 'none'; // Ocultar pantalla previa

    // Si el juego ya se creó por error, lo destruimos
    if (game) {
      game.destroy(true);
      game = null;
    }
  } else {
    // Ocultar advertencia y mostrar contenedor
    advertencia.style.display = 'none';

    if (!estaEnFullscreen){
      contenedorJuego.style.display = 'none'; // Ocultar contenedor del juego
      pantallaPrevia.style.display = 'flex'; // Mostrar pantalla previa
      botonPantalla.classList.add('animado'); 
      void botonPantalla.offsetWidth; // Reset visual
      botonPantalla.classList.add('animado');
    }

  }
}

let juegoYaIniciado = false;
let usuarioSalioDeFullscreen = false;

const botonPantalla = document.getElementById('btnPantallaCompleta');
const contenedorJuego = document.getElementById('container');
const pantallaPrevia = document.getElementById('pantalla-previa');

// Función para redirigir a la ruleta
function redirigirARuleta() {
  window.location.href = `${location.origin}/Proyecto_redes_II/views/wheel.php`;
}

// Btn pantalla completa solo funciona si no se ha salido aun
botonPantalla.addEventListener('click', () => {
  if (usuarioSalioDeFullscreen) {
    redirigirARuleta(); // no se permite volver al juego
    return;
  }

  const pantallaCompleta =
    contenedorJuego.requestFullscreen?.() ||
    contenedorJuego.webkitRequestFullscreen?.() ||
    contenedorJuego.msRequestFullscreen?.();

  if (!pantallaCompleta) {
    alert("El navegador no soporta pantalla completa.");
  }
});

// Cambios al entrar o salir del fullscreen
document.addEventListener('fullscreenchange', () => {
  const enPantallaCompleta =
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.msFullscreenElement;

  if (enPantallaCompleta) {
    // Entraron a pantalla completa
    pantallaPrevia.style.display = 'none';
    contenedorJuego.style.display = 'block';

    if (!game && !juegoYaIniciado) {
      iniciarJuego();
      juegoYaIniciado = true;

      setTimeout(() => {
        game.scale.resize(innerWidth, innerHeight);
      }, 200);
    }
  } else {
    // Salieron de pantalla completa
    if (juegoYaIniciado && !usuarioSalioDeFullscreen) {
      usuarioSalioDeFullscreen = true;

      // Redirige a la ruleta si es la primera vez que salen
      redirigirARuleta();
    } else {
      // Ya habían salido antes o no iniciaron el juego
      pantallaPrevia.style.display = 'flex';
      contenedorJuego.style.display = 'none';
    }
  }
});




    


