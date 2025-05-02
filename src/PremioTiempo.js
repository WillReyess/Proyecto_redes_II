export default class PremioTiempo extends Phaser.Physics.Arcade.Sprite {
  constructor(escena, x, y, textura = 'reloj') {
    super(escena, x, y, textura);

    this.escena = escena;

    escena.add.existing(this);
    escena.physics.add.existing(this);

    this.setScale(0.5); // Escala del sprite
    this.setDepth(5); 
    this.setBounce(0.2); 
    this.body.allowGravity = false;

    // Detectar colisión con el jugador
    escena.physics.add.overlap(
      escena.objetoJugador.sprite,
      this,
      this.entregarPremio,
      null,
      this
    );
  }

  entregarPremio(jugador, premio) {
    this.escena.tiempoRestante += 30;
    this.escena.interfaz.actualizarTiempo(this.escena.tiempoRestante);
    
    // Mostrar texto +30s
    const texto = this.escena.add.text(this.x, this.y - 20, '+30s', {
      font: '40px Arial',
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
