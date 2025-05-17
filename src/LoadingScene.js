export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadingScene' });
  }

  preload() {
    const { width, height } = this.scale;

    //primera fase:
    //carga de recursos principales para mostrar el fondo y el logo de carga , son prioridad para que el usuario vea algo inicialmente
    this.load.image('fondoCarga', './assets/fondo_juego0.jpg');
    this.load.image('logoCarga', './assets/bala2.png');

    this.load.once('complete', () => {
      // fondo e imagen responsiva
      this.add.image(width / 2, height / 2, 'fondoCarga').setDisplaySize(width, height);

      const logo = this.add.image(width / 2, height * 0.25, 'logoCarga').setScale(0.3);
      this.tweens.add({
        targets: logo,
        angle: 360,
        duration: 2000,
        repeat: -1
      });

      // Barra de carga y textos
      this._mostrarBarraYTips(width, height);

      // segunda fase: carga completa
      this._cargarAssetsRestantes();
    });

    this.load.start(); // con los recursos cargados se inicia la primera fase
  }

  _mostrarBarraYTips(width, height) {
    const textoCarga = this.add.text(width / 2, height * 0.6, 'Cargando...', {
      font: `${Math.round(height * 0.035)}px Arial`,
      fill: '#ffffff'
    }).setOrigin(0.5);

    const tips = [
      'Consejo: ¡Dispara o toca los balones para ganar más puntos! 🎯',
      'Tip: Evita que te rodeen los enemigos 👾',
      'Usa plataformas para esquivar ataques 🚀'
    ];
    const tipActual = Phaser.Math.RND.pick(tips);
    this.add.text(width / 2, height * 0.9, tipActual, {
      font: `${Math.round(height * 0.02)}px Arial`,
      fill: '#cccccc'
    }).setOrigin(0.5);

    const barraFondo = this.add.graphics().setDepth(1);
    const barraProgreso = this.add.graphics().setDepth(2);
    const barraAncho = width * 0.6;
    const barraAlto = height * 0.04;
    const xBarra = width / 2 - barraAncho / 2;
    const yBarra = height * 0.7;

    barraFondo.fillStyle(0x222222, 0.8);
    barraFondo.fillRoundedRect(xBarra, yBarra, barraAncho, barraAlto, 10);

    this.load.on('progress', (valor) => {
      barraProgreso.clear();
      barraProgreso.fillStyle(0x00ffcc, 1);
      barraProgreso.fillRoundedRect(xBarra, yBarra, barraAncho * valor, barraAlto, 10);
    });

    this.load.on('complete', () => {
      textoCarga.setText('¡Listo!');
      this.time.delayedCall(3000, () => {
        this.scene.start('GameScene');
      });
    });
  }

  _cargarAssetsRestantes() {
    // IMAGENES
    this.load.image('fondo1', './assets/FondoB.png');
    this.load.image('suelo1', './assets/suelo1.png');
    this.load.image('bala1', './assets/bala2.png');
    this.load.image('botSprite', './assets/bot1.png');
    this.load.image('reloj', './assets/reloj_premio.png');
    this.load.image('plataforma1', './assets/plataforma1.png');
    this.load.image('premioPuntos1', './assets/PremioPuntos1.png');
    this.load.image('premioPuntos2', './assets/PremioPuntos2.png');
    this.load.image('ganaste', './assets/ganaste.jpg');
    this.load.image('perdiste', './assets/perdiste.jpg');

    // AUDIO
    this.load.audio('sonido_carga', './assets/victoria.mp3');
    this.load.audio('sonido_disparo', './assets/disparo.wav');
    this.load.audio('sonido_salto', './assets/salto.wav');
    this.load.audio('sonido_danio', './assets/disparo.wav');
    this.load.audio('sonido_ganar', './assets/victoria.mp3');
    this.load.audio('sonido_perder', './assets/derrota.mp3');

    // ATLAS + JSON
    this.load.atlas('tomato_atlas', './assets/evil_tomato.png', './assets/evil_tomato.json');
    this.load.json('evil_tomato_anim', './assets/evil_tomato_anim.json');

    this.load.start(); // Inicio de segunda fase
  }
}
