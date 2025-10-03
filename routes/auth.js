const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ruta de login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar datos de entrada
        if (!username || !password) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'Se requieren usuario y contraseña'
            });
        }

        // Buscar usuario en la base de datos
        const connection = getConnection();
        const [users] = await connection.execute(
            'SELECT id, username, password, role FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }

        const user = users[0];

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Generar JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Responder con token y datos del usuario
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'Error al procesar el login'
        });
    }
});

// Ruta para verificar token (útil para el frontend)
router.post('/verify-token', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: req.user
    });
});

// Ruta para renovar token
router.post('/refresh-token', authenticateToken, (req, res) => {
    try {
        const newToken = jwt.sign(
            { 
                userId: req.user.id, 
                username: req.user.username,
                role: req.user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Token renovado',
            token: newToken
        });
    } catch (error) {
        console.error('Error al renovar token:', error);
        res.status(500).json({
            error: 'Error interno',
            message: 'No se pudo renovar el token'
        });
    }
});

// Ruta de logout (opcional, principalmente para limpiar del lado del cliente)
router.post('/logout', (req, res) => {
    res.json({
        message: 'Logout exitoso'
    });
});

module.exports = router;