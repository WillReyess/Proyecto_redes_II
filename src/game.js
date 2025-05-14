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
  window.location.href = 'index.php'; // cambiar
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
  /*
  const enPantallaCompleta =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

   if (enPantallaCompleta) {
    if (usuarioSalioDeFullscreen) {
      // Evitamos volver a entrar al juego desde fullscreen
      contenedorJuego.style.display = 'none';
      pantallaPrevia.style.display = 'flex';

      botonPantalla.innerText = 'Regresar a la ruleta 🎯';
      botonPantalla.classList.add('redirigir');
      botonPantalla.onclick = redirigirARuleta;

      return;
    } 
      */

    pantallaPrevia.style.display = 'none';
    contenedorJuego.style.display = 'block';

    if (!game && !juegoYaIniciado) {
      iniciarJuego();
      juegoYaIniciado = true;

      setTimeout(() => {
        game.scale.resize(innerWidth, innerHeight); 
      }, 200);
    }

   else {
    // Usuario ha salido de fullscreen una vez (ya no podrá regresar)
    if (juegoYaIniciado && !usuarioSalioDeFullscreen) {
      usuarioSalioDeFullscreen = true;

      // Mostramos botón de redirigir desde ya
      pantallaPrevia.style.display = 'flex';
      contenedorJuego.style.display = 'none';

      botonPantalla.innerText = 'Regresar a la ruleta 🎮🥵';
      botonPantalla.classList.add('redirigir');
      botonPantalla.classList.add('animado'); // estilo del boton , clase en gameStyle.css
      botonPantalla.onclick = redirigirARuleta;
    } else {
      // Usuario salió por segunda vez, o antes de iniciar
      pantallaPrevia.style.display = 'flex';
      contenedorJuego.style.display = 'none';
    }
  }
});



    


