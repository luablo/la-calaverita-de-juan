// Ranking - La Calaverita de Juan

const elementos = {
    loading: document.getElementById('loading'),
    rankingContainer: document.getElementById('ranking-container'),
    errorMessage: document.getElementById('error-message'),
    allScores: document.getElementById('all-scores')
};

// Cargar ranking al iniciar
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Cargando ranking...');
    cargarRanking();
});

// Cargar ranking desde el servidor
async function cargarRanking() {
    try {
        const response = await fetch('../backend/get_scores.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Datos recibidos:', data);
        
        if (data.success && data.scores && data.scores.length > 0) {
            mostrarRanking(data.scores);
        } else {
            mostrarMensajeVacio();
        }
        
    } catch (error) {
        console.error('❌ Error cargando ranking:', error);
        mostrarError();
    }
}

// Mostrar ranking
function mostrarRanking(scores) {
    elementos.loading.classList.add('hidden');
    elementos.rankingContainer.classList.remove('hidden');
    
    // Top 3
    if (scores.length >= 1) llenarPodio(1, scores[0]);
    if (scores.length >= 2) llenarPodio(2, scores[1]);
    if (scores.length >= 3) llenarPodio(3, scores[2]);
    
    // Resto de puntajes
    elementos.allScores.innerHTML = '';
    scores.forEach((score, index) => {
        const item = crearItemRanking(score, index + 1);
        elementos.allScores.appendChild(item);
    });
    
    console.log('✅ Ranking mostrado correctamente');
}

// Llenar podio (top 3)
function llenarPodio(posicion, score) {
    const podio = document.getElementById(`rank-${posicion}`);
    if (!podio) return;
    
    const avatar = podio.querySelector('img');
    const nombre = podio.querySelector('h3');
    const puntos = podio.querySelector('p:nth-of-type(1)');
    const fecha = podio.querySelector('p:nth-of-type(2)');
    
    // Cargar avatar del localStorage o usar default
    const avatarData = score.avatar || localStorage.getItem('personajeCustom');
    if (avatarData) {
        avatar.src = avatarData;
    } else {
        avatar.src = './img/juan.png';
    }
    
    nombre.textContent = score.nombre;
    puntos.textContent = `${score.puntos} puntos`;
    fecha.textContent = formatearFecha(score.fecha);
}

// Crear item de ranking
function crearItemRanking(score, posicion) {
    const div = document.createElement('div');
    div.className = 'bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 hover:bg-white/30 transition-all duration-300';
    
    // Avatar
    const avatarData = score.avatar || localStorage.getItem('personajeCustom');
    const avatarSrc = avatarData || './img/juan.png';
    
    // Medalla según posición
    let medalla = '';
    if (posicion === 1) medalla = '🥇';
    else if (posicion === 2) medalla = '🥈';
    else if (posicion === 3) medalla = '🥉';
    else medalla = `#${posicion}`;
    
    div.innerHTML = `
        <div class="text-3xl font-bold text-white w-12 text-center">${medalla}</div>
        <img src="${avatarSrc}" alt="Avatar" class="w-16 h-16 rounded-full border-2 border-white shadow-lg avatar-img">
        <div class="flex-1">
            <h4 class="text-xl font-bold text-white">${score.nombre}</h4>
            <p class="text-sm text-white/70">${formatearFecha(score.fecha)}</p>
        </div>
        <div class="text-right">
            <p class="text-2xl font-bold text-amarillo">${score.puntos}</p>
            <p class="text-sm text-white/70">puntos</p>
        </div>
    `;
    
    return div;
}

// Formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const opciones = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-MX', opciones);
}

// Mostrar mensaje vacío
function mostrarMensajeVacio() {
    elementos.loading.classList.add('hidden');
    elementos.rankingContainer.classList.remove('hidden');
    
    elementos.allScores.innerHTML = `
        <div class="text-center py-12">
            <div class="text-6xl mb-4">🎮</div>
            <h3 class="text-2xl font-bold text-white mb-4">¡Sé el primero en jugar!</h3>
            <p class="text-white/80 mb-6">Aún no hay puntajes registrados</p>
            <a href="index.html" class="inline-block bg-gradient-to-r from-rosa to-naranja text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300">
                Comenzar a Jugar
            </a>
        </div>
    `;
}

// Mostrar error
function mostrarError() {
    elementos.loading.classList.add('hidden');
    elementos.errorMessage.classList.remove('hidden');
}
