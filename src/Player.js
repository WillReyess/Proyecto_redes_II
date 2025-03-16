export default class Jugador {
    constructor(escena, xInicial, yInicial) {
        this.escena = escena;

        // Velocidad de movimiento horizontal
        this.velocidad = 200;

        // Potencia de salto (número negativo para ir hacia arriba)
        this.fuerzaSalto = -300;

        // Guardamos coords iniciales (por si se necesitan)
        this.xInicial = xInicial;
        this.yInicial = yInicial;
    }

    // Crear el sprite del jugador y configurar inputs
    crear() {
        // Creamos el sprite y aumentamos su tamaño para que se vea grande
        this.sprite = this.escena.physics.add.sprite(this.xInicial, this.yInicial, 'tomato_atlas').setScale(4);
        this.sprite.setCollideWorldBounds(true);

        // Teclas de cursor
        this.cursores = this.escena.input.keyboard.createCursorKeys();
        // Tecla para disparar
        this.teclaDisparo = this.escena.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Guardamos la referencia en la escena (para otras colisiones)
        this.escena.jugador = this;
    }

    // Actualizamos posición, animaciones y disparo
    actualizar() {
        // Reseteamos velocidad horizontal cada frame
        this.sprite.setVelocityX(0);

        // Movimiento a la izquierda
        if (this.cursores.left.isDown) {
            this.sprite.setVelocityX(-this.velocidad);
            this.sprite.flipX = true;
            this.sprite.anims.play('tomato_atlas_walk', true);
        }
        // Movimiento a la derecha
        else if (this.cursores.right.isDown) {
            this.sprite.setVelocityX(this.velocidad);
            this.sprite.flipX = false;
            this.sprite.anims.play('tomato_atlas_walk', true);
        }
        // Si no se mueve en X, detenemos la animación
        else {
            this.sprite.anims.stop();
        }

        // Salto si está en el suelo y presionamos arriba
        if ((this.cursores.up.isDown) && (this.sprite.body.touching.down || this.sprite.body.blocked.down)) {
            this.sprite.setVelocityY(this.fuerzaSalto);
        }

        // Si se presiona abajo, cambiamos scale para "agacharse"
        if (this.cursores.down.isDown) {
            this.sprite.setScale(4, 2);
        } else {
            this.sprite.setScale(3, 3);
        }

        // Disparo con la tecla SPACE
        if (Phaser.Input.Keyboard.JustDown(this.teclaDisparo)) {
            this.disparar();
        }
    }

    // Dispara una bala desde el jugador
    disparar() {
        // Ajuste para que la bala salga un poco adelante o atrás del jugador
        let offsetX = this.sprite.flipX ? -20 : 20;
        let posBalaX = this.sprite.x + offsetX;
        let posBalaY = this.sprite.y - 10;

        this.escena.objetoBalas.dispararBala(posBalaX, posBalaY, this.sprite.flipX);
    }
}
