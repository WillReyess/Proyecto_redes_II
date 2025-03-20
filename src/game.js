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
    scene: [EscenaJuego]
};

// Se crea la instancia de Phaser con nuestra configuración
new Phaser.Game(config);


