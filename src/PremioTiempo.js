export default class PremioTiempo extends Phaser.Physics.Arcade.Sprite {
  constructor(escena, x, y, textura = 'reloj') {
    super(escena, x, y, textura);

    this.escena = escena;

    escena.add.existing(this);
    escena.physics.add.existing(this);
    this.ajustarEscalaResponsiva(); // Ajustar escala al crear el sprite


    this.setDepth(5); 
    this.body.allowGravity = false;

    // Detecta colision con el jugador
    escena.physics.add.overlap(
      escena.objetoJugador.sprite,
      this,
      this.entregarPremio,
      null,
      this
    );
  }

  ajustarEscalaResponsiva() {
    const texturaOriginal = this.texture.getSourceImage();
    const anchoOriginal = texturaOriginal.width;
  
    const anchoPantalla = this.escena.scale.width;
    const porcentajeAncho = 0.03; // ajustar para cambiar tamaño
    const anchoDeseado = anchoPantalla * porcentajeAncho;
  
    const escala = anchoDeseado / anchoOriginal;
    this.setScale(escala);
    this.body.updateFromGameObject();
  }
  

  entregarPremio(jugador, premio) {
    this.escena.tiempoRestante += 30;
    this.escena.interfaz.actualizarTiempo(this.escena.tiempoRestante);

    //this.escena.sound.play('sonido_tiempoExtra', { volume: 1 });
    
    // Mostrar texto +30s

    const altoPantalla = this.escena.scale.height;
    const fontSize = Math.round(altoPantalla * 0.08); // % del alto visible

    const texto = this.escena.add.text(this.x, this.y - 20, '+30s', {
      font: `${fontSize}px Arial`,
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3
    });
    texto.setOrigin(0.5).setDepth(10);

    // Animación del texto
    this.escena.tweens.add({
      targets: texto,
      y: texto.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => texto.destroy()
    });

    this.destroy();
  }
}
