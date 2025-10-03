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

async function initializeDatabase() {
    try {
        pool = new Pool(dbConfig);

        // Verificar conexión rápida
        await pool.query('SELECT 1');

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
        // Usuarios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(10) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Propiedades
        await pool.query(`
            CREATE TABLE IF NOT EXISTS properties (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price VARCHAR(100) NOT NULL,
                category VARCHAR(20) NOT NULL CHECK (category IN ('carousel1','carousel2','carousel3','carousel4','carousel5','carousel6')),
                status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','inactive','sold','rented')),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Imágenes
        await pool.query(`
            CREATE TABLE IF NOT EXISTS property_images (
                id SERIAL PRIMARY KEY,
                property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255),
                file_path VARCHAR(500) NOT NULL,
                file_size INT,
                mime_type VARCHAR(100),
                is_main BOOLEAN DEFAULT FALSE,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Índices
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_category ON properties (category)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_status ON properties (status)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_property_id ON property_images (property_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_is_main ON property_images (is_main)`);

        // Insertar usuario admin por defecto si no existe
        const { rows } = await pool.query('SELECT id FROM users WHERE username = $1', ['Daniel Martinez']);
        if (rows.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('Daniel Martinez', 10);
            await pool.query(
                'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
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

function getPool() {
    if (!pool) throw new Error('Base de datos no inicializada');
    return pool;
}

module.exports = initializeDatabase;
module.exports.getPool = getPool;