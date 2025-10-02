const juegosIniciales = [
    { nombre: "Half-Life 1", genero: "FPS", disponible: true },
    { nombre: "Halo: Combat Evolved", genero: "FPS", disponible: true },
    { nombre: "Counter-Strike 1.6", genero: "FPS Tactico", disponible: true },
    { nombre: "Grand Theft Auto III", genero: "Accion-Aventura", disponible: true },
    { nombre: "Doom (1993)", genero: "FPS", disponible: true },
    { nombre: "The Legend of Zelda: Ocarina of Time", genero: "Aventura", disponible: true },
    { nombre: "StarCraft", genero: "Estrategia", disponible: true },
    { nombre: "Tetris", genero: "Puzzles", disponible: true }
];

function obtenerJuegos() {
    const juegosEnStorage = localStorage.getItem('juegos');
    if (!juegosEnStorage || JSON.parse(juegosEnStorage).length < juegosIniciales.length) {
        localStorage.setItem('juegos', JSON.stringify(juegosIniciales));
        return juegosIniciales;
    } else {
        return JSON.parse(juegosEnStorage);
    }
}

const juegos = obtenerJuegos();
const ludotecaDiv = document.getElementById('ludoteca');
const juegoForm = document.getElementById('juego-form');
const juegoSelect = document.getElementById('juego-select');
const mensajeDiv = document.getElementById('mensaje');
function renderizarJuegos() {
    ludotecaDiv.innerHTML = ''; 
    juegos.forEach(juego => {
        const juegoParrafo = document.createElement('p'); 
        juegoParrafo.textContent = `Titulo: ${juego.nombre}, Genero: ${juego.genero}, Estado: ${juego.disponible ? 'Disponible' : 'En uso'}`;
        
        if (!juego.disponible) {
            juegoParrafo.style.color = 'red';
        }
        ludotecaDiv.appendChild(juegoParrafo);
    });
}

function popularSelect() {
    juegoSelect.innerHTML = ''; 
    juegos.forEach(juego => {
        const option = document.createElement('option');
        option.value = juego.nombre;
        option.textContent = juego.nombre;
        juegoSelect.appendChild(option);
    });
}

function jugarJuego(nombreJuego) {
    const juegoSeleccionado = juegos.find(j => j.nombre.toLowerCase() === nombreJuego.toLowerCase());
    if (!juegoSeleccionado) {
        mensajeDiv.textContent = 'El juego seleccionado no existe.';
        mensajeDiv.style.color = 'red';
        return;
    }

    if (juegoSeleccionado.disponible) {
        juegos.forEach(j => {
            if (j !== juegoSeleccionado) {
                j.disponible = true;
            }
        });

        juegoSeleccionado.disponible = false;
        mensajeDiv.textContent = `Iniciando ${juegoSeleccionado.nombre}! Que te diviertas.`;
        mensajeDiv.style.color = 'green';

    } else {
        juegoSeleccionado.disponible = true;
        mensajeDiv.textContent = `Has terminado tu sesion de "${juegoSeleccionado.nombre}". Juego liberado.`;
        mensajeDiv.style.color = 'blue';
    }

    localStorage.setItem('juegos', JSON.stringify(juegos));
    renderizarJuegos();
}

juegoForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const juegoSeleccionado = juegoSelect.value;
    
    jugarJuego(juegoSeleccionado);
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarJuegos();
    popularSelect();
});