let saldoCliente = 100.00; 
let juegoAComprar = null; 
let juegos = []; // La lista se llenará asíncronamente con fetch

// Referencias de elementos del DOM
const tiendaDiv = document.getElementById('tienda');
const mensajeDiv = document.getElementById('mensaje');
const saldoDiv = document.getElementById('saldo-actual');

const cartelOverlay = document.getElementById('cartel-overlay');
const infoJuegoCompra = document.getElementById('info-juego-compra');
const infoSaldoActual = document.getElementById('info-saldo-actual');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnCancelar = document.getElementById('btn-cancelar');

/**
 * Carga el saldo del cliente desde localStorage. Soluciona el error NaN.
 */
function obtenerSaldo() {
    const saldoEnStorage = localStorage.getItem('saldo');
    const saldo = parseFloat(saldoEnStorage); 
    if (saldoEnStorage === null || isNaN(saldo)) { 
        localStorage.setItem('saldo', saldoCliente.toFixed(2));
        return saldoCliente;
    } else {
        return saldo;
    }
}

/**
 * FUNCIÓN CLAVE: Carga los juegos desde 'juegos.json' usando fetch.
 */
async function cargarJuegosDesdeFuente() {
    const juegosEnStorage = localStorage.getItem('juegos');
    
    try {
        // La ruta 'juegos.json' funciona si usas un servidor local (Live Server).
        const response = await fetch('juegos.json');
        
        if (!response.ok) {
            throw new Error(`Error al cargar datos: ${response.statusText}. Asegúrese de usar un servidor local.`);
        }
        
        const juegosRemotos = await response.json();
        
        // Lógica de persistencia: Si no hay cambios locales, usa los remotos. Si hay, usa los locales.
        if (!juegosEnStorage || JSON.parse(juegosEnStorage).length !== juegosRemotos.length) {
            localStorage.setItem('juegos', JSON.stringify(juegosRemotos));
            return juegosRemotos;
        } else {
            return JSON.parse(juegosEnStorage);
        }
    } catch (error) {
        console.error("No se pudo cargar juegos.json:", error);
        mensajeDiv.textContent = 'Error: No se pudieron cargar los datos de la tienda. Asegure que el archivo juegos.json exista y esté usando un servidor local.';
        mensajeDiv.style.color = 'red';
        return [];
    }
}

function calcularPrecioFinal(precioOriginal, descuentoPorcentaje) {
    const original = parseFloat(precioOriginal) || 0;
    const descuento = parseFloat(descuentoPorcentaje) || 0;
    
    return original * (1 - descuento / 100);
}

function renderizarJuegos() {
    tiendaDiv.innerHTML = '';
    saldoDiv.textContent = `Saldo Actual: $${saldoCliente.toFixed(2)}`; 

    juegos.forEach(juego => {
        const precioFinal = calcularPrecioFinal(juego.precio, juego.descuento);

        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        
        const gameGenre = document.createElement('p');
        gameGenre.classList.add('game-genre');
        gameGenre.textContent = `Género: ${juego.genero}`;
        cardContent.appendChild(gameGenre);
        
        const gameTitle = document.createElement('p');
        gameTitle.classList.add('game-title');
        gameTitle.textContent = juego.nombre;
        cardContent.appendChild(gameTitle);

        const priceContainer = document.createElement('div');
        priceContainer.classList.add('price-container');

        if (juego.descuento > 0) {
            const discountTag = document.createElement('span');
            discountTag.classList.add('discount-tag');
            discountTag.textContent = `-${juego.descuento}%`;
            priceContainer.appendChild(discountTag);

            const originalPrice = document.createElement('span');
            originalPrice.classList.add('original-price');
            originalPrice.textContent = `$${juego.precio.toFixed(2)} USD`;
            priceContainer.appendChild(originalPrice);
        }

        const finalPrice = document.createElement('span');
        finalPrice.classList.add('final-price');
        finalPrice.textContent = `$${precioFinal.toFixed(2)} USD`; 
        priceContainer.appendChild(finalPrice);
        cardContent.appendChild(priceContainer);

        const buyButtons = document.createElement('div');
        buyButtons.classList.add('buy-buttons');

        const buyBtn = document.createElement('button');
        buyBtn.classList.add('buy-btn');
        buyBtn.textContent = juego.stock > 0 ? '🛒 COMPRAR' : 'AGOTADO';
        buyBtn.disabled = juego.stock <= 0;
        buyBtn.dataset.gameName = juego.nombre;
        buyBtn.addEventListener('click', (e) => {
            // El evento usa el nombre del juego para encontrarlo en el array 'juegos'
            mostrarCartelConfirmacion(e.target.dataset.gameName);
        });
        buyButtons.appendChild(buyBtn);

        const wishlistBtn = document.createElement('button');
        wishlistBtn.classList.add('wishlist-btn');
        wishlistBtn.innerHTML = '❤️';
        wishlistBtn.title = 'Añadir a lista de deseos';
        buyButtons.appendChild(wishlistBtn);

        cardContent.appendChild(buyButtons);
        gameCard.appendChild(cardContent);
        tiendaDiv.appendChild(gameCard);
    });
}

function mostrarCartelConfirmacion(nombreJuego) {
    juegoAComprar = juegos.find(j => j.nombre.toLowerCase() === nombreJuego.toLowerCase());

    if (!juegoAComprar || juegoAComprar.stock <= 0) {
        mensajeDiv.textContent = `ERROR: ${nombreJuego} no está disponible para compra.`;
        mensajeDiv.style.color = 'red';
        return;
    }

    mensajeDiv.textContent = '';
    mensajeDiv.style.color = 'white';

    const precioParaConfirmar = calcularPrecioFinal(juegoAComprar.precio, juegoAComprar.descuento);

    // Muestra la info en el modal
    infoJuegoCompra.innerHTML = `¿Deseas comprar <strong>${juegoAComprar.nombre}</strong> por <strong>$${precioParaConfirmar.toFixed(2)}</strong>?`;
    infoSaldoActual.textContent = `Tu saldo actual es de $${saldoCliente.toFixed(2)}.`;
    
    // Muestra el modal quitando la clase 'oculto'
    cartelOverlay.classList.remove('oculto');
}

function ocultarCartelConfirmacion() {
    // Oculta el modal agregando la clase 'oculto'
    cartelOverlay.classList.add('oculto');
    juegoAComprar = null; 
}

function ejecutarCompra() {
    if (!juegoAComprar) return;

    const precioFinal = calcularPrecioFinal(juegoAComprar.precio, juegoAComprar.descuento);

    if (saldoCliente < precioFinal) {
        mensajeDiv.textContent = `ERROR: No tienes suficiente saldo para comprar ${juegoAComprar.nombre}. Necesitas $${precioFinal.toFixed(2)}.`;
        mensajeDiv.style.color = 'red';
    } else {
        // Lógica de compra
        juegoAComprar.stock -= 1;
        saldoCliente -= precioFinal;

        // Persistencia en LocalStorage
        localStorage.setItem('juegos', JSON.stringify(juegos));
        localStorage.setItem('saldo', saldoCliente.toFixed(2));
        
        mensajeDiv.textContent = `¡COMPRA EXITOSA! Has adquirido "${juegoAComprar.nombre}" por $${precioFinal.toFixed(2)}. Saldo restante: $${saldoCliente.toFixed(2)}.`;
        mensajeDiv.style.color = 'green';
    }

    renderizarJuegos();
    ocultarCartelConfirmacion();
}

// Event Listeners del modal
btnConfirmar.addEventListener('click', ejecutarCompra);
btnCancelar.addEventListener('click', ocultarCartelConfirmacion);

/**
 * Función de inicialización principal.
 */
async function inicializar() {
    saldoCliente = obtenerSaldo();
    juegos = await cargarJuegosDesdeFuente();
    renderizarJuegos();
}

document.addEventListener('DOMContentLoaded', inicializar);