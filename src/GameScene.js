import Fondo from './Background.js';
import Jugador from './Player.js';
import Balas from './Bullets.js';
import Interfaz from './HUD.js';
import PlataformaAerea from './PlataformaAerea.js';
import Bot from './Bot.js';
import PremioTiempo from './PremioTiempo.js';
import ControlesMoviles from './ControlesMoviles.js';
import PremioPuntos from './PremioPuntos.js';


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
        //this.objetoJugador = new Jugador(this, 100, 500);

        // Plugin de joystick (ejemplo)
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);

        // PremioPuntos
        this.objetoPremioPuntos = new PremioPuntos(this, 0.1);
        this.objetoPremioPuntos.preCargar();

        // Balas
        this.objetoBalas = new Balas(this);
        this.objetoBalas.preCargar();

        // Cargam de la imagen de las plataformas aereas
        this.load.image('plataforma1', './assets/plataforma1.png' );

        // Cargamos la imagen del premio1

        this.load.image('reloj', './assets/reloj_premio.png');


        // Cargamos la imagen del bot

        this.load.image('botSprite', './assets/bot1.png');



        //cargamos los sonidos
        this.load.audio('sonido_disparo', './assets/disparo.wav');
        this.load.audio('sonido_salto', './assets/salto.wav');




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

        this.scale.on('resize', ({ height }) => {
            this.objetoJugador.escalaNormal = (height * this.objetoJugador.proporcionPantalla) /
                                              this.objetoJugador.sprite.height;
            if (this.objetoJugador.cursores.down.isDown)
                this.objetoJugador.sprite.setScale(this.objetoJugador.escalaNormal,
                                                    this.objetoJugador.escalaNormal * 0.5);
            else
                this.objetoJugador.sprite.setScale(this.objetoJugador.escalaNormal);
        });

        
        

        // Crear al jugador

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
    
        this.objetoJugador = new Jugador(this, centerX, centerY);
        this.objetoJugador.crear();
        

        this.juegoFinalizado = false; // Variable para controlar el estado del juego
        
        // gestos móviles
        this.controles = new ControlesMoviles(this, this.objetoJugador);


        // Colisión jugador-suelo
        this.physics.add.collider(this.objetoJugador.sprite, this.objetoFondo.cuerpoSuelo);

        //crear obstaculos

        this.objetoPremioPuntos.crear();


        // Crear balas
        this.objetoBalas.crear();
        // Asignamos la referencia de escena
        this.objetoBalas.escena = this;

        // Colisión balas con PremioPuntos
        this.physics.add.collider(
            this.objetoBalas.grupoBalas,
            this.objetoPremioPuntos.grupoPremiosPuntos,
            (bala, premioPuntos) => {
                this.objetoBalas.cuandoBalaChocaPremioPuntos(bala, premioPuntos);
            },
            null,
            this
        );



        //creacion de plataformas aereas en coordenadas fijas
        this.plataformasAereas = this.physics.add.staticGroup();

        const plataformasNivel = [
            { x: 0.2, y: 0.85 },
            { x: 0.35, y: 0.75 },
            { x: 0.5, y: 0.65 },
            { x: 0.65, y: 0.55 },
            { x: 0.8, y: 0.45 },
            { x: 0.95, y: 0.35 },
            { x: 1.05, y: 0.25 },
        ];

        const ancho = this.scale.width;
        const alto = this.scale.height;

        
        plataformasNivel.forEach(coord => {
            const plataforma = new PlataformaAerea(this, ancho * coord.x, alto * coord.y, 'plataforma1');
            
        
            this.plataformasAereas.add(plataforma);
        });
        

          // Obtener la plataforma más alta
        let plataformaMasAlta = this.plataformasAereas.getChildren().reduce((masAlta, actual) =>
            actual.y < masAlta.y ? actual : masAlta
        );
    
        // Crear el premio encima de la plataforma más alta
        this.premioTiempo = new PremioTiempo(this, plataformaMasAlta.x, plataformaMasAlta.y - 90); // Ajustar la posición del premio
        this.premioTiempo.setScale(0.20); // escala de el premio para variar el tamanio  


          
        // colisión con jugador plataforma
        this.physics.add.collider(this.objetoJugador.sprite, this.plataformasAereas);
        
        // colisión con balas plataforma
        this.physics.add.collider(
          this.objetoBalas.grupoBalas,
          this.plataformasAereas,
          (bala, plataforma) => {
            bala.destroy();
            plataforma.recibirDisparo(); // metodo de la clase
          },
          null,
          this
        );


            // Grupo de bots con preUpdate automático
        this.bots = this.physics.add.group({ runChildUpdate: true });

            // Creacion algunos bots en posiciones fijas
        const botPositions = [
            { x: 600, y: 500 },
            { x: 1200, y: 400 }
            ];
            botPositions.forEach(pos => {
            const bot = new Bot(this, pos.x, pos.y);
            this.bots.add(bot);
            });

            // colision entre los bots

            this.physics.add.collider(this.bots, this.bots);

            // colision entre bot suelo

            this.physics.add.collider(this.bots, this.objetoFondo.cuerpoSuelo);


            // Colisión/overlap bot ↔ jugador
            this.physics.add.collider(
            this.objetoJugador.sprite,
            this.bots,
            (jugadorSprite, botSprite) => {
            // botSprite es instancia de Bot
               // botSprite.body.stop();  // opcional: frenar al chocar
                this.objetoJugador.recibirDanio(botSprite.damage);

                // poniendo al bot en rebote

                botSprite.enRebote = true; // Cambiamos el estado a "en rebote" en constructor esta false

                //this.physecs.add.collider(this.bots, this.objetoFondo.cuerpoSuelo);

                // programacion del rebote entre el bot y el jugador

                //direccion:

                const angulo = Phaser.Math.Angle.Between(jugadorSprite.x, jugadorSprite.y, botSprite.x, botSprite.y);

                //fuerza:
                const fuerzaRebote = this.scale.height * 0.8 // % de la altura de la pantalla

                //aplicacion del impulso

                botSprite.setBounce(1, 1); // Rebote en ambos ejes

                botSprite.body.setVelocity(
                    Math.cos(angulo) * fuerzaRebote,
                    Math.sin(angulo) * fuerzaRebote
                );

                //detener impulso en base al tiempo
                botSprite.scene.time.delayedCall(600, () => {
                    if (botSprite && botSprite.body) {
                        botSprite.enRebote = false; // Detener el bot después de un tiempo

                    }
                        
                } 
            );



            }
            );

            // (Opcional)  Colisión bala contrabot para que jugador pueda eliminarlos
            this.physics.add.collider(
            this.objetoBalas.grupoBalas,
            this.bots,
            (bala, bot) => {
                bala.destroy();

                this.tweens.add({
                    targets: bot,
                    alpha: 0,
                    scale: 2,
                    duration: 300,
                    ease: 'Back.easeIn',
                    onComplete: () => {
                        bot.destroy();
                    }
                });
            }
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



    // Definicion de la logica cuando una bala impacta un obstáculo
    this.objetoBalas.cuandoBalaChocaPremioPuntos = (bala, premioPuntos) => {
            if (!bala.active || !premioPuntos.active) return;

            // se desactiva la física para evitar choques múltiples
            if (bala.body) bala.body.enable = false;
            if (premioPuntos.body) premioPuntos.body.enable = false;

            // se asigna puntos segun el tipo de obstaculo
            let puntos = (premioPuntos.texture.key === 'premioPuntos1') ? 10 : 20;
            this.agregarPuntaje(puntos);

            // Efecto de "desaparición" del obstáculo
            this.tweens.add({
                targets: premioPuntos,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 60,
                onComplete: () => {
                    if (premioPuntos.active) premioPuntos.destroy();
                }
            });

            if (bala.active) bala.destroy();
        };



    }



    // Callback al impactar una bala con una plataforma aérea
    _onBulletHitAerial(bala, plat) {
        bala.destroy();               // destruccion de la bala
        plat.health -= 0.05;          // se resta 5%
        if (plat.health < 0) plat.health = 0;
        this._updateHealthBar(plat);  // actualizacion de la barra
    
        if (plat.health === 0) {
        // destruccion de la barra y plataforma
        plat.healthBar.destroy();
        plat.destroy();
        }
    }


    // Se llama en cada frame para actualizar la lógica
    update() {
        this.objetoJugador.actualizar();         
        this.objetoFondo.actualizar(this.cameras.main.scrollX);
        this.objetoPremioPuntos.actualizar();
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
