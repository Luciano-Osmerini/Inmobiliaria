const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            scriptSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP cada 15 minutos
});
app.use('/api/', limiter);

// Middleware general
app.use(compression());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://tu-dominio.railway.app'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// Ruta para servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Ruta para el login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        message: 'La ruta solicitada no existe en este servidor'
    });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'production' 
            ? 'Algo salió mal' 
            : err.message
    });
});

// Inicialización de la base de datos
const initDB = require('./config/database');

async function startServer() {
    try {
        // Inicializar conexión a la base de datos
        await initDB();
        console.log('✅ Base de datos conectada correctamente');
        
        // Iniciar servidor
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📱 Frontend disponible en: http://localhost:${PORT}`);
            console.log(`🔧 Panel Admin en: http://localhost:${PORT}/admin`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();