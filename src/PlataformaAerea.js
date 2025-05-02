export default class PlataformaAerea extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
  
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
  
        this.scene = scene;
        this.health = 1;
        this.healthBar = scene.add.graphics();
        this.healthBar.setDepth(10);
  
        this.setTexture(texture); // <- Asegura que la textura esté bien asignada
  
        // Esperar a que la textura esté completa antes de escalar
        this.once('texturecomplete', () => {
            this.ajustarEscala();
        });
  
        // En caso que la textura ya esté lista (por seguridad extra)
        if (this.texture.key !== '__MISSING') {
            this.ajustarEscala();
        }
  
        this.dibujarBarra();
    }
  
    ajustarEscala() {
        const texturaOriginal = this.texture.getSourceImage();
        const anchoOriginal = texturaOriginal.width;
  
        const anchoPantalla = this.scene.scale.width;
        const porcentajeAncho = 0.05;
        const anchoDeseado = anchoPantalla * porcentajeAncho;
  
        const escala = anchoDeseado / anchoOriginal;
  
        this.setScale(escala);
        this.body.updateFromGameObject();
  
        this.anchoBarra = this.displayWidth * 0.4;
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
  