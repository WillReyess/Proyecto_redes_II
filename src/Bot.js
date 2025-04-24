export default class Bot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture='botSprite') {
      super(scene, x, y, texture);
  
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setScale(0.4).setCollideWorldBounds(true);
  
      this.scene = scene;
      this.speed = 100;      // velocidad de persecución
      this.damage = 0.001;     // cada contacto quita % de vida
  
      // Activar actualización automática
      this.setDataEnabled();
    }
  
    // Este método se llamará cada frame (runChildUpdate: true)
    preUpdate(time, delta) {
      super.preUpdate(time, delta);
  
      // Perseguir al jugador
      const player = this.scene.objetoJugador.sprite;
      this.scene.physics.moveToObject(this, player, this.speed);
  
      // Si está muy cerca, detenerse para atacar
      const distancia = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (distancia < 40) {
        this.body.setVelocity(0, 0);
      }
    }
  }
  