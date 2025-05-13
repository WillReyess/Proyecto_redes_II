export default class Fondo {
    constructor(escena) {
        // Guarda referencia a la escena de Phaser
        this.escena = escena;

        // Este sera el cuerpo físico del suelo
        this.cuerpoSuelo = null;
    }

    // recursos de imagenes
    preCargar() {
        this.escena.load.image('fondo1', './assets/FondoB.png');
        this.escena.load.image('suelo1', './assets/suelo1.png');
    }

    // se crean los sprites y cuerpos físicos
    crear () {
        const altoPantalla  = this.escena.scale.height;
        const anchoPantalla = this.escena.scale.width;
    
        // medir la imagen original
        const texturaFondo  = this.escena.textures.get('fondo1').getSourceImage();
        const factorEscala  = altoPantalla / texturaFondo.height;   // ajusta solo a la altura
    
        // area que se va a cubrir (puede ser tan ancha como la cámara)
        this.imagenFondo = this.escena.add.tileSprite(
            0, 0,
            anchoPantalla,     // rectángulo a cubrir
            altoPantalla,
            'fondo1'
        )
        .setOrigin(0, 0)
        .setScrollFactor(0);
    
        //  Escalar la textura sin distorsionarla
        this.imagenFondo.tileScaleX = factorEscala;   // mantiene proporción
        this.imagenFondo.tileScaleY = factorEscala;   // encaja exactamente la altura
    /*-------------------------------------------------------------------------------------

        --- suelo ---    
        /* --------medir la textura del suelo ---------- */
        const texSuelo    = this.escena.textures.get('suelo1').getSourceImage();
    
        /* ---- Elegir como se quiere dimensionar ---------- */
        // suelo ocupa cierto % de la altura visible
        const FACTOR_ALTURA = 0.10;              // % de la pantalla
        const altoSuelo     = altoPantalla * FACTOR_ALTURA;
        const scaleSuelo    = altoSuelo / texSuelo.height;
    
        // mantener la altura original y escalar solo para cubrir el ancho
        // const scaleSuelo = anchoPantalla / texSuelo.width;
        // const altoSuelo  = texSuelo.height * scaleSuelo;
    
        // crear el tileSprite
        this.suelo = this.escena.add.tileSprite(
            0,
            altoPantalla - altoSuelo,   // pegado abajo
            anchoPantalla,              // se amplía solo horizontalmente
            altoSuelo,
            'suelo1'
        )
        .setOrigin(0)
        .setScrollFactor(0);
    
        // Escalar el patrón; esto mantiene la textura nítida
        this.suelo.tileScaleX = scaleSuelo;
        this.suelo.tileScaleY = scaleSuelo;
    
        /* -- Cuerpo fisico ------ */
        this.escena.physics.add.existing(this.suelo, true);
        this.cuerpoSuelo = this.suelo.body;
        this.cuerpoSuelo.setSize(Number.MAX_SAFE_INTEGER, altoSuelo);
        }

    // se llama en cada frame para actualizar la posición de fondo y suelo
    actualizar(desplazamientoX) {
        // el fondo se mueve mas lento que el suelo para generar efecto de parallax o profundidad :)
        this.imagenFondo.tilePositionX = desplazamientoX * 0.5;
        this.suelo.tilePositionX = desplazamientoX;
    }
}
