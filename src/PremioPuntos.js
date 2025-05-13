export default class PremioPuntos {
    constructor(escena, escala = 0.1) {
        // Escena de Phaser
        this.escena = escena;
        // Escala para ajustar tamaño de los premios
        this.escala = escala;

        // Grupo que tendra todos los premios
        this.grupoPremiosPuntos = null;

        // Proxima posición en X donde aparece un premio
        this.siguientePosX = 800;
    }

    // Carga de sprites de premios
    preCargar() {
        this.escena.load.image('premioPuntos1', './assets/premioPuntos1.png');
        this.escena.load.image('premioPuntos2', './assets/premioPuntos2.png');
    }

    // Crear premios iniciales y configurar colisiones
    crear() {
        // Crea el grupo de premios
        this.grupoPremiosPuntos = this.escena.physics.add.group();



        // se generan unos cuantos premios al inicio (ajustar valores segun la necesidad)
        for (let i = 300; i < 1800; i += 500) {
            this.crearPremioPuntos(i);
        }

        // colision jugador - premio, otorgando puntos, etc.
        if (this.escena.jugador && this.escena.jugador.sprite) {
            this.escena.physics.add.overlap(
                this.escena.jugador.sprite,
                this.grupoPremiosPuntos,
                this.colisionConJugador,
                null,
                this
            );
        }
    }

    // actualiza la posición del jugador para generar nuevos premios
    actualizar() {
        const posJugadorX = this.escena.jugador.sprite.x;

        // Cuando el jugador supere cierta distancia, se genera un nuevo premio
        if (posJugadorX > this.siguientePosX) {
            this.generarPremioPuntos();
            this.siguientePosX = posJugadorX + Phaser.Math.Between(400, 1000);
        }
        this.grupoPremiosPuntos.children.iterate(premio => {
            if (premio && premio.body) {
                this.verificarSiAsentado(premio);
            }
        });
        
        
    }

    verificarSiAsentado(premio) {
        if (premio.yaFijo) return;
    
        // Velocidad vertical muy baja, y está tocando algo por debajo
        const velocidadY = Math.abs(premio.body.velocity.y);
        const tocandoSuelo = premio.body.blocked.down;
    
        if (velocidadY < 10 && tocandoSuelo) {
            this.detenerPremio(premio, premio.body); // usamos su propio cuerpo
        }
    }
    

    // genera un premio en una posicion mas adelante del jugador
    generarPremioPuntos() {
        let posJugadorX = this.escena.jugador.sprite.x;
        let posAparicionX = posJugadorX + Phaser.Math.Between(400, 800);

        // colocar el premio sin que se solapen
        let intentos = 5;
        while (intentos > 0) {
            if (this.sePuedeColocarPremioPuntos(posAparicionX, 80)) {
                this.crearPremioPuntos(posAparicionX);
                break;
            } else {
                intentos--;
            }
        }
    }

    // Crea un premio en la coordenada X dada, asegurándose de que est sobre plataformas o el suelo
    crearPremioPuntos(xPos) {
        // se escoge al azar entre premioPuntos1 y premioPuntos2
        let tipo = Phaser.Math.Between(1, 2) === 1 ? 'premioPuntos1' : 'premioPuntos2';
        let premioPuntos = this.grupoPremiosPuntos.create(xPos, 0, tipo);

        premioPuntos.setBounce(0.4); // rebote moderado, puedes ajustar entre 0.3 y 0.6


        premioPuntos.setImmovable(false);  // se movera con la fí\isica
        premioPuntos.body.allowGravity = true;  // se activa la gravedad

        // Escalado responsivo
        this.ajustarEscala(premioPuntos);

        // posicion vertical aleatoria, aparicion de este en la parte superior
        let yPos = this.obtenerPosicionVerticalAleatoria();
        premioPuntos.y = yPos;

        // configuracion de las colisiones con el mundo (suelo y plataformas)
        premioPuntos.body.setCollideWorldBounds(true);  //  que no se escape fuera del mundo
        this.escena.physics.add.collider(premioPuntos, 
            this.escena.objetoFondo.cuerpoSuelo); 
            // this.detenerPremio, null, this);
        this.escena.physics.add.collider(premioPuntos, 
            this.escena.plataformasAereas); 
           //  this.detenerPremio, null, this);
    }

    // Metodo para obtener una posicion Y aleatoria sobre plataformas o sobre el suelo
    obtenerPosicionVerticalAleatoria() {
        //  se genera una posicion Y en la parte superior de la pantalla
        return Phaser.Math.Between(0, 100);  // genera un valor entre 0 y 100 pixeles de altura desde la parte superior
    }

    // Detener el premio cuando toca el suelo o las plataformas
    detenerPremio(premioPuntos, objetoFisico) {
        if (premioPuntos.yaFijo) return;
        premioPuntos.yaFijo = true;
    
        // Parar movimiento y gravedad
        premioPuntos.body.setVelocity(0, 0);
        premioPuntos.body.setAllowGravity(false);
        premioPuntos.body.immovable = true;
        premioPuntos.body.moves = false;

        /* const alturaPremio = premioPuntos.displayHeight;
        const top = objetoFisico.y - objetoFisico.height / 2;
        premioPuntos.y = top - alturaPremio / 2;  // Ajustar la posición Y del premio para que quede justo encima del objeto con el que colisionó
    */
        // Registrar colisión con balas solo una vez
        if (premioPuntos.active && !premioPuntos.yaColisionRegistrada) {
            premioPuntos.yaColisionRegistrada = true;
    
            this.escena.physics.add.collider(
                this.escena.objetoBalas.grupoBalas,
                premioPuntos,
                this.escena.objetoBalas.cuandoBalaChocaPremioPuntos,
                null,
                this.escena
            );
        }
    }
    
    

    // Ajustar escala de los premios de acuerdo al tamaño de la pantalla
    ajustarEscala(premioPuntos) {
        const texturaOriginal = premioPuntos.texture.getSourceImage();
        const anchoOriginal = texturaOriginal.width;

        const anchoPantalla = this.escena.scale.width;
        const porcentajeAncho = 0.05;  // ajustar el porcentaje segun el tamanioo deseado
        const anchoDeseado = anchoPantalla * porcentajeAncho;

        const escala = anchoDeseado / anchoOriginal;

        premioPuntos.setScale(escala);
        premioPuntos.body.updateFromGameObject();
    }

    // colision con el jugador
    colisionConJugador(jugador, premioPuntos) {
        if (!premioPuntos.active) return;
    
        if (premioPuntos.body && premioPuntos.body.enable) {
            premioPuntos.body.enable = false;
        }
    
        let puntos = (premioPuntos.texture.key === 'premioPuntos1') ? 10 : 20;
        this.escena.agregarPuntaje(puntos);
    
        this.escena.tweens.add({
            targets: premioPuntos,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 60,
            onComplete: () => {
                if (premioPuntos.active) premioPuntos.destroy();
            }
        });
    }
    
    

    // verifica si hay suficiente espacio para colocar un premio
    sePuedeColocarPremioPuntos(xPos, distanciaMinima) {
        const lista = this.grupoPremiosPuntos.getChildren();
        for (let premio of lista) {
            if (Math.abs(premio.x - xPos) < distanciaMinima) {
                return false;
            }
        }
        return true;
    }
}
