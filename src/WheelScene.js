export default class EscenaRuleta extends Phaser.Scene {
    constructor() {
        super({ key: 'WheelScene' });

        // Opciones de la ruleta
        this.segmentos = [100, 150, 200, 220, 250, 280, 300];
        this.radioRuleta = 300;
    }

    preload() {
        // Aquí no usamos imágenes, solo gráficos y texto para la ruleta
    }

    create() {
        const centroX = this.cameras.main.width / 2;
        const centroY = this.cameras.main.height / 2;

        // Contenedor para la ruleta
        this.ruleta = this.add.container(centroX, centroY);

        const numSegmentos = this.segmentos.length;
        const anguloPorSegmento = Phaser.Math.PI2 / numSegmentos;

        // Dibujamos la ruleta con Graphics
        const graficos = this.add.graphics();
        for (let i = 0; i < numSegmentos; i++) {
            const anguloInicio = i * anguloPorSegmento;
            // Colores alternados
            graficos.fillStyle(i % 2 === 0 ? 0x99ccff : 0x66aaff, 1);
            graficos.slice(0, 0, this.radioRuleta, anguloInicio, anguloInicio + anguloPorSegmento, false);
            graficos.fillPath();
        }
        this.ruleta.add(graficos);

        // Texto en cada segmento
        for (let i = 0; i < numSegmentos; i++) {
            const anguloInicio = i * anguloPorSegmento;
            const anguloMedio = anguloInicio + anguloPorSegmento / 2;
            const xTexto = (this.radioRuleta / 2) * Math.cos(anguloMedio);
            const yTexto = (this.radioRuleta / 2) * Math.sin(anguloMedio);

            let textoSegmento = this.add.text(xTexto, yTexto, this.segmentos[i].toString(), {
                font: "18px Arial",
                fill: "#000"
            });
            textoSegmento.setOrigin(0.5, 0.5);
            this.ruleta.add(textoSegmento);
        }

        // Aguja (puntero) fijo
        const puntero = this.add.triangle(
            centroX,
            centroY - this.radioRuleta - 20,
            0, 0,
            40, 0,
            20, 30,
            0xff0000
        );
        puntero.setScrollFactor(0);

        // Texto de instrucciones
        this.add.text(
            centroX - 150,
            centroY + this.radioRuleta + 10,
            "Haz clic para girar la ruleta",
            {
                font: "20px Arial",
                fill: "#fff"
            }
        ).setScrollFactor(0);

        // Cuando hagamos clic, la ruleta girará
        this.input.once('pointerdown', () => {
            // Elegir giro aleatorio (entre 5 y 10 vueltas completas)
            const giroExtra = Phaser.Math.Between(0, numSegmentos - 1) * anguloPorSegmento;
            const vueltasCompletas = Phaser.Math.Between(5, 10) * Phaser.Math.PI2 + giroExtra;

            this.tweens.add({
                targets: this.ruleta,
                angle: vueltasCompletas * Phaser.Math.RAD_TO_DEG,
                ease: 'Cubic.easeOut',
                duration: 3000,
                onComplete: () => {
                    // Determinar en qué segmento cayó la aguja
                    let anguloFinal = Phaser.Math.Wrap(this.ruleta.rotation, 0, Phaser.Math.PI2);
                    let anguloPuntero = -Math.PI / 2; // El puntero apunta hacia arriba
                    // Ajustamos el ángulo para ver el “índice” del segmento
                    let anguloAjustado = Phaser.Math.Wrap(anguloPuntero - anguloFinal, 0, Phaser.Math.PI2);
                    let indiceSegmento = Math.floor(anguloAjustado / anguloPorSegmento);

                    const puntajeMeta = this.segmentos[indiceSegmento];

                    // Mostramos la meta en la pantalla
                    this.add.text(
                        centroX - 80,
                        centroY + this.radioRuleta + 40,
                        "Meta: " + puntajeMeta,
                        {
                            font: "24px Arial",
                            fill: "#fff"
                        }
                    ).setScrollFactor(0);

                    // Después de 2 segundos, iniciamos la escena del juego
                    this.time.delayedCall(2000, () => {
                        this.scene.start('GameScene', { targetScore: puntajeMeta });
                    });
                }
            });
        });
    }
}
