// Sistema de Transiciones - La Calaverita de Juan

// Crear overlay de transición
function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.id = 'page-transition';
    
    overlay.innerHTML = `
        <div class="transition-content">
            <div class="skull-animation">💀</div>
            <div class="loading-text">Cargando...</div>
        </div>
        <div class="flowers-container" id="flowers-container"></div>
    `;
    
    document.body.appendChild(overlay);
    return overlay;
}

// Crear flores cayendo
function createFallingFlowers() {
    const container = document.getElementById('flowers-container');
    if (!container) return;
    
    const flowers = ['🌺', '🌸', '🌼', '🌻'];
    const numberOfFlowers = 8;
    
    for (let i = 0; i < numberOfFlowers; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.left = `${Math.random() * 100}%`;
        flower.style.animationDelay = `${Math.random() * 2}s`;
        flower.style.animationDuration = `${2 + Math.random() * 2}s`;
        container.appendChild(flower);
    }
}

// Navegar con transición
function navigateWithTransition(url) {
    const overlay = document.getElementById('page-transition') || createTransitionOverlay();
    
    // Activar transición
    overlay.classList.add('active');
    createFallingFlowers();
    
    // Agregar efecto de salida al body
    document.body.classList.add('page-exit');
    
    // Navegar después de la animación
    setTimeout(() => {
        window.location.href = url;
    }, 600);
}

// Interceptar clicks en enlaces
function setupTransitionLinks() {
    // Obtener todos los enlaces internos
    const links = document.querySelectorAll('a[href^="./"], a[href^="index.html"], a[href^="home.html"], a[href^="ranking.html"], a[href^="personaje.html"]');
    
    links.forEach(link => {
        // Solo si no tiene clase especial para evitar transición
        if (!link.classList.contains('no-transition')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('href');
                navigateWithTransition(url);
            });
        }
    });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Crear overlay (oculto)
    createTransitionOverlay();
    
    // Setup de enlaces
    setupTransitionLinks();
    
    // Fade in de la página
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('✨ Sistema de transiciones cargado');
});

// Transición al salir de la página
window.addEventListener('beforeunload', () => {
    document.body.classList.add('page-exit');
});
