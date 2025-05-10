export default class Fondo {
    constructor(escena) {
        // Guarda referencia a la escena de Phaser
        this.escena = escena;

        // Este será el cuerpo físico del suelo
        this.cuerpoSuelo = null;
    }

    // Cargamos recursos de imágenes
    preCargar() {
        this.escena.load.image('fondo1', './assets/FondoB.png');
        this.escena.load.image('suelo1', './assets/suelo1.png');
    }

    // Aquí se crean los sprites y cuerpos físicos
    crear() {
        // Fondo infinito para que se vea "desplazándose"
        this.imagenFondo = this.escena.add.tileSprite(
            0,
            0,
            4000,
            this.escena.scale.height,
            'fondo1'
        ).setOrigin(0, 0);
        this.imagenFondo.setScrollFactor(0);

        // Suelo también como un tileSprite
        this.suelo = this.escena.add.tileSprite(
            0,
            this.escena.scale.height - 70,
            4000,
            70,
            'suelo1'
        ).setOrigin(0, 0);
        this.suelo.setScrollFactor(0);

        // Convertimos el sprite del suelo a un cuerpo estático de Phaser
        this.escena.physics.add.existing(this.suelo, true);
        this.cuerpoSuelo = this.suelo.body;
        // Ajustamos tamaño y posición del colisionador
        this.cuerpoSuelo.setSize(999999, 70);
        this.cuerpoSuelo.setOffset(0, 0);
    }

    // Se llama en cada frame para actualizar la posición de fondo y suelo
    actualizar(desplazamientoX) {
        // El fondo se mueve más lento que el suelo para generar efecto de parallax
        this.imagenFondo.tilePositionX = desplazamientoX * 0.5;
        this.suelo.tilePositionX = desplazamientoX;
    }
}
