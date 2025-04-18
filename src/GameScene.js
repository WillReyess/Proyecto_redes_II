import Fondo from './Background.js';
import Jugador from './Player.js';
import Obstaculos from './Obstacles.js';
import Balas from './Bullets.js';
import Interfaz from './HUD.js';

export default class EscenaJuego extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    // Recibimos la meta de puntaje desde la ruleta
    init() {
        // Obtener los datos de los parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const puntos = urlParams.get("puntos");
    
        // Usar el valor del parámetro para inicializar el puntaje
        this.metaPuntaje = puntos || 1000;  // Si no se pasa el parámetro, usar un puntaje predeterminado de 1000
    
        console.log("Puntaje inicial: ", this.metaPuntaje); // Verificar que el valor se haya pasado correctamente
    }

    // Carga de recursos antes de entrar a la escena
    preload() {
        console.log("Preload de EscenaJuego");

        // Crearemos el objetoFondo y cargamos sus recursos
        this.objetoFondo = new Fondo(this);
        this.objetoFondo.preCargar();

        // Jugador: cargamos el atlas y json de animaciones
        this.load.atlas('tomato_atlas', './assets/evil_tomato.png', './assets/evil_tomato.json');
        this.load.json('evil_tomato_anim', './assets/evil_tomato_anim.json');

        // Creamos instancia de Jugador (más adelante hacemos create())
        this.objetoJugador = new Jugador(this, 100, 500);

        // Plugin de joystick (ejemplo)
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);

        // Obstáculos
        this.objetoObstaculos = new Obstaculos(this, 0.1);
        this.objetoObstaculos.preCargar();

        // Balas
        this.objetoBalas = new Balas(this);
        this.objetoBalas.preCargar();
    }

    // Creación inicial de sprites, físicas, colisiones, etc.
    create() {
        // Fondo y suelo
        this.objetoFondo.crear();

        // Crear animaciones del jugador desde el JSON
        const datosAnim = this.cache.json.get('evil_tomato_anim');
        datosAnim.anims.forEach(configAnim => {
            this.anims.create(configAnim);
        });

        // Crear al jugador
        this.objetoJugador.crear();

        this.juegoFinalizado = false; // Variable para controlar el estado del juego

        // Colisión jugador-suelo
        this.physics.add.collider(this.objetoJugador.sprite, this.objetoFondo.cuerpoSuelo);

        // Crear obstáculos
        this.objetoObstaculos.crear();

        // Crear balas
        this.objetoBalas.crear();
        // Asignamos la referencia de escena
        this.objetoBalas.escena = this;

        // Colisión balas con obstáculos
        this.physics.add.collider(
            this.objetoBalas.grupoBalas,
            this.objetoObstaculos.grupoObstaculos,
            (bala, obstaculo) => {
                this.objetoBalas.cuandoBalaChocaObstaculo(bala, obstaculo);
            },
            null,
            this
        );

        // Ajustes de cámara y mundo
        const altoJuego = this.sys.game.config.height;
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, altoJuego);
        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, altoJuego);

        // La cámara sigue al jugador
        this.cameras.main.startFollow(this.objetoJugador.sprite, true, 0.1, 0.1);

        // Iniciamos el puntaje en 0
        this.puntaje = 0;
        // Creamos la interfaz (HUD)
        this.interfaz = new Interfaz(this, this.metaPuntaje);

        // Temporizador de un minuto
        this.tiempoRestante = 60;
        this.eventoTemporizador = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tiempoRestante--;
                this.interfaz.actualizarTiempo(this.tiempoRestante);
                this.revisarFinDelJuego();
            },
            loop: true
        });

        // Definimos la lógica cuando una bala impacta un obstáculo
        this.objetoBalas.cuandoBalaChocaObstaculo = (bala, obstaculo) => {
            if (!bala.active || !obstaculo.active) return;

            // Desactivamos la física para evitar choques múltiples
            if (bala.body) bala.body.enable = false;
            if (obstaculo.body) obstaculo.body.enable = false;

            // Asignamos puntos según el tipo de obstáculo
            let puntos = (obstaculo.texture.key === 'obstacle1') ? 10 : 20;
            this.agregarPuntaje(puntos);

            // Efecto de "desaparición" del obstáculo
            this.tweens.add({
                targets: obstaculo,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 60,
                onComplete: () => {
                    if (obstaculo.active) obstaculo.destroy();
                }
            });

            if (bala.active) bala.destroy();
        };

    }

  

    // Se llama en cada frame para actualizar la lógica
    update() {
        this.objetoJugador.actualizar();
        this.objetoFondo.actualizar(this.cameras.main.scrollX);
        this.objetoObstaculos.actualizar();
        this.objetoBalas.actualizar();
        this.revisarFinDelJuego();
    }

    // Sumar puntaje y actualizar la interfaz
    agregarPuntaje(puntos) {
        this.puntaje += puntos;
        this.interfaz.actualizarPuntaje(this.puntaje);
    }

    // Revisa si se cumplió la meta o se acabó el tiempo
    revisarFinDelJuego() {
        if (this.juegoFinalizado) return; // Evitamos múltiples llamadas
        if (this.puntaje >= this.metaPuntaje || this.tiempoRestante <= 0) {
            this.juegoFinalizado = true; // Marcamos el juego como finalizado
            this.finalizarJuego();
        }
    }

    finalizarJuego() {
        // Detenemos el temporizador
        this.eventoTemporizador.remove(false);
    
        let mensaje = (this.puntaje >= this.metaPuntaje) ? "¡Ganaste!" : "Perdiste";
    
        // Coordenadas centradas de la cámara
        const centroX = this.cameras.main.width / 2;
        const centroY = this.cameras.main.height / 2;
    
        // Texto fijo en pantalla
        this.add.text(centroX, centroY, mensaje, {
            font: "80px Arial",
            fill: "#fff"
        })
        .setOrigin(0.5)
        .setScrollFactor(0); // Para que no se mueva con la cámara
    
        // Pausamos física e inputs
        this.physics.pause();
        this.input.enabled = false;
    
        // Calcular el tiempo jugado
        let tiempoJugado = 60 - this.tiempoRestante; // Tiempo total menos el tiempo restante
    
        // Enviar los datos como objeto JSON
        const datos = {
            puntaje: this.puntaje,
            tiempo: tiempoJugado,
        };

        // Se envían los datos al backend
        fetch('http://localhost/Proyecto_redes_II/controllers/guardar_puntaje.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos) // Convierte el objeto JS a un objeto JSON
        })
        .then(res => res.json()) // Convertimos la respuesta del servidor a JSON
        .then(respuesta => {
            // Verificamos la respuesta del servidor
            if (respuesta.status === 'success') {
                console.log("Puntaje guardado correctamente:", respuesta.message);
            } else {
                console.log("Error al guardar puntaje:", respuesta.message);
            }
        })
        .catch(error => {
            console.error("Error al enviar los datos:", error);
        });
    }
    
}
