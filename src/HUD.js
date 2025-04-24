export default class Interfaz {
    constructor(escena, metaPuntaje) {
        // Escena de Phaser
        this.escena = escena;

        // Meta que el jugador debe alcanzar
        this.metaPuntaje = metaPuntaje;

        // Puntaje actual
        this.puntajeActual = 0;

        // Tiempo inicial (en segundos)
        this.tiempoRestante = 60;

        // Bandera para el parpadeo del tiempo
        this.tiempoParpadeando = false;


        // Mostramos texto de puntaje
        this.textoPuntaje = escena.add.text(10, 10, 'Puntaje: 0', {
            font: "20px Arial",
            fill: "#fff"
        }).setScrollFactor(0);

        // Mostramos la meta
        this.textoMeta = escena.add.text(10, 40, 'Meta: ' + metaPuntaje, {
            font: "20px Arial",
            fill: "#fff"
        }).setScrollFactor(0);

        // Mostramos el tiempo
        this.textoTiempo = escena.add.text(10, 70, 'Tiempo: 01:00', {
            font: "20px Arial",
            fill: "#fff"
        }).setScrollFactor(0);
    }



    // Actualiza el puntaje (por ejemplo, cuando destruimos un obstáculo)
    actualizarPuntaje(nuevoPuntaje) {
        this.puntajeActual = nuevoPuntaje;
        this.textoPuntaje.setText('Puntaje ganado: ' + nuevoPuntaje);
    }

    // Convierte los segundos restantes a un formato mm:ss y lo muestra
    actualizarTiempo(segundos) {
        this.tiempoRestante = segundos;
        const minutos = Math.floor(segundos / 60);
        const seg = segundos % 60;

        // Usamos utilidades de Phaser para rellenar con 0 a la izquierda
        const formateado = Phaser.Utils.String.Pad(minutos, 2, '0', 1) + ":" +
                           Phaser.Utils.String.Pad(seg, 2, '0', 1);

        this.textoTiempo.setText('Tiempo restante: ' + formateado);
        if (segundos <= 20) {
            // Cambiar color a rojo
            this.textoTiempo.setStyle({ fill: '#ff0000' });
    
            // Parpadeo si no se ha iniciado ya
            if (!this.tiempoParpadeando) {
                this.tiempoParpadeando = true;

                this.tiempoTween = this.escena.tweens.add({
                    targets: this.textoTiempo,
                    alpha: { from: 1, to: 0.3 }, // más explícito
                    yoyo: true,
                    repeat: -1,
                    duration: 500
                });
            }

        } else {
            // Si vuelve a ser mayor a 20, reseteamos estilo
            this.textoTiempo.setStyle({ fill: '#ffffff' });
            this.textoTiempo.setAlpha(1);
            
            if (this.tiempoTween) {
                this.tiempoTween.stop();         // detener tween
                this.tiempoTween.remove();       // eliminar tween del sistema
                this.tiempoTween = null;         // limpiar referencia
            }

            this.tiempoParpadeando = false;
        }
    }
}
