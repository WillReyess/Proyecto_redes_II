export default class Jugador {
    constructor(escena, xInicial, yInicial) {
        this.escena = escena;

        this.proporcionPantalla = 0.08; // Proporción de la pantalla que ocupará el jugador
        this.escalaNormal = 1;


        // Velocidad de movimiento horizontal
        this.velocidad = this.escena.scale.width * 0.10; // Ajustar el valor numerico para más o menos velocidad

        // Potencia de salto negativo para ir hacia arriba
        // Potencia de salto proporcional a la altura de pantalla
        this.fuerzaSalto = -(this.escena.scale.height * 0.55); // Ajustar el valor numerico para más o menos fuerza
        

        // Guarda coords iniciales (por si se necesitan)
        this.xInicial = xInicial;
        this.yInicial = yInicial;

        //vida del jugador
        this.saludMaxima = 1;
        this.salud = this.saludMaxima;

        this.barraSalud = null; // Inicializamos la barra de salud


    }

    // Crear el sprite del jugador y configurar inputs
    crear() {
        // se crea el sprite con su tamaño

        this.sprite = this.escena.physics.add.sprite(this.xInicial, this.yInicial, 'tomato_atlas');

        const altoDeseado   = this.escena.scale.height * this.proporcionPantalla;
        this.escalaNormal   = altoDeseado / this.sprite.height;
        this.sprite.setScale(this.escalaNormal);

        // se crea el texto con el nombre flotante

        const altoPantalla = this.escena.scale.height;

        const fontSize = Math.round(altoPantalla * 0.020); //ajustar tamanio de fuente

        this.nombreTexto = this.escena.add.text(this.sprite.x, this.sprite.y, 'Ing. Daro', {
            font: `${fontSize}px Arial`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.nombreTexto.setOrigin(0.8, 1.5); // Centrado horizontalmente y encima
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
       // this.escena.scale.on('resize', this.ajustarPosicion, this);

    }
/*
        ajustarPosicion() {
            const centerX = this.escena.cameras.main.centerX;
            const centerY = this.escena.cameras.main.centerY;
            this.sprite.setPosition(centerX, centerY);
            this.nombreTexto.setPosition(centerX, centerY - this.sprite.displayHeight);  // Ajustar la posición del nombre
        } 
*/
    

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
        if (this.teclaDisparo.isDown) {
            this.disparar();
            this.teclaDisparo.isDown = false; // Evitar disparo continuo
        }
        //redibujo de la barra de vida con la pos actual del jugador
        this._dibujarBarraVida();

        // Actualizar la posición del nombre

        this._actualizarAlias();
        
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

        this._mostrarDanio(cantidad); // muestra texto de daño

        this._dibujarBarraVida(); // Actualizamos la barra de vida
        
        
        if (this.salud === 0) {
            this._morir();
        }
    }
    _mostrarDanio(cantidad) {

        const altoPantalla = this.escena.scale.height;
        const fontSize = Math.round(altoPantalla * 0.07); // 7% del alto de pantalla
        
        const texto = this.escena.add.text(this.sprite.x, this.sprite.y - this.sprite.displayHeight / 2, `-${cantidad}`, {
            font: `${fontSize}px Arial`,
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(10);
        
        // Sonido al recibir daño
        this.escena.sound.play('sonido_danio', { volume: 1 });
        
        this.escena.tweens.add({
            targets: texto,
            x: { from: texto.x - 5, to: texto.x + 5 },
            duration: 80,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              // 🔼 Movimiento hacia arriba + fade después del shake
              this.escena.tweens.add({
                targets: texto,
                y: texto.y - 30,
                alpha: 0,
                duration: 1000,
                ease: 'Power1',
                onComplete: () => texto.destroy()
              });
            }
          });
          
    }

    _actualizarAlias() {
        const offsetY = this.sprite.displayHeight; // Justo encima del sprite
        this.nombreTexto.setPosition(this.sprite.x, this.sprite.y - offsetY);
      }
      


      _dibujarBarraVida() {
        const anchoPantalla = this.escena.scale.width;
        const altoPantalla = this.escena.scale.height;
    
        // Escala responsiva (ancho y alto de la barra)
        const ancho = Math.round(anchoPantalla * 0.04); // % del ancho de pantalla
        const alto  = Math.round(altoPantalla * 0.005); // % del alto de pantalla
    
        // Posición centrada sobre el sprite
        const x = this.sprite.x - ancho / 1.15;
        const y = this.sprite.y - this.sprite.displayHeight;
    
        // Dibujo
        this.barraSalud.clear();
        this.barraSalud.fillStyle(0x555555, 0.3); // Fondo gris transparente
        this.barraSalud.fillRect(x, y, ancho, alto);
        this.barraSalud.fillStyle(0xff0000, 0.8); // Vida roja
        this.barraSalud.fillRect(x, y, ancho * (this.salud / this.saludMaxima), alto);
    }
    
    _morir() {
        // Detiene el juego si el jugador muere
        this.escena.finalizarJuego();
    }
}