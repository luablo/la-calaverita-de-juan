// La Calaverita de Juan - Main Script

// Niveles de dificultad
const niveles = {
    ofrenda: {
        nombre: 'Ofrenda',
        descripcion: 'Nivel tranquilo para principiantes',
        tiempo: 300, // 5 minutos
        multiplicador: 1,
        emoji: '🕯️'
    },
    calaverita: {
        nombre: 'Calaverita',
        descripcion: 'Nivel normal, equilibrado',
        tiempo: 60, // 1 minuto
        multiplicador: 1.5,
        emoji: '💀'
    },
    mictlan: {
        nombre: 'Mictlán',
        descripcion: 'Nivel difícil, para expertos',
        tiempo: 30, // 30 segundos
        multiplicador: 2,
        emoji: '🔥'
    }
};

// Estado del juego
const gameState = {
    nombreJugador: '',
    puntos: 0,
    preguntaActual: 0,
    totalPreguntas: 20,
    tiempoRestante: 60,
    nivelSeleccionado: 'calaverita',
    multiplicador: 1.5,
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
    console.log('🎮 La Calaverita de Juan initialized');
    cargarDatos();
    configurarEventos();
    verificarPersonaje();
    
    // Debug: verificar si las cards están en el DOM
    setTimeout(() => {
        const cards = document.querySelectorAll('.nivel-card');
        console.log('🔍 Cards de nivel en DOM:', cards.length);
        if (cards.length === 0) {
            console.warn('⚠️ No se encontraron cards de nivel, reintentando...');
            configurarSelectorNivel();
        }
    }, 500);
});

// Verificar si tiene personaje creado
function verificarPersonaje() {
    const personajeCustom = localStorage.getItem('personajeCustom');
    const sinPersonaje = document.getElementById('sin-personaje');
    const conPersonaje = document.getElementById('con-personaje');
    
    console.log('🔍 Verificando personaje...', personajeCustom ? 'Existe' : 'No existe');
    
    if (!sinPersonaje || !conPersonaje) {
        console.error('❌ No se encontraron los elementos sin-personaje o con-personaje');
        return;
    }
    
    if (personajeCustom) {
        // Tiene personaje - mostrar formulario de juego
        sinPersonaje.style.display = 'none';
        conPersonaje.style.display = 'block';
        
        // Mostrar preview del personaje
        const previewPersonaje = document.getElementById('preview-personaje');
        if (previewPersonaje) {
            previewPersonaje.src = personajeCustom;
            console.log('✅ Preview del personaje cargado');
        }
        
        // Cargar en el juego
        cargarPersonajeCustom();
        
        // Configurar selector de nivel DESPUÉS de mostrar el formulario
        setTimeout(() => {
            configurarSelectorNivel();
        }, 100);
        
        console.log('✅ Personaje personalizado detectado y cargado');
    } else {
        // No tiene personaje - pedir que lo cree
        sinPersonaje.style.display = 'block';
        conPersonaje.style.display = 'none';
        console.log('⚠️ No hay personaje creado - mostrando pantalla de creación');
    }
}

// Configurar selector de nivel
function configurarSelectorNivel() {
    const nivelCards = document.querySelectorAll('.nivel-card');
    console.log('🎮 Configurando selector de nivel, cards encontradas:', nivelCards.length);
    
    if (nivelCards.length === 0) {
        console.error('❌ No se encontraron cards de nivel');
        return;
    }
    
    nivelCards.forEach((card, index) => {
        console.log(`Card ${index}:`, card.dataset.nivel);
        
        // Remover listeners anteriores clonando el elemento
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        newCard.addEventListener('click', function() {
            console.log('👆 Click en nivel:', this.dataset.nivel);
            
            // Remover active de todas
            document.querySelectorAll('.nivel-card').forEach(c => c.classList.remove('active'));
            
            // Agregar active a la seleccionada
            this.classList.add('active');
            
            // Guardar nivel seleccionado
            gameState.nivelSeleccionado = this.dataset.nivel;
            
            const nivel = niveles[this.dataset.nivel];
            console.log('✅ Nivel seleccionado:', nivel.nombre, `(${nivel.tiempo}s, x${nivel.multiplicador})`);
        });
    });
}

// Cargar personaje personalizado en el juego
function cargarPersonajeCustom() {
    const personajeCustom = localStorage.getItem('personajeCustom');
    if (personajeCustom) {
        const personajeImg = document.getElementById('personaje-img');
        if (personajeImg) {
            personajeImg.src = personajeCustom;
            personajeImg.style.imageRendering = 'pixelated';
            console.log('✅ Personaje cargado en el juego');
        } else {
            console.error('❌ No se encontró el elemento personaje-img');
        }
    } else {
        console.log('⚠️ No hay personaje personalizado en localStorage');
    }
}

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

    const nivel = niveles[gameState.nivelSeleccionado];
    
    console.log('🎮 Iniciando juego con nivel:', gameState.nivelSeleccionado);
    console.log('⏱️ Tiempo configurado:', nivel.tiempo, 'segundos');
    console.log('💯 Multiplicador:', nivel.multiplicador);
    
    gameState.nombreJugador = nombre;
    gameState.puntos = 0;
    gameState.preguntaActual = 0;
    gameState.tiempoRestante = nivel.tiempo;
    gameState.multiplicador = nivel.multiplicador;
    gameState.preguntasRespondidas = [];
    gameState.casaActual = 1;

    elementos.nombreDisplay.textContent = `👤 ${nombre}`;
    elementos.puntosDisplay.textContent = '0';
    elementos.totalPreguntasDisplay.textContent = gameState.totalPreguntas;

    cambiarPantalla('juego');
    
    // Asegurar que el personaje se cargue al iniciar
    cargarPersonajeCustom();
    
    // Actualizar tiempo en pantalla antes de iniciar
    actualizarTiempo();
    
    iniciarTemporizador();
    cargarPregunta();
}

// Cambiar pantalla
function cambiarPantalla(pantalla) {
    console.log('🔄 Cambiando a pantalla:', pantalla);
    
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
    
    console.log('✅ Pantalla cambiada a:', pantalla);
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
    const tiempoFormateado = `${minutos}:${segundos.toString().padStart(2, '0')}`;
    elementos.tiempoDisplay.textContent = tiempoFormateado;
    console.log('⏱️ Tiempo actualizado:', tiempoFormateado, `(${gameState.tiempoRestante}s restantes)`);
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
        // Aplicar multiplicador del nivel
        const puntosGanados = Math.round(gameState.preguntaActualData.puntos * gameState.multiplicador);
        gameState.puntos += puntosGanados;
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
        // Aplicar multiplicador del nivel a leyendas
        const puntosGanados = Math.round(gameState.leyendaActual.puntos * gameState.multiplicador);
        gameState.puntos += puntosGanados;
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
    // Detener temporizador
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }

    console.log('🏁 Finalizando juego...');

    const nivel = niveles[gameState.nivelSeleccionado];
    
    // Guardar en localStorage
    guardarEnLocalStorage();

    // Enviar a servidor
    await enviarPuntajeServidor();

    console.log('✅ Juego finalizado - Redirigiendo a ranking...');
    
    // Mostrar mensaje de transición
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #8B4789 0%, #FF6B35 100%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: inherit;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
            <h2 style="font-size: 2.5rem; margin-bottom: 10px;">¡Juego Terminado!</h2>
            <p style="font-size: 1.5rem; margin-bottom: 10px;">${gameState.nombreJugador}</p>
            <p style="font-size: 3rem; font-weight: bold; color: #FFD23F; margin-bottom: 10px;">${gameState.puntos} puntos</p>
            <p style="font-size: 1.2rem; opacity: 0.9;">${nivel.emoji} Nivel: ${nivel.nombre} (x${nivel.multiplicador})</p>
            <p style="font-size: 1rem; margin-top: 30px; opacity: 0.8;">Redirigiendo al ranking...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
        window.location.href = 'ranking.html';
    }, 3000);
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
        // Obtener avatar del jugador
        const avatar = localStorage.getItem('personajeCustom') || '';
        
        const response = await fetch('../backend/save_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: gameState.nombreJugador,
                puntos: gameState.puntos,
                avatar: avatar
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
