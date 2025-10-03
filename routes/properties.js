const express = require('express');
const path = require('path');
const { getConnection } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { upload, handleMulterError, deleteFile } = require('../middleware/upload');

const router = express.Router();

// Obtener todas las propiedades (público)
router.get('/', async (req, res) => {
    try {
        const connection = getConnection();
        
        const [properties] = await connection.execute(`
            SELECT 
                p.*,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id', pi.id,
                        'filename', pi.filename,
                        'original_name', pi.original_name,
                        'file_path', pi.file_path,
                        'is_main', pi.is_main,
                        'sort_order', pi.sort_order
                    ) ORDER BY pi.is_main DESC, pi.sort_order ASC
                ) as images
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            WHERE p.status = 'active'
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);

        // Procesar las imágenes para cada propiedad
        const processedProperties = properties.map(property => {
            const images = property.images 
                ? property.images.split(',').map(img => JSON.parse(img))
                : [];
            
            return {
                ...property,
                images: images.map(img => ({
                    ...img,
                    url: `/uploads/${img.filename}`
                }))
            };
        });

        res.json({
            success: true,
            data: processedProperties
        });

    } catch (error) {
        console.error('Error al obtener propiedades:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudieron obtener las propiedades'
        });
    }
});

// Obtener propiedades por categoría (público)
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        // Validar categoría
        const validCategories = ['carousel1', 'carousel2', 'carousel3', 'carousel4', 'carousel5', 'carousel6'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                error: 'Categoría inválida',
                message: 'La categoría especificada no existe'
            });
        }

        const connection = getConnection();
        
        const [properties] = await connection.execute(`
            SELECT 
                p.*,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id', pi.id,
                        'filename', pi.filename,
                        'original_name', pi.original_name,
                        'file_path', pi.file_path,
                        'is_main', pi.is_main,
                        'sort_order', pi.sort_order
                    ) ORDER BY pi.is_main DESC, pi.sort_order ASC
                ) as images
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            WHERE p.category = ? AND p.status = 'active'
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `, [category]);

        // Procesar las imágenes para cada propiedad
        const processedProperties = properties.map(property => {
            const images = property.images 
                ? property.images.split(',').map(img => JSON.parse(img))
                : [];
            
            return {
                ...property,
                images: images.map(img => ({
                    ...img,
                    url: `/uploads/${img.filename}`
                }))
            };
        });

        res.json({
            success: true,
            category,
            data: processedProperties
        });

    } catch (error) {
        console.error('Error al obtener propiedades por categoría:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudieron obtener las propiedades de la categoría'
        });
    }
});

// Obtener una propiedad específica (público)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const connection = getConnection();
        
        const [properties] = await connection.execute(`
            SELECT 
                p.*,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id', pi.id,
                        'filename', pi.filename,
                        'original_name', pi.original_name,
                        'file_path', pi.file_path,
                        'is_main', pi.is_main,
                        'sort_order', pi.sort_order
                    ) ORDER BY pi.is_main DESC, pi.sort_order ASC
                ) as images
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            WHERE p.id = ? AND p.status = 'active'
            GROUP BY p.id
        `, [id]);

        if (properties.length === 0) {
            return res.status(404).json({
                error: 'Propiedad no encontrada',
                message: 'La propiedad especificada no existe o no está disponible'
            });
        }

        const property = properties[0];
        const images = property.images 
            ? property.images.split(',').map(img => JSON.parse(img))
            : [];
        
        const processedProperty = {
            ...property,
            images: images.map(img => ({
                ...img,
                url: `/uploads/${img.filename}`
            }))
        };

        res.json({
            success: true,
            data: processedProperty
        });

    } catch (error) {
        console.error('Error al obtener propiedad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo obtener la propiedad'
        });
    }
});

// Las siguientes rutas requieren autenticación de admin

// Crear nueva propiedad (solo admin)
router.post('/', authenticateToken, requireAdmin, upload.array('images', 15), async (req, res) => {
    try {
        const { title, description, price, category } = req.body;
        
        // Validar datos requeridos
        if (!title || !description || !price || !category) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'Se requieren título, descripción, precio y categoría'
            });
        }

        // Validar categoría
        const validCategories = ['carousel1', 'carousel2', 'carousel3', 'carousel4', 'carousel5', 'carousel6'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                error: 'Categoría inválida',
                message: 'La categoría especificada no existe'
            });
        }

        const connection = getConnection();
        
        // Insertar propiedad
        const [result] = await connection.execute(
            'INSERT INTO properties (title, description, price, category) VALUES (?, ?, ?, ?)',
            [title, description, price, category]
        );

        const propertyId = result.insertId;

        // Procesar imágenes si fueron subidas
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const isMain = i === 0; // La primera imagen es la principal
                
                await connection.execute(
                    `INSERT INTO property_images 
                    (property_id, filename, original_name, file_path, file_size, mime_type, is_main, sort_order) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        propertyId,
                        file.filename,
                        file.originalname,
                        file.path,
                        file.size,
                        file.mimetype,
                        isMain,
                        i
                    ]
                );
            }
        }

        res.status(201).json({
            success: true,
            message: 'Propiedad creada exitosamente',
            data: {
                id: propertyId,
                title,
                description,
                price,
                category,
                images_uploaded: req.files ? req.files.length : 0
            }
        });

    } catch (error) {
        console.error('Error al crear propiedad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo crear la propiedad'
        });
    }
});

// Actualizar propiedad (solo admin)
router.put('/:id', authenticateToken, requireAdmin, upload.array('images', 15), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, status } = req.body;
        
        const connection = getConnection();
        
        // Verificar que la propiedad existe
        const [existing] = await connection.execute('SELECT id FROM properties WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                error: 'Propiedad no encontrada',
                message: 'La propiedad especificada no existe'
            });
        }

        // Actualizar propiedad
        await connection.execute(
            'UPDATE properties SET title = ?, description = ?, price = ?, category = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [title, description, price, category, status || 'active', id]
        );

        // Procesar nuevas imágenes si fueron subidas
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                
                await connection.execute(
                    `INSERT INTO property_images 
                    (property_id, filename, original_name, file_path, file_size, mime_type, is_main, sort_order) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id,
                        file.filename,
                        file.originalname,
                        file.path,
                        file.size,
                        file.mimetype,
                        false, // Las nuevas imágenes no son principales por defecto
                        999 + i // Ordenar al final
                    ]
                );
            }
        }

        res.json({
            success: true,
            message: 'Propiedad actualizada exitosamente',
            data: {
                id,
                title,
                description,
                price,
                category,
                status: status || 'active',
                new_images_uploaded: req.files ? req.files.length : 0
            }
        });

    } catch (error) {
        console.error('Error al actualizar propiedad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo actualizar la propiedad'
        });
    }
});

// Eliminar propiedad (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const connection = getConnection();
        
        // Obtener imágenes para eliminar archivos físicos
        const [images] = await connection.execute(
            'SELECT filename, file_path FROM property_images WHERE property_id = ?',
            [id]
        );

        // Eliminar propiedad (esto eliminará automáticamente las imágenes por CASCADE)
        const [result] = await connection.execute('DELETE FROM properties WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Propiedad no encontrada',
                message: 'La propiedad especificada no existe'
            });
        }

        // Eliminar archivos físicos de imágenes
        images.forEach(image => {
            deleteFile(image.file_path);
        });

        res.json({
            success: true,
            message: 'Propiedad eliminada exitosamente',
            data: {
                id,
                deleted_images: images.length
            }
        });

    } catch (error) {
        console.error('Error al eliminar propiedad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo eliminar la propiedad'
        });
    }
});

// Eliminar imagen específica (solo admin)
router.delete('/:propertyId/images/:imageId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { propertyId, imageId } = req.params;
        
        const connection = getConnection();
        
        // Obtener información de la imagen
        const [images] = await connection.execute(
            'SELECT id, filename, file_path, is_main FROM property_images WHERE id = ? AND property_id = ?',
            [imageId, propertyId]
        );

        if (images.length === 0) {
            return res.status(404).json({
                error: 'Imagen no encontrada',
                message: 'La imagen especificada no existe'
            });
        }

        const image = images[0];

        // Eliminar de la base de datos
        await connection.execute('DELETE FROM property_images WHERE id = ?', [imageId]);

        // Eliminar archivo físico
        deleteFile(image.file_path);

        // Si era la imagen principal, asignar otra como principal
        if (image.is_main) {
            const [otherImages] = await connection.execute(
                'SELECT id FROM property_images WHERE property_id = ? ORDER BY sort_order ASC LIMIT 1',
                [propertyId]
            );
            
            if (otherImages.length > 0) {
                await connection.execute(
                    'UPDATE property_images SET is_main = TRUE WHERE id = ?',
                    [otherImages[0].id]
                );
            }
        }

        res.json({
            success: true,
            message: 'Imagen eliminada exitosamente',
            data: {
                property_id: propertyId,
                image_id: imageId
            }
        });

    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo eliminar la imagen'
        });
    }
});

// Establecer imagen principal (solo admin)
router.patch('/:propertyId/images/:imageId/main', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { propertyId, imageId } = req.params;
        
        const connection = getConnection();
        
        // Verificar que la imagen existe
        const [images] = await connection.execute(
            'SELECT id FROM property_images WHERE id = ? AND property_id = ?',
            [imageId, propertyId]
        );

        if (images.length === 0) {
            return res.status(404).json({
                error: 'Imagen no encontrada',
                message: 'La imagen especificada no existe'
            });
        }

        // Quitar la marca de principal de todas las imágenes de esta propiedad
        await connection.execute(
            'UPDATE property_images SET is_main = FALSE WHERE property_id = ?',
            [propertyId]
        );

        // Establecer la nueva imagen principal
        await connection.execute(
            'UPDATE property_images SET is_main = TRUE WHERE id = ?',
            [imageId]
        );

        res.json({
            success: true,
            message: 'Imagen principal establecida exitosamente',
            data: {
                property_id: propertyId,
                main_image_id: imageId
            }
        });

    } catch (error) {
        console.error('Error al establecer imagen principal:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo establecer la imagen principal'
        });
    }
});

// Usar middleware de manejo de errores de multer
router.use(handleMulterError);

module.exports = router;