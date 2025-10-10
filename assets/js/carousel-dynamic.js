// Script dinámico para carruseles que se actualiza con el panel de administración
// Inmobiliaria RG - Sistema de Propiedades Dinámico

// Objeto para mantener el estado de cada carrusel
const carouselStates = {};
let autoScrollIntervals = {};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    loadDynamicProperties();
});

// Cargar propiedades dinámicas desde localStorage
function loadDynamicProperties() {
    const savedData = localStorage.getItem('propertiesData');
    let propertiesData = {};
    
    if (savedData) {
        propertiesData = JSON.parse(savedData);
    } else {
        // Cargar propiedades por defecto
        propertiesData = getDefaultProperties();
    }
    
    // Actualizar todos los carruseles
    updateAllCarousels(propertiesData);
    
    // Inicializar funcionalidad después de actualizar el contenido
    setTimeout(() => {
        initializeAllCarousels();
    }, 100);
}

// Obtener propiedades por defecto
function getDefaultProperties() {
    return {
        carousel1: [
            {
                id: '1-1',
                title: 'Casa Moderna',
                description: '3 dormitorios, 2 baños',
                price: '$150,000',
                image: 'https://via.placeholder.com/400x300/4a90e2/ffffff?text=Casa+Moderna'
            },
            {
                id: '1-2',
                title: 'Casa Familiar',
                description: '4 dormitorios, 3 baños',
                price: '$220,000',
                image: 'https://via.placeholder.com/400x300/50c878/ffffff?text=Casa+Familiar'
            },
            {
                id: '1-3',
                title: 'Casa Colonial',
                description: '5 dormitorios, 4 baños',
                price: '$350,000',
                image: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Casa+Colonial'
            }
        ],
        carousel2: [
            {
                id: '2-1',
                title: 'Apartamento Lujoso',
                description: '2 dormitorios, 2 baños',
                price: '$95,000',
                image: 'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Apartamento+Lujoso'
            },
            {
                id: '2-2',
                title: 'Apartamento Céntrico',
                description: '1 dormitorio, 1 baño',
                price: '$75,000',
                image: 'https://via.placeholder.com/400x300/f39c12/ffffff?text=Apartamento+Céntrico'
            },
            {
                id: '2-3',
                title: 'Apartamento Moderno',
                description: '3 dormitorios, 2 baños',
                price: '$120,000',
                image: 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Apartamento+Moderno'
            }
        ],
        carousel3: [
            {
                id: '3-1',
                title: 'Casa con Jardín',
                description: '3 dormitorios, 2 baños',
                price: '$800/mes',
                image: 'https://via.placeholder.com/400x300/3498db/ffffff?text=Casa+con+Jardín'
            },
            {
                id: '3-2',
                title: 'Casa Suburbana',
                description: '4 dormitorios, 3 baños',
                price: '$1,200/mes',
                image: 'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Casa+Suburbana'
            },
            {
                id: '3-3',
                title: 'Casa Tradicional',
                description: '2 dormitorios, 1 baño',
                price: '$650/mes',
                image: 'https://via.placeholder.com/400x300/e67e22/ffffff?text=Casa+Tradicional'
            }
        ],
        carousel4: [
            {
                id: '4-1',
                title: 'Apartamento Ejecutivo',
                description: '2 dormitorios, 2 baños',
                price: '$900/mes',
                image: 'https://via.placeholder.com/400x300/8e44ad/ffffff?text=Apartamento+Ejecutivo'
            },
            {
                id: '4-2',
                title: 'Apartamento Estudiante',
                description: '1 dormitorio, 1 baño',
                price: '$500/mes',
                image: 'https://via.placeholder.com/400x300/16a085/ffffff?text=Apartamento+Estudiante'
            },
            {
                id: '4-3',
                title: 'Apartamento Familiar',
                description: '3 dormitorios, 2 baños',
                price: '$1,100/mes',
                image: 'https://via.placeholder.com/400x300/c0392b/ffffff?text=Apartamento+Familiar'
            }
        ],
        carousel5: [
            {
                id: '5-1',
                title: 'Local en Centro',
                description: '100m² - Zona comercial',
                price: '$2,500/mes',
                image: 'https://via.placeholder.com/400x300/d35400/ffffff?text=Local+Comercial'
            },
            {
                id: '5-2',
                title: 'Oficina Moderna',
                description: '80m² - Torre empresarial',
                price: '$1,800/mes',
                image: 'https://via.placeholder.com/400x300/27ae60/ffffff?text=Oficina+Moderna'
            },
            {
                id: '5-3',
                title: 'Local Esquina',
                description: '150m² - Ubicación premium',
                price: '$3,200/mes',
                image: 'https://via.placeholder.com/400x300/2980b9/ffffff?text=Local+Esquina'
            }
        ],
        carousel6: [
            {
                id: '6-1',
                title: 'Terreno Urbano',
                description: '500m² - Zona residencial',
                price: '$85,000',
                image: 'https://via.placeholder.com/400x300/795548/ffffff?text=Terreno+Urbano'
            },
            {
                id: '6-2',
                title: 'Terreno Rural',
                description: '2 hectáreas - Campo',
                price: '$120,000',
                image: 'https://via.placeholder.com/400x300/607d8b/ffffff?text=Terreno+Rural'
            },
            {
                id: '6-3',
                title: 'Lote Comercial',
                description: '800m² - Zona comercial',
                price: '$200,000',
                image: 'https://via.placeholder.com/400x300/4caf50/ffffff?text=Lote+Comercial'
            }
        ]
    };
}

// Actualizar todos los carruseles con nuevos datos
function updateAllCarousels(propertiesData) {
    for (let i = 1; i <= 6; i++) {
        const carouselId = `carousel${i}`;
        const properties = propertiesData[carouselId] || [];
        updateCarouselContent(carouselId, properties);
    }
}

// Actualizar contenido de un carrusel específico
function updateCarouselContent(carouselId, properties) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;
    
    // Limpiar contenido actual
    track.innerHTML = '';
    
    // Si no hay propiedades, mostrar mensaje
    if (properties.length === 0) {
        track.innerHTML = `
            <div class="carousel-slide">
                <img src="https://via.placeholder.com/400x300/666/ffffff?text=Sin+Propiedades" alt="Sin propiedades">
                <div class="slide-content">
                    <h4>No hay propiedades disponibles</h4>
                    <p>Próximamente nuevas opciones</p>
                    <span class="price">Consultar</span>
                </div>
            </div>
        `;
        return;
    }
    
    // Generar slides dinámicamente
    properties.forEach(property => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        // Manejar múltiples imágenes o imagen única
        const images = property.images || [property.image || 'https://via.placeholder.com/400x300/666/ffffff?text=Imagen+No+Disponible'];
        const firstImage = images[0];
        const hasMultipleImages = images.length > 1;
        
        slide.innerHTML = `
            <div class="property-image-container">
                <img src="${firstImage}" alt="${property.title}" onerror="this.src='https://via.placeholder.com/400x300/666/ffffff?text=Imagen+No+Disponible'">
                ${hasMultipleImages ? `
                    <div class="property-mini-carousel">
                        <button class="mini-carousel-nav prev" onclick="scrollMiniCarousel(this, -1)">‹</button>
                        <div class="mini-carousel-track" data-images='${JSON.stringify(images)}'>
                            ${images.map((img, index) => `
                                <img src="${img}" alt="${property.title} ${index + 1}" class="mini-carousel-image ${index === 0 ? 'active' : ''}" onclick="changePropertyImage(this, ${index})" />
                            `).join('')}
                        </div>
                        <button class="mini-carousel-nav next" onclick="scrollMiniCarousel(this, 1)">›</button>
                    </div>
                ` : ''}
                ${hasMultipleImages ? `<div class="image-indicator">${images.length} fotos</div>` : ''}
            </div>
            <div class="slide-content">
                <h4>${property.title}</h4>
                <p>${property.description}</p>
                <span class="price">${property.price}</span>
            </div>
        `;
        track.appendChild(slide);
    });
}

// Inicializar todos los carruseles
function initializeAllCarousels() {
    // Limpiar intervalos anteriores
    Object.values(autoScrollIntervals).forEach(interval => {
        clearInterval(interval);
    });
    autoScrollIntervals = {};
    
    for (let i = 1; i <= 10; i++) {
        const carouselId = `carousel${i}`;
        initCarousel(carouselId);
    }
}

// Inicializar un carrusel específico
function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    
    carouselStates[carouselId] = {
        currentIndex: 0,
        totalSlides: slides.length
    };
    
    // Solo iniciar auto-scroll si hay más de 1 slide
    if (slides.length > 1) {
        startAutoScroll(carouselId);
        setupCarouselEvents(carouselId);
    }
}

// Iniciar auto-scroll para un carrusel
function startAutoScroll(carouselId) {
    autoScrollIntervals[carouselId] = setInterval(() => {
        moveCarousel(carouselId, 1);
    }, 5000);
}

// Pausar auto-scroll para un carrusel
function pauseAutoScroll(carouselId) {
    if (autoScrollIntervals[carouselId]) {
        clearInterval(autoScrollIntervals[carouselId]);
    }
}

// Configurar eventos del carrusel (hover para pausar)
function setupCarouselEvents(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    carousel.addEventListener('mouseenter', () => {
        pauseAutoScroll(carouselId);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoScroll(carouselId);
    });
    
    // Touch events para móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        pauseAutoScroll(carouselId);
    });

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(carouselId);
        startAutoScroll(carouselId);
    });
}

// Mover carrusel
function moveCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const state = carouselStates[carouselId];
    
    if (!state || slides.length === 0) return;

    state.currentIndex += direction;

    // Loop infinito
    if (state.currentIndex >= state.totalSlides) {
        state.currentIndex = 0;
    } else if (state.currentIndex < 0) {
        state.currentIndex = state.totalSlides - 1;
    }

    // Calcular el desplazamiento
    const slideWidth = slides[0] ? slides[0].offsetWidth + 30 : 380; // 30px es el margen total
    const offset = -state.currentIndex * slideWidth;
    
    track.style.transform = `translateX(${offset}px)`;
}

// Manejar gestos de swipe en móviles
function handleSwipe(carouselId) {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            moveCarousel(carouselId, 1);
        } else {
            // Swipe right - previous slide
            moveCarousel(carouselId, -1);
        }
    }
}

// Función para refrescar carruseles (llamada desde admin)
function refreshCarousels() {
    loadDynamicProperties();
}

// Escuchar cambios en localStorage (para actualización en tiempo real)
window.addEventListener('storage', function(e) {
    if (e.key === 'propertiesData') {
        loadDynamicProperties();
    }
});

// Cambiar imagen principal de una propiedad
function changePropertyImage(thumbnail, index) {
    const propertyContainer = thumbnail.closest('.carousel-slide');
    const mainImage = propertyContainer.querySelector('.property-image-container > img');
    const allThumbnails = propertyContainer.querySelectorAll('.mini-carousel-image');
    
    // Cambiar imagen principal
    mainImage.src = thumbnail.src;
    
    // Actualizar thumbnails activos
    allThumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Scroll del mini-carrusel
function scrollMiniCarousel(button, direction) {
    const track = button.parentElement.querySelector('.mini-carousel-track');
    const scrollAmount = 120; // Ancho de 3 thumbnails aproximadamente
    
    const newScrollLeft = track.scrollLeft + (direction * scrollAmount);
    track.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
    });
}

// Exponer funciones globalmente para los botones de navegación
window.moveCarousel = moveCarousel;
window.refreshCarousels = refreshCarousels;
window.changePropertyImage = changePropertyImage;
window.scrollMiniCarousel = scrollMiniCarousel;