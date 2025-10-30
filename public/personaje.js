// Selector de Personajes con IA - La Calaverita de Juan

const elementos = {
    uploadArea: document.getElementById('upload-area'),
    fileInput: document.getElementById('file-input'),
    loading: document.getElementById('loading'),
    previewContainer: document.getElementById('preview-container'),
    originalImage: document.getElementById('original-image'),
    pixelartImage: document.getElementById('pixelart-image'),
    errorMessage: document.getElementById('error-message'),
    btnUsar: document.getElementById('btn-usar'),
    btnNueva: document.getElementById('btn-nueva')
};

let imagenOriginal = null;
let imagenPixelArt = null;

// Configurar eventos
elementos.uploadArea.addEventListener('click', () => elementos.fileInput.click());
elementos.fileInput.addEventListener('change', handleFileSelect);
elementos.btnUsar.addEventListener('click', usarPersonaje);
elementos.btnNueva.addEventListener('click', resetear);

// Drag and drop
elementos.uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    elementos.uploadArea.classList.add('dragover');
});

elementos.uploadArea.addEventListener('dragleave', () => {
    elementos.uploadArea.classList.remove('dragover');
});

elementos.uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    elementos.uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// Manejar selección de archivo
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Procesar archivo
function handleFile(file) {
    // Validar tipo
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        mostrarError('Por favor sube una imagen JPG o PNG');
        return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
        mostrarError('La imagen es muy grande. Máximo 5MB');
        return;
    }

    // Leer imagen
    const reader = new FileReader();
    reader.onload = (e) => {
        imagenOriginal = e.target.result;
        elementos.originalImage.src = imagenOriginal;
        convertirAPixelArt(imagenOriginal);
    };
    reader.readAsDataURL(file);
}

// Convertir a pixel art usando Canvas (método local sin API)
async function convertirAPixelArt(imagenBase64) {
    ocultarError();
    elementos.loading.classList.add('active');
    elementos.uploadArea.style.display = 'none';

    try {
        // Crear imagen
        const img = new Image();
        img.src = imagenBase64;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        // Crear canvas para pixelar
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Tamaño pixel art (ajustado para mejor calidad)
        const pixelSize = 4; // Reducido para más detalle
        const width = Math.floor(img.width / pixelSize);
        const height = Math.floor(img.height / pixelSize);

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen pequeña (pixelada)
        ctx.drawImage(img, 0, 0, width, height);

        // Obtener datos de píxeles
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Aplicar paleta de colores mexicanos expandida
        const paletaMexicana = [
            [255, 107, 53],   // Naranja
            [139, 71, 137],   // Morado
            [255, 0, 110],    // Rosa
            [6, 255, 165],    // Turquesa
            [255, 210, 63],   // Amarillo
            [0, 0, 0],        // Negro
            [255, 255, 255],  // Blanco
            [139, 69, 19],    // Café
            [255, 140, 0],    // Naranja oscuro
            [128, 0, 128],    // Morado oscuro
            [255, 182, 193],  // Rosa claro
            [255, 228, 181],  // Beige
            [210, 180, 140],  // Café claro
            [169, 169, 169],  // Gris
            [255, 99, 71],    // Rojo tomate
            [50, 205, 50],    // Verde lima
            [0, 191, 255],    // Azul cielo
            [255, 215, 0]     // Dorado
        ];

        // Convertir cada píxel al color más cercano de la paleta
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const colorCercano = encontrarColorCercano(r, g, b, paletaMexicana);
            data[i] = colorCercano[0];
            data[i + 1] = colorCercano[1];
            data[i + 2] = colorCercano[2];
        }

        ctx.putImageData(imageData, 0, 0);

        // Escalar de vuelta con mejor resolución
        const canvasFinal = document.createElement('canvas');
        const ctxFinal = canvasFinal.getContext('2d');
        
        // Tamaño final más grande para mejor calidad
        const finalSize = 512; // Tamaño fijo de alta calidad
        canvasFinal.width = finalSize;
        canvasFinal.height = finalSize;

        // Desactivar suavizado para mantener píxeles nítidos
        ctxFinal.imageSmoothingEnabled = false;
        
        // Calcular dimensiones manteniendo aspecto
        const aspectRatio = width / height;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (aspectRatio > 1) {
            drawWidth = finalSize;
            drawHeight = finalSize / aspectRatio;
            offsetY = (finalSize - drawHeight) / 2;
        } else {
            drawHeight = finalSize;
            drawWidth = finalSize * aspectRatio;
            offsetX = (finalSize - drawWidth) / 2;
        }
        
        // Fondo transparente o blanco
        ctxFinal.fillStyle = 'transparent';
        ctxFinal.fillRect(0, 0, finalSize, finalSize);
        
        ctxFinal.drawImage(canvas, 0, 0, width, height, offsetX, offsetY, drawWidth, drawHeight);

        // Convertir a base64 con máxima calidad
        imagenPixelArt = canvasFinal.toDataURL('image/png', 1.0);
        elementos.pixelartImage.src = imagenPixelArt;

        // Mostrar resultado
        elementos.loading.classList.remove('active');
        elementos.previewContainer.classList.add('active');

    } catch (error) {
        console.error('Error al convertir imagen:', error);
        elementos.loading.classList.remove('active');
        elementos.uploadArea.style.display = 'block';
        mostrarError('Error al procesar la imagen. Intenta con otra foto.');
    }
}

// Encontrar color más cercano en la paleta
function encontrarColorCercano(r, g, b, paleta) {
    let distanciaMinima = Infinity;
    let colorCercano = paleta[0];

    for (const color of paleta) {
        const distancia = Math.sqrt(
            Math.pow(r - color[0], 2) +
            Math.pow(g - color[1], 2) +
            Math.pow(b - color[2], 2)
        );

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            colorCercano = color;
        }
    }

    return colorCercano;
}

// Usar personaje en el juego
function usarPersonaje() {
    if (imagenPixelArt) {
        // Guardar en localStorage
        localStorage.setItem('personajeCustom', imagenPixelArt);
        
        // Crear overlay de éxito
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        overlay.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; max-width: 400px;">
                <div style="font-size: 4rem; margin-bottom: 16px;">🎉</div>
                <h2 style="color: #8B4789; margin-bottom: 16px;">¡Personaje Creado!</h2>
                <img src="${imagenPixelArt}" style="max-width: 150px; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                <p style="color: #2C2C2C; margin-bottom: 24px;">Tu personaje pixel art está listo para la aventura</p>
                <button onclick="window.location.href='index.html'" style="background: #8B4789; color: white; border: none; padding: 14px 32px; font-size: 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Comenzar a Jugar 🎮
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
}

// Resetear para subir nueva foto
function resetear() {
    elementos.previewContainer.classList.remove('active');
    elementos.uploadArea.style.display = 'block';
    elementos.fileInput.value = '';
    imagenOriginal = null;
    imagenPixelArt = null;
}

// Mostrar error
function mostrarError(mensaje) {
    elementos.errorMessage.textContent = mensaje;
    elementos.errorMessage.classList.add('active');
}

// Ocultar error
function ocultarError() {
    elementos.errorMessage.classList.remove('active');
}

// Inicialización
console.log('Selector de personajes cargado');
