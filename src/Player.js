export default class Jugador {
    constructor(escena, xInicial, yInicial) {
        this.escena = escena;

        this.proporcionPantalla = 0.08; // Proporción de la pantalla que ocupará el jugador
        this.escalaNormal = 1;


        // Velocidad de movimiento horizontal
        this.velocidad = this.escena.scale.width * 0.10; // Ajustar el valor numerico para más o menos velocidad

        // Potencia de salto (número negativo para ir hacia arriba)
        // Potencia de salto (proporcional a la altura de pantalla)
        this.fuerzaSalto = -(this.escena.scale.height * 0.55); // Ajustar el valor numerico para más o menos fuerza


        // Guardamos coords iniciales (por si se necesitan)
        this.xInicial = xInicial;
        this.yInicial = yInicial;

        //vida del jugador
        this.saludMaxima = 1;
        this.salud = this.saludMaxima;

        this.barraSalud = null; // Inicializamos la barra de salud
    }

    // Crear el sprite del jugador y configurar inputs
    crear() {
        // Creamos el sprite y aumentamos su tamaño para que se vea grande
       // this.sprite = this.escena.physics.add.sprite(this.xInicial, this.yInicial, 'tomato_atlas').setScale(4); codigo inicial modificado

        this.sprite = this.escena.physics.add.sprite(this.xInicial, this.yInicial, 'tomato_atlas');

        const altoDeseado   = this.escena.scale.height * this.proporcionPantalla;
        this.escalaNormal   = altoDeseado / this.sprite.height;
        this.sprite.setScale(this.escalaNormal);

        // Crear el texto con el nombre flotante
        this.nombreTexto = this.escena.add.text(this.sprite.x, this.sprite.y, 'Ing. Daro', {
            font: '16px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.nombreTexto.setOrigin(0.5, 1); // Centrado horizontalmente y justo encima
        this.nombreTexto.setDepth(10); // Asegura que quede arriba del sprite



        //reproducir sonidos de salto y disparo

        this.sonidoSalto = this.escena.sound.add('sonido_salto', { volume: 1 });
        this.sonidoDisparo = this.escena.sound.add('sonido_disparo', { volume: 1 });

        this.sprite.setCollideWorldBounds(true);

        // Teclas de cursor
        this.cursores = this.escena.input.keyboard.createCursorKeys();
        // Tecla para disparar
        this.teclaDisparo = this.escena.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        if (!this.barraSalud) {
            this.barraSalud = this.escena.add.graphics().setDepth(20);
        }

        // Guardamos la referencia en la escena (para otras colisiones)
        this.escena.jugador = this;

        // dibujo de barra de salud inicial

        this._dibujarBarraVida();

        // Ajustar la posición del jugador al cambiar el tamaño de la pantalla
        this.escena.scale.on('resize', this.ajustarPosicion, this);

    }

        ajustarPosicion() {
            const centerX = this.escena.cameras.main.centerX;
            const centerY = this.escena.cameras.main.centerY;
            this.sprite.setPosition(centerX, centerY);
            this.nombreTexto.setPosition(centerX, centerY - this.sprite.displayHeight / 2 - 10);  // Ajustar la posición del nombre
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

        // Salto si está en una superficie y presionamos arriba
        if ((this.cursores.up.isDown) && (this.sprite.body.touching.down || this.sprite.body.blocked.down)) {
            this.sprite.setVelocityY(this.fuerzaSalto);
            this.sonidoSalto.play(); // Reproducir sonido de salto con la accion del jugador
        
        }

        // Si se presiona abajo, cambiamos scale para "agacharse"
        if (this.cursores.down.isDown) {
            this.sprite.setScale(4, 2);
            this.sprite.setScale(this.escalaNormal, this.escalaNormal * 0.5)
        } else {
            this.sprite.setScale(3, 3);
            this.sprite.setScale(this.escalaNormal);
        }

        // Disparo con la tecla SPACE
        if (Phaser.Input.Keyboard.JustDown(this.teclaDisparo)) {
            this.disparar();
        }
        //redibujo de la barra de vida con la pos actual del jugador
        this._dibujarBarraVida();

        // Actualizar la posición del nombre
        this.nombreTexto.setPosition(this.sprite.x - 25, this.sprite.y - this.sprite.displayHeight / 2 - 50);

    }

    // Dispara una bala desde el jugador
    disparar() {
        // Ajuste para que la bala salga un poco adelante o atrás del jugador
        let offsetX = this.sprite.flipX ? -20 : 20;
        let posBalaX = this.sprite.x + offsetX;
        let posBalaY = this.sprite.y - 10;

        this.escena.objetoBalas.dispararBala(posBalaX, posBalaY, this.sprite.flipX);
        if (this.sonidoDisparo){
            this.sonidoDisparo.play(); // Reproducir sonido de disparo con la accion del jugador
        }
    }

    recibirDanio(cantidad) {
        this.salud -= cantidad;
        if (this.salud < 0) this.salud = 0;
        this._dibujarBarraVida(); // Actualizamos la barra de vida
        
        
        if (this.salud === 0) {
            this._morir();
        }
    }

    _dibujarBarraVida() {
        const ancho = 60;
        const alto = 6;
        const x = this.sprite.x - ancho / 2 -25;
        const y = this.sprite.y - this.sprite.displayHeight / 2 - 45;

        this.barraSalud.clear();
        this.barraSalud.fillStyle(0x555555, 0.3);
        this.barraSalud.fillRect(x, y, ancho, alto);
        this.barraSalud.fillStyle(0xff0000, 0.8);
        this.barraSalud.fillRect(x, y, ancho * (this.salud / this.saludMaxima), alto);       
        
    }
    _morir() {
        // Detiene el juego si el jugador muere
        this.escena.finalizarJuego();
    }
}