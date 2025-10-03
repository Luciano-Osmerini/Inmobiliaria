const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Datos de prueba (simula la base de datos)
const mockProperties = {
    carousel1: [
        {
            id: '1-1',
            title: 'Casa Familiar',
            description: '3 dormitorios, 2 baños',
            price: '$180,000',
            images: ['/uploads/placeholder1.jpg']
        }
    ],
    carousel2: [
        {
            id: '2-1',
            title: 'Apartamento Moderno',
            description: '2 dormitorios, 1 baño',
            price: '$120,000',
            images: ['/uploads/placeholder2.jpg']
        }
    ]
};

// Rutas API de prueba
app.get('/api/properties/category/:category', (req, res) => {
    const { category } = req.params;
    const properties = mockProperties[category] || [];
    res.json({
        success: true,
        category,
        data: properties
    });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'Daniel Martinez' && password === 'Daniel Martinez') {
        res.json({
            success: true,
            message: 'Login exitoso',
            token: 'mock-jwt-token',
            user: {
                id: 1,
                username: 'Daniel Martinez',
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Credenciales inválidas',
            message: 'Usuario o contraseña incorrectos'
        });
    }
});

// Servir frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de PRUEBA corriendo en puerto ${PORT}`);
    console.log(`📱 Frontend disponible en: http://localhost:${PORT}`);
    console.log(`🔧 Panel Admin en: http://localhost:${PORT}/admin`);
    console.log(`🔑 Login en: http://localhost:${PORT}/login`);
    console.log('');
    console.log('⚠️  MODO PRUEBA - Sin base de datos real');
    console.log('✅ Para Railway: usar server.js (con MySQL)');
});

module.exports = app;