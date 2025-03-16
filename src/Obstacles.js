export default class Obstaculos {
    constructor(escena, escala = 0.1) {
        // Escena de Phaser
        this.escena = escena;
        // Escala para ajustar tamaño de los obstáculos
        this.escala = escala;

        // Grupo que tendrá todos los obstáculos
        this.grupoObstaculos = null;

        // Próxima posición en X donde aparece un obstáculo
        this.siguientePosX = 800;
    }

    // Carga de sprites de obstáculos
    preCargar() {
        this.escena.load.image('obstacle1', './assets/obstacle1.png');
        this.escena.load.image('obstacle2', './assets/obstacle2.png');
    }

    // Crear obstáculos iniciales y configurar colisiones
    crear() {
        // Creamos el grupo de obstáculos
        this.grupoObstaculos = this.escena.physics.add.group();

        // Generamos unos cuantos obstáculos al inicio (puedes ajustar valores a tu gusto)
        for (let i = 300; i < 1800; i += 500) {
            this.crearObstaculo(i);
        }

        // Si se quiere hacer que el jugador colisione con obstáculo (daño, etc.)
        if (this.escena.jugador && this.escena.jugador.sprite) {
            this.escena.physics.add.collider(
                this.escena.jugador.sprite,
                this.grupoObstaculos,
                this.colisionConJugador,
                null,
                this
            );
        }
    }

    // Actualizamos según la posición del jugador para generar nuevos obstáculos
    actualizar() {
        const posJugadorX = this.escena.jugador.sprite.x;

        // Cuando el jugador supere cierta distancia, generamos un obstáculo nuevo
        if (posJugadorX > this.siguientePosX) {
            this.generarObstaculo();
            this.siguientePosX = posJugadorX + Phaser.Math.Between(400, 1000);
        }
    }

    // Genera un obstáculo en una posición más adelante del jugador
    generarObstaculo() {
        let posJugadorX = this.escena.jugador.sprite.x;
        let posAparicionX = posJugadorX + Phaser.Math.Between(400, 800);

        // Intentamos varias veces colocar el obstáculo sin que se solapen
        let intentos = 5;
        while (intentos > 0) {
            if (this.sePuedeColocarObstaculo(posAparicionX, 80)) {
                this.crearObstaculo(posAparicionX);
                break;
            } else {
                intentos--;
            }
        }
    }

    // Crea un obstáculo en la coordenada X dada
    crearObstaculo(xPos) {
        // Escogemos al azar entre obstacle1 u obstacle2
        let tipo = Phaser.Math.Between(1, 2) === 1 ? 'obstacle1' : 'obstacle2';
        let obstaculo = this.grupoObstaculos.create(xPos, 0, tipo);

        obstaculo.setImmovable(true);
        obstaculo.body.allowGravity = false;
        obstaculo.setScale(this.escala);

        // Ajustamos posición vertical según el tipo
        if (tipo === 'obstacle1') {
            // Ajusta según la imagen
            obstaculo.y = this.escena.scale.height * 0.8;
        } else {
            // Ajusta según tu imagen
            obstaculo.y = this.escena.scale.height - 80;
        }
    }

    // Ejemplo de colisión con el jugador
    colisionConJugador(jugador, obstaculo) {
        console.log("¡Colisión con un obstáculo!");
        // Aquí podrías restar vida al jugador, etc.
    }

    // Checamos si hay suficiente espacio para colocar un obstáculo
    sePuedeColocarObstaculo(xPos, distanciaMinima) {
        const lista = this.grupoObstaculos.getChildren();
        for (let obs of lista) {
            if (Math.abs(obs.x - xPos) < distanciaMinima) {
                return false;
            }
        }
        return true;
    }
}
