import EscenaRuleta from './WheelScene.js';
import EscenaJuego from './GameScene.js';

// Ajustes para el tamaño del lienzo
const anchoJuego = 800;
const altoJuego = 800;

// Configuración de Phaser
const config = {
    type: Phaser.AUTO,
    width: anchoJuego,
    height: altoJuego,
    parent: 'container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [EscenaRuleta, EscenaJuego]
};

// Se crea la instancia de Phaser con nuestra configuración
new Phaser.Game(config);

/*
   Comentarios casuales que podrías eliminar o modificar:

   this.tomate.anims.play('tomato_atlas_walk');

   // Cómo pausar y continuar la animación
   setTimeout(() => {
       this.tomate.anims.pause();
   }, 2000);

   setTimeout(() => {
       this.tomate.anims.resume();
   }, 4000);

   // Detener completamente la animación
   setTimeout(() => {
       this.tomate.anims.stop();
   }, 6000);

*/





