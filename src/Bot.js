export default class Bot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'botSprite') {
    super(scene, x, y, texture);

    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const altoPantalla = scene.scale.height;
    const anchoPantalla = scene.scale.width;

    // Escalado
    const altoDeseado = altoPantalla * 0.1;
    const escala = altoDeseado / this.texture.getSourceImage().height;
    this.setScale(escala).setCollideWorldBounds(true);

    // Velocidades y rangos
    this.speed = anchoPantalla * 0.1;
    this.rangoVista = anchoPantalla * 0.40; // % de la pantalla
    this.rangoDisparo = anchoPantalla * 0.25;
    this.cooldownDisparo = 3000; // en ms
    this.puedeDisparar = true;

    // Patrullaje
    this.direccionPatrulla = 1;
    this.timerPatrulla = 0;
    this.tiempoGiro = 1200;

    // Vida
    this.vidaMaxima = 1;
    this.vida = this.vidaMaxima;
    this.barraVida = scene.add.graphics().setDepth(20);

    this.damage = 0.1;
    this.enRebote = false;

    // Gravedad y rebote
    this.body.setBounce(1, 0);
    this.setDataEnabled();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.enRebote || !this.active) return;

    const jugador = this.scene.objetoJugador.sprite;
    const distancia = Phaser.Math.Distance.Between(this.x, this.y, jugador.x, jugador.y);

    if (distancia < this.rangoVista) {
      this.scene.physics.moveToObject(this, jugador, this.speed);
      this.flipX = (jugador.x > this.x);

      if (distancia < 60) {
        // Demasiado cerca = solo daño cuerpo a cuerpo
        // daño se hace desde colision con jugador
      } else if (distancia < this.rangoDisparo && this.puedeDisparar) {
        this.disparar();
      }
    } else {
      this.timerPatrulla += delta;
      this.setVelocityX(this.speed * (this.direccionPatrulla > 0 ? 1 : -1));
      this.flipX = this.direccionPatrulla > 0;

      if (this.timerPatrulla >= this.tiempoGiro) {
        this.direccionPatrulla *= -1;
        this.timerPatrulla = 0;
      }
    }

    this._dibujarBarraVida();
  }

  disparar() {
    this.puedeDisparar = false;
  
    const jugadorControl = this.scene.objetoJugador;
    const jugadorSprite = jugadorControl?.sprite;
    if (!jugadorSprite || !jugadorControl) return;
  
    const bala = this.scene.physics.add.image(this.x, this.y, 'bala1');
  
    // Escalado responsivo
    const anchoPantalla = this.scene.scale.width;
    const texturaOriginal = this.scene.textures.get('bala1').getSourceImage();
    const anchoOriginal = texturaOriginal.width;
    const porcentajeAncho = 0.03;
    const anchoDeseado = anchoPantalla * porcentajeAncho;
    const escala = anchoDeseado / anchoOriginal;
    bala.setScale(escala).setDepth(15);
    bala.body.allowGravity = false;
  
    // Disparo hacia el jugador trayectoria real directa
    const velocidadBala = this.scene.scale.width * 0.9; // % del ancho por segundo
    this.scene.physics.moveToObject(bala, jugadorSprite, velocidadBala);

  
    // Colisión segura con el jugador
    this.scene.physics.add.overlap(
      bala,
      jugadorSprite,
      () => {
        if (!bala.active || !jugadorSprite.active) return;
  
        bala.destroy();
        jugadorControl.recibirDanio(0.1);
      },
      null,
      this.scene
    );
  
    this.scene.time.delayedCall(this.cooldownDisparo, () => {
      this.puedeDisparar = true;
    });
  }
  


  recibirDanio(valor) {
    this.vida -= valor;
    if (this.vida < 0) this.vida = 0;
    this._dibujarBarraVida();

    if (this.vida === 0) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scaleX: 2,
        scaleY: 2,
        duration: 300,
        ease: 'Back.easeIn',
        onComplete: () => {
          this.barraVida.destroy();
          this.destroy(); 
        }
      });
    }
  }

  _dibujarBarraVida() {


    const ancho = this.displayWidth * 0.6; // 60% del ancho del sprite
    const alto = this.displayHeight * 0.05; //
    const x = this.x - ancho / 2; // Centrado
    const y = this.y - this.displayHeight / 2 - alto - 5; // Arriba del sprite

    this.barraVida.clear();
    this.barraVida.fillStyle(0x333333, 0.4);
    this.barraVida.fillRect(x, y, ancho, alto);
    this.barraVida.fillStyle(0xff0000, 0.8);
    this.barraVida.fillRect(x, y, ancho * (this.vida / this.vidaMaxima), alto);
  }
}


