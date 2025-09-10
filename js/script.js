const juegos = [
    { nombre: "Half-Life 1", genero: "FPS", disponible: true },
    { nombre: "Halo: Combat Evolved", genero: "FPS", disponible: true },
    { nombre: "Counter-Strike 1.6", genero: "FPS Tactico", disponible: false },
    { nombre: "Grand Theft Auto III", genero: "Accion-Aventura", disponible: true }
];

function buscarJuegoPorNombre(nombre) {
    for (let i = 0; i < juegos.length; i++) {
        if (juegos[i].nombre.toLowerCase() === nombre.toLowerCase()) {
            return juegos[i];
        }
    }
    return null;
}

function mostrarJuegosDisponibles() {
    console.log("--- Juegos Disponibles en la Ludoteca ---");
    let hayDisponibles = false;
    for (const juego of juegos) {
        if (juego.disponible) {
            console.log(`- Titulo: ${juego.nombre}, Genero: ${juego.genero}`);
            hayDisponibles = true;
        }
    }
    if (!hayDisponibles) {
        console.log("No hay juegos disponibles en este momento.");
    }
    console.log("---------------------------------------");
}

function jugarJuego() {
    const nombreJuego = prompt("Ingresa el nombre del juego que quieres iniciar:");

    if (nombreJuego) {
        const juego = buscarJuegoPorNombre(nombreJuego);

        if (juego) {
            if (juego.disponible) {
                juego.disponible = false;
                alert(`Iniciando ${juego.nombre}! Que te diviertas.`);
                console.log(`SESION INICIADA: "${juego.nombre}" ahora esta en uso.`);
            } else {
                alert(`Lo sentimos, "${juego.nombre}" ya esta siendo jugado por otra persona.`);
            }
        } else {
            alert("El juego que buscas no se encuentra en nuestra ludoteca.");
        }
    } else {
        alert("No ingresaste ningun nombre. Operacion cancelada.");
    }
}

function iniciarSimuladorJuegos() {
    let continuar = true;

    while (continuar) {
        const opcion = prompt(
            "Bienvenido a la Ludoteca Digital. Elige una opcion:\n" +
            "1. Ver juegos disponibles\n" +
            "2. Jugar un juego\n" +
            "3. Salir"
        );

        if (opcion === "1") {
            mostrarJuegosDisponibles();
        } else if (opcion === "2") {
            jugarJuego();
        } else if (opcion === "3") {
            continuar = false;
        } else {
            alert("Opcion no valida. Por favor, elige 1, 2 o 3.");
        }
    }

    alert("Gracias por visitar la Ludoteca Digital. ¡Hasta la proxima!");
}
iniciarSimuladorJuegos();
