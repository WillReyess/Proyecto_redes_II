
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
    const size = 75; //diametro del boton
    const margin = 50; // distancia respecto al borde derecho
    const colX = w - margin - size;
    const centerY = h / 2;

    const posiciones = {
      up:    { x: colX,             y: centerY - size - 12 },
      down:  { x: colX,             y: centerY + size + 12 },
      left:  { x: colX - size - 12, y: centerY },
      right: { x: colX + size + 12, y: centerY }
    };

    const { left, right, up, down } = this.player.cursores;
    const mapa = { up, down, left, right };

    Object.entries(posiciones).forEach(([key, pos]) => {
      const spr = this.scene.add.image(pos.x, pos.y, 'btnCircle')
        .setScrollFactor(0)
        .setDepth(30)
        .setAlpha(0.35);

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
    const size = 75;
    const margin = 50;
    const colX = w - margin - size;
    const centerY = h / 2;

    if (!this.buttons.up) return;
    this.buttons.up.setPosition(colX, centerY - size - 12);
    this.buttons.down.setPosition(colX, centerY + size + 12);
    this.buttons.left.setPosition(colX - size - 12, centerY);
    this.buttons.right.setPosition(colX + size + 12, centerY);
  }
}
