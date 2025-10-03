// Sistema de Gestión de Propiedades - Inmobiliaria RG
// Administrador: Daniel Martinez

// Verificar autenticación al cargar
$(document).ready(async function() {
    await checkAuth();
    initializeAdmin();
    loadProperties();
});

// Verificar si el usuario está autenticado
async function checkAuth() {
    if (!isAuthenticated()) {
        alert('Acceso denegado. Serás redirigido al login.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Verificar token con el backend
        await API.verifyToken();
        const user = getCurrentUser();
        if (user) {
            $('#admin-username').text(user.username);
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        alert('Sesión expirada. Serás redirigido al login.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

// Inicializar funcionalidades del admin
function initializeAdmin() {
    // Logout
    $('#logout-btn').click(async function() {
        try {
            await API.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
    
    // Agregar propiedad
    $('#add-property-btn').click(function() {
        openModal();
    });
    
    // Cambiar categoría
    $('.tab-btn').click(function() {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        const category = $(this).data('category');
        filterPropertiesByCategory(category);
    });
    
    // Formulario de propiedad
    $('#property-form').submit(function(e) {
        e.preventDefault();
        saveProperty();
    });
    
    // Preview de imágenes múltiples
    $('#property-images').change(function(e) {
        previewImages(e);
    });
}

// Estructura de datos para propiedades
let propertiesData = {
    carousel1: [], // Casas en Venta
    carousel2: [], // Apartamentos en Venta
    carousel3: [], // Casas en Alquiler
    carousel4: [], // Apartamentos en Alquiler
    carousel5: [], // Locales Comerciales
    carousel6: [] // Terrenos
};

// Cargar propiedades desde la API
async function loadProperties() {
    try {
        const response = await API.getAllProperties();
        const properties = response.data || [];
        
        // Organizar propiedades por categoría
        propertiesData = {
            carousel1: [], carousel2: [], carousel3: [],
            carousel4: [], carousel5: [], carousel6: []
        };
        
        properties.forEach(property => {
            if (propertiesData[property.category]) {
                propertiesData[property.category].push(property);
            }
        });
        
        // Mostrar propiedades de la primera categoría
        filterPropertiesByCategory('carousel1');
    } catch (error) {
        console.error('Error loading properties:', error);
        // Fallback: mostrar mensaje de error
        $('#properties-list').html('<p class="error-message">Error al cargar las propiedades. Por favor, recarga la página.</p>');
    }
}

// Inicializar propiedades por defecto
function initializeDefaultProperties() {
    propertiesData = {
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
    
    // Guardar datos iniciales
    savePropertiesData();
}

// Filtrar propiedades por categoría
function filterPropertiesByCategory(category) {
    const properties = propertiesData[category] || [];
    displayProperties(properties, category);
}

// Mostrar propiedades en el grid
function displayProperties(properties, category) {
    const container = $('#properties-list');
    
    if (properties.length === 0) {
        container.html(`
            <div class="empty-state">
                <i class="fas fa-home"></i>
                <h3>No hay propiedades en esta categoría</h3>
                <p>Agrega tu primera propiedad usando el botón "Agregar Nueva Propiedad"</p>
            </div>
        `);
        return;
    }
    
    const html = properties.map(property => {
        const firstImage = property.images && property.images.length > 0 ? property.images[0] : (property.image || 'https://via.placeholder.com/400x300/666/ffffff?text=Sin+Imagen');
        const imageCount = property.images ? property.images.length : (property.image ? 1 : 0);
        
        return `
            <div class="property-card" data-id="${property.id}">
                <div class="property-image-container">
                    <img src="${firstImage}" alt="${property.title}" class="property-image" />
                    ${imageCount > 1 ? `<div class="image-count">+${imageCount - 1}</div>` : ''}
                </div>
                <div class="property-info">
                    <div class="property-title">${property.title}</div>
                    <div class="property-description">${property.description}</div>
                    <div class="property-price">${property.price}</div>
                    <div class="property-actions">
                        <button class="btn-edit" onclick="editProperty('${category}', '${property.id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="deleteProperty('${category}', '${property.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.html(html);
}

// Abrir modal para agregar/editar
function openModal(property = null, category = null) {
    const modal = $('#property-modal');
    const form = $('#property-form')[0];
    
    if (property) {
        // Editar propiedad existente
        $('#modal-title').text('Editar Propiedad');
        $('#property-id').val(property.id);
        $('#property-category').val(category);
        $('#property-title').val(property.title);
        $('#property-description').val(property.description);
        $('#property-price').val(property.price);
        
        if (property.images && property.images.length > 0) {
            displayExistingImages(property.images);
        }
    } else {
        // Nueva propiedad
        $('#modal-title').text('Agregar Nueva Propiedad');
        form.reset();
        $('#property-id').val('');
        $('#images-preview').html('');
        currentImages = [];
        
        // Establecer categoría actual
        const activeCategory = $('.tab-btn.active').data('category');
        $('#property-category').val(activeCategory);
    }
    
    modal.show();
}

// Cerrar modal
function closeModal() {
    $('#property-modal').hide();
    $('#images-preview').html('');
    currentImages = [];
}

// Array para almacenar las imágenes actuales
let currentImages = [];

// Preview de múltiples imágenes
function previewImages(event) {
    const files = Array.from(event.target.files);
    const maxImages = 15;
    
    if (files.length + currentImages.length > maxImages) {
        alert(`Solo puedes subir un máximo de ${maxImages} imágenes por propiedad.`);
        return;
    }
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    src: e.target.result,
                    file: file
                };
                currentImages.push(imageData);
                updateImagesPreview();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Limpiar el input para permitir seleccionar los mismos archivos de nuevo
    event.target.value = '';
}

// Actualizar preview de imágenes
function updateImagesPreview() {
    const preview = $('#images-preview');
    
    if (currentImages.length === 0) {
        preview.html('<div class="empty-preview">No hay imágenes seleccionadas</div>');
        return;
    }
    
    const counterHtml = `<div class="images-counter">${currentImages.length} de 15 imágenes</div>`;
    
    const imagesHtml = currentImages.map((img, index) => `
        <div class="image-preview-item">
            <img src="${img.src}" alt="Preview ${index + 1}" />
            <div class="image-controls">
                <button type="button" class="remove-image" onclick="removeImage(${index})" title="Eliminar imagen">&times;</button>
                ${index > 0 ? `<button type="button" class="move-up" onclick="moveImageUp(${index})" title="Mover arriba">↑</button>` : ''}
                ${index < currentImages.length - 1 ? `<button type="button" class="move-down" onclick="moveImageDown(${index})" title="Mover abajo">↓</button>` : ''}
                ${index > 0 ? `<button type="button" class="set-main" onclick="setAsMainImage(${index})" title="Establecer como principal">★</button>` : ''}
            </div>
        </div>
    `).join('');
    
    preview.html(counterHtml + imagesHtml);
}

// Remover imagen del preview
function removeImage(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
        currentImages.splice(index, 1);
        updateImagesPreview();
    }
}

// Función para reordenar imágenes (mover hacia arriba)
function moveImageUp(index) {
    if (index > 0) {
        [currentImages[index], currentImages[index - 1]] = [currentImages[index - 1], currentImages[index]];
        updateImagesPreview();
    }
}

// Función para reordenar imágenes (mover hacia abajo)
function moveImageDown(index) {
    if (index < currentImages.length - 1) {
        [currentImages[index], currentImages[index + 1]] = [currentImages[index + 1], currentImages[index]];
        updateImagesPreview();
    }
}

// Función para establecer como imagen principal
function setAsMainImage(index) {
    if (index > 0) {
        const mainImage = currentImages.splice(index, 1)[0];
        currentImages.unshift(mainImage);
        updateImagesPreview();
    }
}

// Mostrar imágenes existentes al editar
function displayExistingImages(images) {
    currentImages = images.map(src => ({ src: src, existing: true }));
    updateImagesPreview();
}

// Guardar propiedad
async function saveProperty() {
    const propertyId = $('#property-id').val();
    const category = $('#property-category').val();
    const title = $('#property-title').val().trim();
    const description = $('#property-description').val().trim();
    const price = $('#property-price').val().trim();
    const imagesInput = $('#property-images')[0];
    
    if (!title || !description || !price) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }
    
    // Crear objeto propiedad para la API
    const propertyData = {
        title: title,
        description: description,
        price: price,
        category: category,
        images: imagesInput.files // Archivos de imágenes
    };
    
    try {
        let result;
        if (propertyId) {
            // Actualizar propiedad existente
            result = await API.updateProperty(propertyId, propertyData);
            alert('Propiedad actualizada correctamente.');
        } else {
            // Crear nueva propiedad
            result = await API.createProperty(propertyData);
            alert('Propiedad creada correctamente.');
        }
        
        // Recargar la lista de propiedades
        await loadProperties();
        closeModal();
        
    } catch (error) {
        console.error('Error saving property:', error);
        alert('Error al guardar la propiedad: ' + error.message);
    }
}

// Procesar nuevas imágenes
function processNewImages(newImages, existingImages, property, category, propertyId) {
    let processedCount = 0;
    const totalNew = newImages.length;
    const processedImages = [...existingImages];
    
    newImages.forEach(imgData => {
        const reader = new FileReader();
        reader.onload = function(e) {
            processedImages.push(e.target.result);
            processedCount++;
            
            if (processedCount === totalNew) {
                // Todas las imágenes procesadas
                property.images = processedImages;
                savePropertyToData(property, category, propertyId);
            }
        };
        reader.readAsDataURL(imgData.file);
    });
}

// Función obsoleta - ahora se usa la API directamente
function savePropertyToData(property, category, propertyId) {
    console.warn('savePropertyToData is deprecated - use API.createProperty/updateProperty instead');
    // Esta función ya no se usa - se mantiene para compatibilidad
}

// Generar ID único
function generateId(category) {
    const categoryNumber = category.replace('carousel', '');
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 100);
    return `${categoryNumber}-${timestamp}-${random}`;
}

// Encontrar propiedad por ID
function findProperty(category, propertyId) {
    const properties = propertiesData[category] || [];
    return properties.find(p => p.id === propertyId);
}

// Editar propiedad
async function editProperty(category, propertyId) {
    try {
        const response = await API.getProperty(propertyId);
        const property = response.data;
        if (property) {
            openModal(property, category);
        }
    } catch (error) {
        console.error('Error loading property for edit:', error);
        alert('Error al cargar la propiedad para editar: ' + error.message);
    }
}

// Eliminar propiedad
async function deleteProperty(category, propertyId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
        try {
            await API.deleteProperty(propertyId);
            alert('Propiedad eliminada exitosamente!');
            // Recargar la lista de propiedades
            await loadProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Error al eliminar la propiedad: ' + error.message);
        }
    }
}

// Funciones obsoletas - ahora usamos la API
function savePropertiesData() {
    console.warn('savePropertiesData is deprecated - data is saved automatically via API');
}

function updateWebsiteCarousels() {
    console.warn('updateWebsiteCarousels is deprecated - frontend reloads from API automatically');
}

// Cerrar modal al hacer clic fuera
$(window).click(function(event) {
    const modal = $('#property-modal')[0];
    if (event.target === modal) {
        closeModal();
    }
});

// Tecla ESC para cerrar modal
$(document).keydown(function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});