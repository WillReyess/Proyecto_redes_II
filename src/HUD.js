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
    }
}
