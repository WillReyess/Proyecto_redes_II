
export default class ControlesMoviles {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.buttons = {};

    // Garantizamos al menos 3 punteros táctiles (pointer0 y pointer1 ya existen)
    this.scene.input.addPointer(2);

    this._crearTexturaBase();
    this._crearBotones();

    // Reposicionar al cambiar tamaño/orientación
    scene.scale.on('resize', ({ width, height }) => this._reposicionar(width, height));
  }

  _crearTexturaBase() {
    if (this.scene.textures.exists('btnCircle')) return;
    const size = 64;
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff, 0.25);
    g.fillCircle(size / 2, size / 2, size / 2);
    g.lineStyle(2, 0xffffff, 0.4);
    g.strokeCircle(size / 2, size / 2, size / 2 - 1);
    g.generateTexture('btnCircle', size, size);
    g.destroy();
  }

  _crearBotones() {
    const cam = this.scene.cameras.main;
    this._instanciar(cam.width, cam.height);
  }

  _instanciar(w, h) {
    const baseSize = Math.min(w, h);
    const size = baseSize * 0.2; // Tamaño de los botones (10% del tamaño de la pantalla)

    

    const posiciones = {
      up:    { x: w * 0.1, y: h * 0.6 },
      down:  { x: w * 0.8, y: h * 0.6 },
      left:  { x: w * 0.7, y: h * 0.5 },
      right: { x: w * 0.9, y: h * 0.5 },
      disparo: { x: w * 0.1, y: h * 0.8 }
    };
    

    const { left, right, up, down } = this.player.cursores;
    const disparo = this.player.teclaDisparo; // tecla de disparo
    const mapa = { up, down, left, right, disparo };

    Object.entries(posiciones).forEach(([key, pos]) => {
      const spr = this.scene.add.image(pos.x, pos.y, 'btnCircle')
        .setScrollFactor(0)
        .setDepth(30)
        .setAlpha(0.5) // OPACIDAD DEL BOTON
        .setDisplaySize(size, size); // Tamaño del botón

        /* const alphas = { up: 0.4, down: 0.4, left: 0.4, right: 0.4, disparo: 0.6 };
        spr.setAlpha(alphas[key]);

        */// Cambiar el alphas para cambiar la opacidad de los botones por separado


      spr.setInteractive({ useHandCursor: true });
      spr.activePointers = new Set();

      // Pointer down – añadimos el id y activamos la tecla
      spr.on('pointerdown', (pointer) => {
        spr.activePointers.add(pointer.id);
        mapa[key].isDown = true;
      });

      // Auxiliar para liberar sólo cuando ya no queda ningún dedo en el botón
      const release = (pointer) => {
        spr.activePointers.delete(pointer.id);
        if (spr.activePointers.size === 0) {
          mapa[key].isDown = false;
        }
      };

      spr.on('pointerup', release);
      spr.on('pointerupoutside', release);
      spr.on('pointerout', release);

      this.buttons[key] = spr;
    });
  }

  _reposicionar(w, h) {
    
    
    if (!this.buttons.up) return;

    this.buttons.up.setPosition(w * 0.9, h * 0.3);
    this.buttons.down.setPosition(w * 0.9, h * 0.7);
    this.buttons.left.setPosition(w * 0.8, h * 0.5);
    this.buttons.right.setPosition(w * 1.0, h * 0.5);
    this.buttons.disparo.setPosition(w * 0.1, h * 0.8);
    
  }
}
