const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                error: 'Token de acceso requerido',
                message: 'Debe iniciar sesión para acceder a este recurso'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar que el usuario aún existe en la base de datos
        const pool = getConnection();
        const result = await pool.query(
            'SELECT id, username, role FROM users WHERE id = $1 AND username = $2',
            [decoded.userId, decoded.username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: 'Token inválido',
                message: 'El usuario no existe o ha sido deshabilitado'
            });
        }

        req.user = {
            id: decoded.userId,
            username: decoded.username,
            role: result.rows[0].role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ 
                error: 'Token inválido',
                message: 'El token proporcionado no es válido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ 
                error: 'Token expirado',
                message: 'Su sesión ha expirado, por favor inicie sesión nuevamente'
            });
        }

        console.error('Error en autenticación:', error);
        return res.status(500).json({ 
            error: 'Error interno',
            message: 'Error al verificar la autenticación'
        });
    }
};

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            error: 'Acceso denegado',
            message: 'Se requieren permisos de administrador'
        });
    }
};

module.exports = {
    authenticateToken,
    requireAdmin
};