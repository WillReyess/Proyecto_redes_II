export default class Fondo {
    constructor(escena) {
        // Guarda referencia a la escena de Phaser
        this.escena = escena;

        // Este sera el cuerpo físico del suelo
        this.cuerpoSuelo = null;
    }
/*
    // recursos de imagenes
    preCargar() {
        this.escena.load.image('fondo1', './assets/FondoB2.png');
        this.escena.load.image('suelo1', './assets/suelo1.png');
    } */

    // se crean los sprites y cuerpos físicos
crear() {
    const altoPantalla  = this.escena.scale.height;
    const anchoPantalla = this.escena.scale.width;

    // Fondo visual
    const texturaFondo  = this.escena.textures.get('fondo1').getSourceImage();
    const factorEscala  = altoPantalla / texturaFondo.height;

    this.imagenFondo = this.escena.add.tileSprite(
        0, 0,
        anchoPantalla,
        altoPantalla,
        'fondo1'
    ).setOrigin(0, 0).setScrollFactor(0);

    this.imagenFondo.tileScaleX = factorEscala;
    this.imagenFondo.tileScaleY = factorEscala;

    // --- Suelo ---
    const texSuelo    = this.escena.textures.get('suelo1').getSourceImage();
    const FACTOR_ALTURA = 0.10;
    const altoSuelo     = altoPantalla * FACTOR_ALTURA;
    const scaleSuelo    = altoSuelo / texSuelo.height;

    const anchoVisual = anchoPantalla * 20; // cubrir desplazamiento horizontal

    this.suelo = this.escena.add.tileSprite(
        0,
        altoPantalla - altoSuelo,
        anchoVisual,
        altoSuelo,
        'suelo1'
    ).setOrigin(0).setScrollFactor(0);

    this.suelo.tileScaleX = scaleSuelo;
    this.suelo.tileScaleY = scaleSuelo;

    // Cuerpo físico amplio
    this.escena.physics.add.existing(this.suelo, true);
    this.cuerpoSuelo = this.suelo.body;

    // Tamaño físico mayor que el visible
    this.cuerpoSuelo.setSize(anchoVisual, altoSuelo);
    this.cuerpoSuelo.setOffset(0, 0);
}


    // se llama en cada frame para actualizar la posición de fondo y suelo
    actualizar(desplazamientoX) {
        // el fondo se mueve mas lento que el suelo para generar efecto de parallax o profundidad :)
        this.imagenFondo.tilePositionX = desplazamientoX * 0.5;
        this.suelo.tilePositionX = desplazamientoX;
    }
}
