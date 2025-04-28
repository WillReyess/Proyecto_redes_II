fetch('http://localhost/proyecto_redes_II/controllers/guardar_puntaje.php', {
    method: 'POST',
    body: JSON.stringify({
        puntaje: 100,  
        tiempo: 300    
    }),
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json()) // Convertir la respuesta a JSON
.then(data => {

    if (data.status === 'success') {
        
        // Obtener el cuerpo de la tabla donde se mostrarán los datos
        const tbody = document.querySelector('#scores-table tbody');

        // Limpiar la tabla antes de agregar los nuevos datos
        tbody.innerHTML = '';

        // Recorrer los datos del ranking y crear las filas en la tabla
        data.ranking.forEach((jugador, index) => {
            const row = document.createElement('tr');

            // Crear las celdas con los datos
            const puestoCell = document.createElement('td');
            puestoCell.textContent = index + 1; 
            row.appendChild(puestoCell); 

            const nombreCell = document.createElement('td');
            nombreCell.textContent = jugador.nombre;
            row.appendChild(nombreCell);

            const apellidoCell = document.createElement('td');
            apellidoCell.textContent = jugador.apellido;
            row.appendChild(apellidoCell);

            const puntajeCell = document.createElement('td');
            puntajeCell.textContent = jugador.score;
            row.appendChild(puntajeCell);

            const tiempoCell = document.createElement('td');
            tiempoCell.textContent = jugador.tiempo_jugado;
            row.appendChild(tiempoCell);

            // Agregar la fila a la tabla
            tbody.appendChild(row);
        });
    } else {
        console.log('Error:', data.message);
    }
})
.catch(error => console.error('Error en la solicitud:', error));
