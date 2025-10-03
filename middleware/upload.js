const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        
        // Crear directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'property-' + uniqueSuffix + extension);
    }
});

// Filtro para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)'));
    }
};

// Configuración de multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB por imagen
        files: 15 // máximo 15 archivos
    },
    fileFilter: fileFilter
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'Archivo demasiado grande',
                message: 'Las imágenes no pueden superar los 5MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Demasiados archivos',
                message: 'Máximo 15 imágenes por propiedad'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                error: 'Campo de archivo inesperado',
                message: 'Nombre de campo incorrecto para la subida de archivos'
            });
        }
    }
    
    if (error.message === 'Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)') {
        return res.status(400).json({
            error: 'Tipo de archivo no permitido',
            message: error.message
        });
    }

    next(error);
};

// Función para eliminar archivos
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        return false;
    }
};

module.exports = {
    upload,
    handleMulterError,
    deleteFile
};