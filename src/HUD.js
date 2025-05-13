export default class Interfaz {
    constructor(escena, metaPuntaje) {
        this.escena = escena;
        this.metaPuntaje = metaPuntaje;
        this.puntajeActual = 0;
        this.tiempoRestante = 60;
        this.tiempoParpadeando = false;

        // Escalado responsivo
        const ancho = escena.scale.width;
        const alto = escena.scale.height;
        const fontSizeGeneral = Math.round(alto * 0.03);
        const fontSizeTiempo = Math.round(alto * 0.045);
        const paddingY = Math.round(alto * 0.015);
        const spacingY = Math.round(alto * 0.045);

        const centerX = ancho / 2;

        // Estilos
        const estiloTextoGeneral = {
            font: `${fontSizeGeneral}px Arial`,
            fill: "#00ffcc",
            stroke: "#000000",
            strokeThickness: 2
        };

        const estiloTextoTiempo = {
            font: `${fontSizeTiempo}px Arial`,
            fill: "#ffff00",
            stroke: "#000000",
            strokeThickness: 2
        };

        // 🎨 Fondo del HUD
        const fondoAncho = ancho * 0.7;
        const fondoAlto = alto * 0.16;

        this.fondoHUD = escena.add.graphics().setScrollFactor(0).setDepth(6);
        this.fondoHUD.fillStyle(0x000000, 0.5);
        this.fondoHUD.fillRoundedRect(centerX - fondoAncho / 2, paddingY - 10, fondoAncho, fondoAlto, 15);

        // 📋 Textos
        this.textoPuntaje = escena.add.text(centerX, paddingY, '🎲 Puntaje: 0', estiloTextoGeneral)
            .setOrigin(0.5, 0).setScrollFactor(0).setDepth(6);

        this.textoMeta = escena.add.text(centerX, paddingY + spacingY, `🎯 Meta: ${metaPuntaje}`, estiloTextoGeneral)
            .setOrigin(0.5, 0).setScrollFactor(0).setDepth(6);

        this.textoTiempo = escena.add.text(centerX, paddingY + spacingY * 2, '⏳ Tiempo: 01:00', estiloTextoTiempo)
            .setOrigin(0.5, 0).setScrollFactor(0).setDepth(6);

        this.estiloOriginalTextoTiempo = { ...estiloTextoTiempo };

        // 🎞 Animación suave de entrada
        [this.textoPuntaje, this.textoMeta, this.textoTiempo].forEach(texto => {
            texto.y -= 30;
            this.escena.tweens.add({
                targets: texto,
                y: texto.y + 30,
                alpha: { from: 0, to: 1 },
                ease: 'Back.easeOut',
                duration: 600,
                delay: 300
            });
        });
    }

    actualizarPuntaje(nuevoPuntaje) {
        this.puntajeActual = nuevoPuntaje;
        this.textoPuntaje.setText('🎲 Puntaje ganado: ' + nuevoPuntaje);
    }

    actualizarTiempo(segundos) {
        this.tiempoRestante = segundos;
        const minutos = Math.floor(segundos / 60);
        const seg = segundos % 60;

        const formateado = Phaser.Utils.String.Pad(minutos, 2, '0', 1) + ":" +
                           Phaser.Utils.String.Pad(seg, 2, '0', 1);

        this.textoTiempo.setText('⏳ Tiempo restante: ' + formateado);

        if (segundos <= 20) {
            this.textoTiempo.setStyle({ ...this.estiloOriginalTextoTiempo, fill: '#ff0000' });

            if (!this.tiempoParpadeando) {
                this.tiempoParpadeando = true;

                this.tiempoTween = this.escena.tweens.add({
                    targets: this.textoTiempo,
                    alpha: { from: 1, to: 0.3 },
                    yoyo: true,
                    repeat: -1,
                    duration: 500
                });
            }
        } else {
            this.textoTiempo.setStyle({ ...this.estiloOriginalTextoTiempo, fill: '#ffff00' });
            this.textoTiempo.setAlpha(1);

            if (this.tiempoTween) {
                this.tiempoTween.stop();
                this.tiempoTween.remove();
                this.tiempoTween = null;
            }

            this.tiempoParpadeando = false;
        }
    }
}
