export default class Bot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture='botSprite') {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);


    this.scene = scene;
    this.speed = 100;      // velocidad de persecución
    this.damage = 0.1;     // cada contacto quita % de vida
    this.enRebote = false; // inicialmente sin rebotar 

    // escalado de la textura para hacer pruebas de responsive

    const altoPantalla = this.scene.scale.height;
    const texturaOriginal = this.texture.getSourceImage();
    const altoOriginal = texturaOriginal.height;
    
    // definiendo el tamanio del sprite en porcentaje proporcional a la pantalla

    // -----------------------------------------------------------------------------------------

    const porcentajePantalla = 0.10 // 10% de la pantalla


    // ------------------------------------------------------------------------------------------


    const altoDeseado = altoPantalla * porcentajePantalla;
    const escala = altoDeseado / altoOriginal;
    
    this.setScale(escala).setCollideWorldBounds(true);

    this.body.setBounce (1, 1); // rebote en ambos ejes


    // Activar actualización automática
    this.setDataEnabled();
  }

  // Este método se llamara cada frame (runChildUpdate: true)
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if(!this.enRebote){
      const player = this.scene.objetoJugador.sprite;
      this.scene.physics.moveToObject(this, player, this.speed);

      const distancia = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (distancia < 40) {
        this.body.setVelocity(0, 0);
      }
    }
  }
}
