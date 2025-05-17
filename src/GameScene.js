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

    init() {
        const puntos = sessionStorage.getItem("puntajeRuleta");
        this.metaPuntaje = puntos || 1000;
        console.log("Puntaje inicial: ", this.metaPuntaje);
    }

    create() {
        // Fondo y suelo
        this.objetoFondo = new Fondo(this);
        this.objetoFondo.crear();

        // Jugador
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.objetoJugador = new Jugador(this, centerX, centerY);
        this.objetoJugador.crear();

        // Animaciones del jugador desde JSON
        const datosAnim = this.cache.json.get('evil_tomato_anim');
        if (datosAnim && datosAnim.anims) {
            datosAnim.anims.forEach(configAnim => {
                this.anims.create(configAnim);
            });
        }

        // Redimensionar jugador al cambiar tamaño
        this.scale.on('resize', ({ height }) => {
            const escala = (height * this.objetoJugador.proporcionPantalla) / this.objetoJugador.sprite.height;
            this.objetoJugador.escalaNormal = escala;
            if (this.objetoJugador.cursores.down.isDown)
                this.objetoJugador.sprite.setScale(escala, escala * 0.5);
            else
                this.objetoJugador.sprite.setScale(escala);
        });

        // Plataforma y colisiones básicas
        this.physics.add.collider(this.objetoJugador.sprite, this.objetoFondo.cuerpoSuelo);

        // Controles móviles si es necesario
        const esMovil = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
        if (esMovil) {
            this.controles = new ControlesMoviles(this, this.objetoJugador);
        }

        // Crear balas
        this.objetoBalas = new Balas(this);
        this.objetoBalas.crear();

        // Crear premios de puntos
        this.objetoPremioPuntos = new PremioPuntos(this);
        this.objetoPremioPuntos.crear();

        // Colisiones de balas con premio
        this.physics.add.collider(
            this.objetoBalas.grupoBalas,
            this.objetoPremioPuntos.grupoPremiosPuntos,
            (bala, premioPuntos) => {
                this.objetoBalas.cuandoBalaChocaPremioPuntos(bala, premioPuntos);
            },
            null,
            this
        );

        // Crear plataformas aéreas
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

        // Colisiones con plataformas
        this.physics.add.collider(this.objetoJugador.sprite, this.plataformasAereas);
        this.physics.add.collider(
            this.objetoBalas.grupoBalas,
            this.plataformasAereas,
            (bala, plataforma) => {
                bala.destroy();
                plataforma.recibirDisparo();
            },
            null,
            this
        );

        // PremioTiempo encima de plataforma más alta
        let plataformaMasAlta = this.plataformasAereas.getChildren().reduce((a, b) => (a.y < b.y ? a : b));
        const offsetVertical = alto * 0.08;
        this.premioTiempo = new PremioTiempo(this, plataformaMasAlta.x, plataformaMasAlta.y - offsetVertical);

        // Crear bots
        this.bots = this.physics.add.group({ runChildUpdate: true });
        const botCoords = [
            { x: 0.95, y: 0.75 },
            { x: 1.4, y: 0.6 }
        ];
        botCoords.forEach(coord => {
            const bot = new Bot(this, ancho * coord.x, alto * coord.y);
            this.bots.add(bot);
        });

        // Colisiones bots
        this.physics.add.collider(this.bots, this.bots);
        this.physics.add.collider(this.bots, this.objetoFondo.cuerpoSuelo);

        // Colisión bot ↔ jugador
        this.physics.add.collider(
            this.objetoJugador.sprite,
            this.bots,
            (jugadorSprite, botSprite) => {
                this.objetoJugador.recibirDanio(botSprite.damage);
                botSprite.enRebote = true;
                const angulo = Phaser.Math.Angle.Between(jugadorSprite.x, jugadorSprite.y, botSprite.x, botSprite.y);
                const fuerza = alto * 0.8;
                botSprite.setBounce(1, 1);
                botSprite.body.setVelocity(
                    Math.cos(angulo) * fuerza,
                    Math.sin(angulo) * fuerza
                );
                this.time.delayedCall(600, () => {
                    botSprite.enRebote = false;
                });
            }
        );

        // Colisión bala ↔ bot
        this.physics.add.collider(
            this.objetoBalas.grupoBalas,
            this.bots,
            (bala, bot) => {
                if (!bala.active || !bot.active) return;
                const danio = bala.damage ?? 0.2;
                bala.destroy();
                bot.recibirDanio(danio);
            }
        );

        // Cámara y límites
        const altoJuego = this.sys.game.config.height;
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, altoJuego);
        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, altoJuego);
        this.cameras.main.startFollow(this.objetoJugador.sprite, true, 0.1, 0.1);

        // HUD e interfaz
        this.puntaje = 0;
        this.interfaz = new Interfaz(this, this.metaPuntaje);

        this.tiempoRestante = 60;
        this.juegoFinalizado = false;

        this.eventoTemporizador = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tiempoRestante--;
                this.interfaz.actualizarTiempo(this.tiempoRestante);
                this.revisarFinDelJuego();
            },
            loop: true
        });

        // Lógica al chocar bala ↔ PremioPuntos
        this.objetoBalas.cuandoBalaChocaPremioPuntos = (bala, premio) => {
            if (!bala.active || !premio.active) return;
            if (bala.body?.enable) bala.body.enable = false;
            if (premio.body?.enable) premio.body.enable = false;

            const puntos = premio.texture.key === 'premioPuntos1' ? 10 : 20;
            this.agregarPuntaje(puntos);

            this.tweens.add({
                targets: premio,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 60,
                onComplete: () => premio.destroy()
            });

            if (bala.active) bala.destroy();
        };
    }

    update() {
        if (this.juegoFinalizado) return;
        this.objetoJugador?.actualizar();
        this.objetoFondo?.actualizar(this.cameras.main.scrollX);
        this.objetoPremioPuntos?.actualizar();
        this.objetoBalas?.actualizar();
    }

    agregarPuntaje(puntos) {
        this.puntaje += puntos;
        this.interfaz.actualizarPuntaje(this.puntaje);
    }

    revisarFinDelJuego() {
        if (this.juegoFinalizado) return;
        if (this.puntaje >= this.metaPuntaje || this.tiempoRestante <= 0) {
            this.juegoFinalizado = true;
            this.finalizarJuego();
        }
    }

    detenerTodo() {
        this.juegoFinalizado = true;
        this.objetoJugador.sprite.body.enable = false;
        this.objetoJugador.sprite.anims.stop();
        this.objetoJugador.sprite.setVelocity(0, 0);
        this.objetoJugador.teclaDisparo.enabled = false;
        Object.values(this.objetoJugador.cursores).forEach(t => t && (t.enabled = false));
        this.objetoJugador.nombreTexto?.destroy();
        this.objetoJugador.barraSalud?.destroy();
        this.interfaz.textoPuntaje?.destroy();
        this.interfaz.textoMeta?.destroy();
        this.interfaz.textoTiempo?.destroy();
        this.bots.getChildren().forEach(bot => {
            bot.setVelocity(0, 0);
            bot.body.enable = false;
            bot.puedeDisparar = false;
            bot.active = false;
            bot.barraVida?.destroy();
        });
        this.objetoBalas.grupoBalas.children.each(bala => {
            bala.setVelocity(0, 0);
            bala.body.enable = false;
            bala.active = false;
        });
        this.plataformasAereas.getChildren().forEach(plataforma => {
            plataforma.healthBar?.destroy();
        });
        this.time.clearPendingEvents();
        this.input.enabled = false;
        this.physics.pause();
    }

    finalizarJuego() {
        this.eventoTemporizador.remove(false);
        const gano = this.puntaje >= this.metaPuntaje;
        const centroX = this.cameras.main.width / 2;
        const centroY = this.cameras.main.height / 2;
        const keySprite = gano ? 'ganaste' : 'perdiste';
        const textura = this.textures.get(keySprite).getSourceImage();
        const escala = (this.scale.width * 0.3) / textura.width;

        const spriteResultado = this.add.image(centroX, centroY, keySprite)
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setScale(escala)
            .setDepth(999);

        this.sound.play(gano ? 'sonido_ganar' : 'sonido_perder');
        this.detenerTodo();

        setTimeout(() => {
            spriteResultado.destroy();
            window.location.href = `http://${location.host}/Proyecto_redes_II/views/wheel.html`;
        }, 3000);

        const tiempoJugado = 60 - this.tiempoRestante;
        const datos = {
            puntaje: this.puntaje,
            tiempo: tiempoJugado,
        };

        fetch(`http://${location.host}/Proyecto_redes_II/controllers/guardar_puntaje.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(respuesta => {
            console.log("Puntaje:", respuesta.message);
        })
        .catch(error => {
            console.error("Error al enviar los datos:", error);
        });
    }
}
