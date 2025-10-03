const { Pool } = require('pg');

let pool;

// Configuración de conexión para PostgreSQL
const dbConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inmobiliaria_rg'
};

// Para Railway - usar DATABASE_URL si está disponible
if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig.host = url.hostname;
    dbConfig.port = url.port || 3306;
    dbConfig.user = url.username;
    dbConfig.password = url.password;
    dbConfig.database = url.pathname.slice(1); // Remove leading '/'
}

async function initializeDatabase() {
    try {
        // Crear pool de conexiones PostgreSQL
        pool = new Pool(dbConfig);
        
        // Crear tablas si no existen
        await createTables();
        
        console.log('✅ Base de datos PostgreSQL inicializada correctamente');
        return pool;
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
}

async function createTables() {
    try {
        // Tabla de usuarios (para autenticación del admin)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);

        // Tabla de propiedades
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS properties (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price VARCHAR(100) NOT NULL,
                category ENUM('carousel1', 'carousel2', 'carousel3', 'carousel4', 'carousel5', 'carousel6') NOT NULL,
                status ENUM('active', 'inactive', 'sold', 'rented') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_status (status)
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);

        // Tabla de imágenes de propiedades
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS property_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                property_id INT NOT NULL,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255),
                file_path VARCHAR(500) NOT NULL,
                file_size INT,
                mime_type VARCHAR(100),
                is_main BOOLEAN DEFAULT FALSE,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
                INDEX idx_property_id (property_id),
                INDEX idx_is_main (is_main)
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);

        // Insertar usuario admin por defecto si no existe
        const [existingUser] = await connection.execute(
            'SELECT id FROM users WHERE username = ?', 
            ['Daniel Martinez']
        );

        if (existingUser.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('Daniel Martinez', 10);
            
            await connection.execute(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                ['Daniel Martinez', hashedPassword, 'admin']
            );
            console.log('✅ Usuario admin creado: Daniel Martinez / Daniel Martinez');
        }

        console.log('✅ Tablas creadas/verificadas correctamente');
    } catch (error) {
        console.error('❌ Error al crear tablas:', error);
        throw error;
    }
}

function getConnection() {
    if (!connection) {
        throw new Error('Base de datos no inicializada');
    }
    return connection;
}

module.exports = initializeDatabase;
module.exports.getConnection = getConnection;