export default class Balas {
    constructor(escena) {
        // Referencia a la escena principal
        this.escena = escena;

        // Grupo de balas
        this.grupoBalas = null;
    }

    // Carga de la imagen de la bala
    preCargar() {
        this.escena.load.image('bala1', './assets/bala2.png');
        
    }

    // Creación de grupo de balas
    crear() {
        this.grupoBalas = this.escena.physics.add.group();
    }

    // Actualización de la posición de las balas en cada frame
    actualizar() {
        this.grupoBalas.children.each(bala => {
            // Si la bala se va muy lejos de la cámara, destruimos para no desperdiciar memoria
            if (
                bala.x > this.escena.cameras.main.scrollX + 2000 ||
                bala.x < this.escena.cameras.main.scrollX - 2000
            ) {
                bala.destroy();
            }
        });
    }

    // dispara una bala desde x, y con una velocidad a la izquierda o derecha
    dispararBala(posX, posY, voltearX) {
        let bala = this.grupoBalas.create(posX, posY, 'bala1');
        if (!bala) return;

        bala.setActive(true);
        bala.setVisible(true);
        bala.body.allowGravity = false;
        const texturaOriginal = this.escena.textures.get('bala1').getSourceImage();
        const anchoOriginal = texturaOriginal.width;
        const anchoPantalla = this.escena.scale.width;
        const porcentajeAncho = 0.03; // % del ancho visible
        const anchoDeseado = anchoPantalla * porcentajeAncho;
        const escala = anchoDeseado / anchoOriginal;

        bala.setScale(escala);


        const velocidad = this.escena.scale.width * 0.8; // velocidad responsiva
        if (voltearX) {
          bala.setVelocityX(-velocidad);
          bala.flipX = true;
        } else {
          bala.setVelocityX(velocidad);
          bala.flipX = false;
        }
      }

    /*
     * funcióo definimda luego en GameScene:
     * onBulletHitObstacle(bala, obstaculo) {
     *     // Logica cuando una bala impacta un obstáculo
     * }
     */
}
