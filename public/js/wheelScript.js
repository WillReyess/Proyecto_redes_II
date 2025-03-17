// Obtener los elementos del DOM
const wheel = document.getElementById("wheel"); // Rueda donde se muestra el gráfico
const spinBtn = document.getElementById("spin-btn"); // Botón de inicio para girar
const finalValue = document.getElementById("final-value"); // Área donde se muestra el resultado

// Objeto que almacena los valores de los ángulos mínimo y máximo para cada segmento
const rotationValues = [
  { minDegree: 1, maxDegree: 45, value: 150 },
  { minDegree: 46, maxDegree: 90, value: 100 },
  { minDegree: 91, maxDegree: 135, value: 350 },
  { minDegree: 136, maxDegree: 180, value: 300 },
  { minDegree: 181, maxDegree: 225, value: 280 },
  { minDegree: 226, maxDegree: 270, value: 250 },
  { minDegree: 271, maxDegree: 315, value: 220 },
  { minDegree: 316, maxDegree: 360, value: 200 },
];

// Tamaño de cada pieza del gráfico (porcentaje de cada segmento)
const data = [15, 15, 15, 15, 15, 15, 15, 15];

// Colores de fondo para cada segmento del gráfico
var pieColors = [
  "#91A3B0", "#9B8F79", "#91A3B0", "#9B8F79", 
  "#91A3B0", "#9B8F79", "#91A3B0", "#9B8F79",
];

// Crear el gráfico de tipo "pie" (pastel)
let myChart = new Chart(wheel, {
  // Plugins para mostrar texto en el gráfico
  plugins: [ChartDataLabels],
  type: "pie", // Tipo de gráfico: pastel
  data: {
    labels: [100, 150, 200, 220, 250, 280, 300, 350], // Etiquetas de los segmentos
    datasets: [{
      backgroundColor: pieColors, // Colores para cada segmento
      data: data, // Tamaños de los segmentos
    }],
  },
  options: {
    responsive: true, // Hacer que el gráfico sea responsivo
    animation: { duration: 0 }, // Desactivar la animación por defecto
    plugins: {
      tooltip: false, 
      legend: { display: false }, 
      datalabels: { // Configuración de las etiquetas de los datos
        color: "#ffffff", // Color de las etiquetas
        formatter: (_, context) => context.chart.data.labels[context.dataIndex], // Mostrar los valores en las etiquetas
        font: { size: 24 }, // Tamaño de fuente de las etiquetas
      },
    },
  },
});

// Función para obtener el ángulo medio de un segmento aleatorio
const getMiddleAngle = () => {
  const randomIndex = Math.floor(Math.random() * rotationValues.length); // Obtener un índice aleatorio
  const segment = rotationValues[randomIndex]; // Obtener el segmento correspondiente
  const middleAngle = (segment.minDegree + segment.maxDegree) / 2; // Calcular el ángulo medio
  return middleAngle;
};

// Función para mostrar el valor basado en el ángulo aleatorio
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    // Si el ángulo está dentro de los límites de un segmento, mostrar el valor
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Valor: ${i.value}</p>`; // Mostrar el valor en la interfaz
      spinBtn.disabled = false; // Habilitar el botón de girar nuevamente
      break;
    }
  }
};

// Contador para las rotaciones
let count = 0;
// Valor inicial para las rotaciones (se usa para acelerar y luego desacelerar la animación)
let resultValue = 101;

// Iniciar el giro cuando se hace clic en el botón
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true; // Deshabilitar el botón mientras se gira
  finalValue.innerHTML = `<p>¡Buena suerte!</p>`; // Mensaje inicial antes de girar
  
  // Generar un valor aleatorio para el ángulo de parada
  let randomDegree = getMiddleAngle();

  // Intervalo para la animación de rotación
  let rotationInterval = window.setInterval(() => {
    // Establecer la rotación del gráfico
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update(); // Actualizar el gráfico con el nuevo valor de rotación
    
    // Si la rotación supera los 360 grados, reiniciar
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5; // Reducir la velocidad de rotación
      myChart.options.rotation = 0; // Resetear la rotación
    }

    // Usar un margen pequeño para la comparación (para detenerse suavemente)
    const tolerance = 2; 
    if (count > 15 && Math.abs(myChart.options.rotation - randomDegree) <= tolerance) {
      valueGenerator(randomDegree); // Mostrar el valor correspondiente
      clearInterval(rotationInterval); // Detener la animación
      count = 0; // Resetear el contador
      resultValue = 101; // Restaurar el valor de rotación inicial
    }
  }, 10); // Intervalo de tiempo entre actualizaciones de la animación (en milisegundos)
});
