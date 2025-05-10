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
    contenedorJuego.style.display = 'none';
    pantallaPrevia.style.display = 'flex'; // Mostrar fondo y botón

    // Solo iniciar si aún no existe
    if (!game) {
      iniciarJuego();
    }
  }
}
document.getElementById('btnPantallaCompleta').addEventListener('click', () => {
    const body = document.documentElement;
  
    const pantallaPrevia = document.getElementById('pantalla-previa');
    const contenedorJuego = document.getElementById('container');
  
    // 1. Solicitar pantalla completa
    const pantallaCompleta =
      body.requestFullscreen?.() ||
      body.webkitRequestFullscreen?.() ||
      body.msRequestFullscreen?.();
  
    // 2. Solo si fue exitoso, esperar a que realmente esté en fullscreen
    if (pantallaCompleta) {
      pantallaCompleta.then(() => {
        pantallaPrevia.style.display = 'none';
        contenedorJuego.style.display = 'block';
  
        if (!game) {
          iniciarJuego();
        }
      });
    }
  });
  


