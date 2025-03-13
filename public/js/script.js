const totalCards = 12;
let cards = [];
let selectedcards = [];
let valuesUsed = [];
let currentMove = 0;
let maxAttempts = 7; // Número máximo de intentos

let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';

function activate(a) {
    if (currentMove < 2 && maxAttempts > 0) {
        if ((!selectedcards[0] || selectedcards[0] !== a.target) && !a.target.classList.contains('active')) {
            a.target.classList.add('active');
            selectedcards.push(a.target);

            if (++currentMove == 2) {
                if (selectedcards[0].querySelector('.face').innerHTML === selectedcards[1].querySelector('.face').innerHTML) {
                    selectedcards = [];
                    currentMove = 0;
                } else {
                    maxAttempts--; // Reducir intentos al fallar
                    setTimeout(() => {
                        selectedcards[0].classList.remove('active');
                        selectedcards[1].classList.remove('active');
                        selectedcards = [];
                        currentMove = 0;
                        document.querySelector('#stats').innerHTML = `Intentos restantes: ${maxAttempts}`;
                        
                        if (maxAttempts === 0) {
                            alert("¡Juego terminado! No tienes más intentos.");
                            disableGame();
                        }
                    }, 600);
                }
            }
        }
    }
}

/* Función para deshabilitar el juego cuando los intentos llegan a 0 */
function disableGame() {
    cards.forEach(card => card.querySelector('.card').removeEventListener('click', activate));
}

/* Función para generar valores aleatorios en las tarjetas */
function randomValue() {
    let random = Math.floor(Math.random() * totalCards * 0.5);
    let values = valuesUsed.filter(value => value === random);
    if (values.length < 2) {
        valuesUsed.push(random);
    } else {
        randomValue();
    }
}

/* Creación de las cartas y asignación de valores */
for (let i = 0; i < totalCards; i++) {
    let div = document.createElement('div');
    div.innerHTML = cardTemplate;
    cards.push(div);
    document.querySelector('#game').append(cards[i]); // Se inyecta el arreglo de cartas en el HTML
    randomValue();
    cards[i].querySelector('.face').innerHTML = valuesUsed[i];
    cards[i].querySelector('.card').addEventListener('click', activate);
}

/* Mostrar intentos restantes en la interfaz */
document.querySelector('#stats').innerHTML = `Intentos restantes: ${maxAttempts}`;
