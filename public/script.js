// La Calaverita de Juan - Main Script

// Estado del juego
const gameState = {
    nombreJugador: '',
    puntos: 0,
    preguntaActual: 0,
    totalPreguntas: 20,
    tiempoRestante: 60, // 1 minuto en segundos
    preguntas: [],
    leyendas: [],
    preguntasRespondidas: [],
    timerInterval: null,
    casaActual: 1
};

// Elementos del DOM
const elementos = {
    pantallaInicio: document.getElementById('pantalla-inicio'),
    pantallaJuego: document.getElementById('pantalla-juego'),
    pantallaLeyenda: document.getElementById('pantalla-leyenda'),
    pantallaFinal: document.getElementById('pantalla-final'),
    nombreInput: document.getElementById('nombre-jugador'),
    btnComenzar: document.getElementById('btn-comenzar'),
    nombreDisplay: document.getElementById('nombre-display'),
    puntosDisplay: document.getElementById('puntos-display'),
    tiempoDisplay: document.getElementById('tiempo-display'),
    casaActual: document.getElementById('casa-actual'),
    textoPregunta: document.getElementById('texto-pregunta'),
    opcionesContainer: document.getElementById('opciones-container'),
    preguntaNumero: document.getElementById('pregunta-numero'),
    totalPreguntasDisplay: document.getElementById('total-preguntas'),
    progresoBar: document.getElementById('progreso-bar'),
    leyendaImg: document.getElementById('leyenda-img'),
    leyendaNombre: document.getElementById('leyenda-nombre'),
    leyendaDescripcion: document.getElementById('leyenda-descripcion'),
    leyendaPregunta: document.getElementById('leyenda-pregunta'),
    leyendaOpciones: document.getElementById('leyenda-opciones'),
    nombreFinal: document.getElementById('nombre-final'),
    puntosFinal: document.getElementById('puntos-final'),
    rankingLista: document.getElementById('ranking-lista'),
    btnJugarNuevo: document.getElementById('btn-jugar-nuevo')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('La Calaverita de Juan initialized');
    cargarDatos();
    configurarEventos();
});

// Cargar datos JSON
async function cargarDatos() {
    try {
        const [preguntasRes, leyendasRes] = await Promise.all([
            fetch('./data/preguntas.json'),
            fetch('./data/leyendas.json')
        ]);

        if (!preguntasRes.ok || !leyendasRes.ok) {
            throw new Error('Error al cargar archivos JSON');
        }

        const preguntasData = await preguntasRes.json();
        const leyendasData = await leyendasRes.json();

        gameState.preguntas = preguntasData.preguntas;
        gameState.leyendas = leyendasData.leyendas;

        console.log('✅ Datos cargados:', gameState.preguntas.length, 'preguntas,', gameState.leyendas.length, 'leyendas');
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        alert('Error al cargar el juego. Verifica que los archivos JSON existan en la carpeta /data/');
    }
}

// Configurar eventos
function configurarEventos() {
    elementos.btnComenzar.addEventListener('click', iniciarJuego);
    elementos.btnJugarNuevo.addEventListener('click', reiniciarJuego);

    elementos.nombreInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') iniciarJuego();
    });
}

// Iniciar juego
function iniciarJuego() {
    const nombre = elementos.nombreInput.value.trim();

    if (!nombre) {
        alert('Por favor ingresa tu nombre');
        return;
    }

    if (gameState.preguntas.length === 0) {
        alert('Esperando a que se carguen los datos...');
        return;
    }

    gameState.nombreJugador = nombre;
    gameState.puntos = 0;
    gameState.preguntaActual = 0;
    gameState.tiempoRestante = 60;
    gameState.preguntasRespondidas = [];
    gameState.casaActual = 1;

    elementos.nombreDisplay.textContent = `👤 ${nombre}`;
    elementos.puntosDisplay.textContent = '0';
    elementos.totalPreguntasDisplay.textContent = gameState.totalPreguntas;

    cambiarPantalla('juego');
    iniciarTemporizador();
    cargarPregunta();
}

// Cambiar pantalla
function cambiarPantalla(pantalla) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('active'));

    switch (pantalla) {
        case 'inicio':
            elementos.pantallaInicio.classList.add('active');
            break;
        case 'juego':
            elementos.pantallaJuego.classList.add('active');
            break;
        case 'leyenda':
            elementos.pantallaLeyenda.classList.add('active');
            break;
        case 'final':
            elementos.pantallaFinal.classList.add('active');
            break;
    }
}

// Temporizador
function iniciarTemporizador() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    gameState.timerInterval = setInterval(() => {
        gameState.tiempoRestante--;
        actualizarTiempo();

        if (gameState.tiempoRestante <= 0) {
            clearInterval(gameState.timerInterval);
            finalizarJuego();
        }
    }, 1000);
}

function actualizarTiempo() {
    const minutos = Math.floor(gameState.tiempoRestante / 60);
    const segundos = gameState.tiempoRestante % 60;
    elementos.tiempoDisplay.textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;
}

// Cargar pregunta
function cargarPregunta() {
    // Verificar si es momento de mostrar leyenda
    if (gameState.preguntaActual > 0 && gameState.preguntaActual % 4 === 0) {
        mostrarLeyenda();
        return;
    }

    // Verificar si terminó el juego
    if (gameState.preguntaActual >= gameState.totalPreguntas) {
        finalizarJuego();
        return;
    }

    // Seleccionar pregunta aleatoria no respondida
    const preguntasDisponibles = gameState.preguntas.filter(
        p => !gameState.preguntasRespondidas.includes(p.id)
    );

    if (preguntasDisponibles.length === 0) {
        finalizarJuego();
        return;
    }

    const pregunta = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
    gameState.preguntaActualData = pregunta;

    // Actualizar UI
    elementos.preguntaNumero.textContent = gameState.preguntaActual + 1;
    elementos.textoPregunta.textContent = pregunta.pregunta;

    // Cambiar casa
    gameState.casaActual = (gameState.casaActual % 4) + 1;
    elementos.casaActual.src = `./img/casa${gameState.casaActual}.png`;

    // Actualizar barra de progreso
    const progreso = ((gameState.preguntaActual + 1) / gameState.totalPreguntas) * 100;
    elementos.progresoBar.style.width = `${progreso}%`;

    // Mostrar opciones
    mostrarOpciones(pregunta.opciones, pregunta.respuesta, elementos.opcionesContainer);
}

// Mostrar opciones
function mostrarOpciones(opciones, respuestaCorrecta, container) {
    container.innerHTML = '';

    opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.className = 'opcion-btn';
        btn.textContent = opcion;
        btn.addEventListener('click', () => verificarRespuesta(index, respuestaCorrecta, btn));
        container.appendChild(btn);
    });
}

// Verificar respuesta
function verificarRespuesta(seleccionada, correcta, boton) {
    const botones = elementos.opcionesContainer.querySelectorAll('.opcion-btn');
    botones.forEach(btn => btn.disabled = true);

    if (seleccionada === correcta) {
        boton.classList.add('correcta');
        gameState.puntos += gameState.preguntaActualData.puntos;
        elementos.puntosDisplay.textContent = gameState.puntos;
    } else {
        boton.classList.add('incorrecta');
        botones[correcta].classList.add('correcta');
        // Restar 5 puntos por respuesta incorrecta (no puede ser negativo)
        gameState.puntos = Math.max(0, gameState.puntos - 5);
        elementos.puntosDisplay.textContent = gameState.puntos;
    }

    gameState.preguntasRespondidas.push(gameState.preguntaActualData.id);
    gameState.preguntaActual++;

    setTimeout(() => {
        cargarPregunta();
    }, 2000);
}

// Mostrar leyenda
function mostrarLeyenda() {
    const leyenda = gameState.leyendas[Math.floor(Math.random() * gameState.leyendas.length)];

    elementos.leyendaImg.src = `./img/${leyenda.imagen}`;
    elementos.leyendaNombre.textContent = leyenda.nombre;
    elementos.leyendaDescripcion.textContent = leyenda.descripcion;
    elementos.leyendaPregunta.textContent = leyenda.pregunta;

    gameState.leyendaActual = leyenda;

    mostrarOpciones(leyenda.opciones, leyenda.respuesta, elementos.leyendaOpciones);

    // Modificar evento de opciones de leyenda
    const botones = elementos.leyendaOpciones.querySelectorAll('.opcion-btn');
    botones.forEach((btn, index) => {
        btn.addEventListener('click', () => verificarRespuestaLeyenda(index, leyenda.respuesta, btn));
    });

    cambiarPantalla('leyenda');
}

// Verificar respuesta de leyenda
function verificarRespuestaLeyenda(seleccionada, correcta, boton) {
    const botones = elementos.leyendaOpciones.querySelectorAll('.opcion-btn');
    botones.forEach(btn => btn.disabled = true);

    if (seleccionada === correcta) {
        boton.classList.add('correcta');
        gameState.puntos += gameState.leyendaActual.puntos;
        elementos.puntosDisplay.textContent = gameState.puntos;
    } else {
        boton.classList.add('incorrecta');
        botones[correcta].classList.add('correcta');
        // Restar 10 puntos por respuesta incorrecta en leyenda (no puede ser negativo)
        gameState.puntos = Math.max(0, gameState.puntos - 10);
        elementos.puntosDisplay.textContent = gameState.puntos;
    }

    gameState.preguntaActual++;

    setTimeout(() => {
        cambiarPantalla('juego');
        cargarPregunta();
    }, 3000);
}

// Finalizar juego
async function finalizarJuego() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    elementos.nombreFinal.textContent = gameState.nombreJugador;
    elementos.puntosFinal.textContent = gameState.puntos;

    // Guardar en localStorage
    guardarEnLocalStorage();

    // Enviar a servidor
    await enviarPuntajeServidor();

    // Cargar ranking
    await cargarRanking();

    cambiarPantalla('final');
}

// Guardar en localStorage
function guardarEnLocalStorage() {
    const puntajes = JSON.parse(localStorage.getItem('puntajes') || '[]');
    puntajes.push({
        nombre: gameState.nombreJugador,
        puntos: gameState.puntos,
        fecha: new Date().toISOString()
    });
    localStorage.setItem('puntajes', JSON.stringify(puntajes));
}

// Enviar puntaje al servidor
async function enviarPuntajeServidor() {
    try {
        const response = await fetch('../backend/save_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: gameState.nombreJugador,
                puntos: gameState.puntos
            })
        });

        const data = await response.json();
        console.log('Puntaje guardado:', data);
    } catch (error) {
        console.error('Error guardando puntaje:', error);
    }
}

// Cargar ranking
async function cargarRanking() {
    try {
        const response = await fetch('../backend/get_scores.php');
        const data = await response.json();

        if (data.success && data.scores.length > 0) {
            mostrarRanking(data.scores);
        } else {
            elementos.rankingLista.innerHTML = '<p>No hay puntajes registrados aún.</p>';
        }
    } catch (error) {
        console.error('Error cargando ranking:', error);
        elementos.rankingLista.innerHTML = '<p>Error al cargar el ranking.</p>';
    }
}

// Mostrar ranking
function mostrarRanking(scores) {
    elementos.rankingLista.innerHTML = '';

    scores.slice(0, 3).forEach((score, index) => {
        const item = document.createElement('div');
        item.className = `ranking-item top${index + 1}`;

        const posicion = document.createElement('span');
        posicion.className = 'ranking-posicion';
        posicion.textContent = `#${index + 1}`;

        const nombre = document.createElement('span');
        nombre.className = 'ranking-nombre';
        nombre.textContent = score.nombre;

        const puntos = document.createElement('span');
        puntos.className = 'ranking-puntos';
        puntos.textContent = `${score.puntos} pts`;

        item.appendChild(posicion);
        item.appendChild(nombre);
        item.appendChild(puntos);

        elementos.rankingLista.appendChild(item);
    });
}

// Reiniciar juego
function reiniciarJuego() {
    gameState.puntos = 0;
    gameState.preguntaActual = 0;
    gameState.tiempoRestante = 60;
    gameState.preguntasRespondidas = [];
    gameState.casaActual = 1;

    elementos.nombreInput.value = '';
    cambiarPantalla('inicio');
}
