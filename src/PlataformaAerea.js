export default class PlataformaAerea extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
  
      // Añadir a escena y grupo de físicas
      scene.add.existing(this);
      //scene.physics.add.existing(this, true); si en algun momento las plataformas se quieren hacer moviles
  
      this.setScale(0.3) //.refreshBody(); si en algun momento las plataformas se quieren hacer moviles
  
      // Propiedades
      this.health = 1;
      this.anchoBarra = this.displayWidth * 0.4;
      this.healthBar = scene.add.graphics();
      this.healthBar.setDepth(10);
  
      this.scene = scene;
      this.dibujarBarra();
    }
  
    dibujarBarra() {
      const offsetY = this.displayHeight / 2;
      const altoBarra = 2;
  
      this.healthBar.clear();
      this.healthBar.fillStyle(0x555555, 0.3);
      this.healthBar.fillRect(
        this.x - this.anchoBarra / 2,
        this.y + offsetY,
        this.anchoBarra,
        altoBarra
      );
      this.healthBar.fillStyle(0xff0000, 0.6);
      this.healthBar.fillRect(
        this.x - this.anchoBarra / 2,
        this.y + offsetY,
        this.anchoBarra * this.health,
        altoBarra
      );
    }
  
    recibirDisparo() {
      this.health -= 0.05;
      if (this.health < 0) this.health = 0;
      this.dibujarBarra();
  
      if (this.health === 0) {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
                this.healthBar.destroy();
                this.destroy();
            }
        });
      }
    }
  }
  