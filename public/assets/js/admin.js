// Sistema de Gestión de Propiedades - Inmobiliaria RG
// Administrador: Daniel Martinez

// Verificar autenticación al cargar
$(document).ready(function() {
    checkAuth();
    initializeAdmin();
    loadProperties();
});

// Verificar si el usuario está autenticado
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const adminUser = localStorage.getItem('adminUser');
    
    if (!isLoggedIn || adminUser !== 'Daniel Martinez') {
        alert('Acceso denegado. Serás redirigido al login.');
        window.location.href = 'login.html';
        return;
    }
    
    $('#admin-username').text(adminUser);
}

// Inicializar funcionalidades del admin
function initializeAdmin() {
    // Logout
    $('#logout-btn').click(function() {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUser');
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

// Cargar propiedades desde localStorage
function loadProperties() {
    const savedData = localStorage.getItem('propertiesData');
    if (savedData) {
        propertiesData = JSON.parse(savedData);
    } else {
        // Cargar propiedades por defecto si no hay datos guardados
        initializeDefaultProperties();
    }
    
    // Mostrar propiedades de la primera categoría
    filterPropertiesByCategory('carousel1');
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
function saveProperty() {
    const propertyId = $('#property-id').val();
    const category = $('#property-category').val();
    const title = $('#property-title').val().trim();
    const description = $('#property-description').val().trim();
    const price = $('#property-price').val().trim();
    
    if (!title || !description || !price) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }
    
    // Crear objeto propiedad
    const property = {
        id: propertyId || generateId(category),
        title: title,
        description: description,
        price: price,
        images: []
    };
    
    // Procesar imágenes
    if (currentImages.length === 0) {
        // Sin imágenes - usar placeholder
        property.images = ['https://via.placeholder.com/400x300/666/ffffff?text=Sin+Imagen'];
        savePropertyToData(property, category, propertyId);
    } else {
        // Procesar imágenes existentes y nuevas
        const imagesToProcess = currentImages.filter(img => !img.existing);
        const existingImages = currentImages.filter(img => img.existing).map(img => img.src);
        
        if (imagesToProcess.length === 0) {
            // Solo imágenes existentes
            property.images = existingImages;
            savePropertyToData(property, category, propertyId);
        } else {
            // Procesar nuevas imágenes
            processNewImages(imagesToProcess, existingImages, property, category, propertyId);
        }
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

// Guardar propiedad en los datos
function savePropertyToData(property, category, propertyId) {
    if (!propertiesData[category]) {
        propertiesData[category] = [];
    }
    
    if (propertyId) {
        // Actualizar propiedad existente
        const index = propertiesData[category].findIndex(p => p.id === propertyId);
        if (index !== -1) {
            propertiesData[category][index] = property;
        }
    } else {
        // Agregar nueva propiedad
        propertiesData[category].push(property);
    }
    
    // Guardar en localStorage
    savePropertiesData();
    
    // Actualizar sitio web
    updateWebsiteCarousels();
    
    // Actualizar vista
    filterPropertiesByCategory(category);
    
    // Cerrar modal
    closeModal();
    
    alert('Propiedad guardada exitosamente!');
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
function editProperty(category, propertyId) {
    const property = findProperty(category, propertyId);
    if (property) {
        openModal(property, category);
    }
}

// Eliminar propiedad
function deleteProperty(category, propertyId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
        propertiesData[category] = propertiesData[category].filter(p => p.id !== propertyId);
        savePropertiesData();
        updateWebsiteCarousels();
        filterPropertiesByCategory(category);
        alert('Propiedad eliminada exitosamente!');
    }
}

// Guardar datos en localStorage
function savePropertiesData() {
    localStorage.setItem('propertiesData', JSON.stringify(propertiesData));
}

// Actualizar carruseles en el sitio web
function updateWebsiteCarousels() {
    // Esta función se ejecutaría en el sitio principal
    // Por ahora solo guardamos los datos para que se reflejen cuando se recargue
    console.log('Datos de propiedades actualizados');
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