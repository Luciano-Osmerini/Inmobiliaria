# 🏠 Inmobiliaria RG - Backend

Backend profesional para Inmobiliaria RG construido con Node.js, Express y MySQL, listo para deploy en Railway.

## 🚀 Características

- ✅ **API REST completa** para gestión de propiedades
- ✅ **Autenticación JWT** para panel de administración
- ✅ **Subida real de imágenes** (hasta 15 por propiedad)
- ✅ **Base de datos MySQL** con relaciones
- ✅ **Frontend integrado** (HTML5UP Alpha theme)
- ✅ **Listo para Railway** deploy automático
- ✅ **Seguridad avanzada** (Helmet, CORS, Rate limiting)

## 📋 Instalación Local

1. **Clonar e instalar dependencias:**
```bash
cd back-end
npm install
```

2. **Configurar base de datos:**
   - Instalar MySQL localmente
   - Crear base de datos `inmobiliaria_rg`
   - Configurar `.env` con tus credenciales

3. **Iniciar servidor:**
```bash
npm run dev  # Desarrollo con nodemon
npm start    # Producción
```

## 🌐 Deploy en Railway

### Paso 1: Preparar el código
```bash
git init
git add .
git commit -m "Initial commit: Inmobiliaria RG Backend"
```

### Paso 2: Crear repositorio en GitHub
1. Crear nuevo repositorio en GitHub: `inmobiliaria-rg-backend`
2. Subir código:
```bash
git remote add origin https://github.com/TU-USUARIO/inmobiliaria-rg-backend.git
git push -u origin main
```

### Paso 3: Deploy en Railway
1. Ir a [railway.app](https://railway.app)
2. Hacer login con GitHub
3. Click "New Project" > "Deploy from GitHub repo"
4. Seleccionar tu repositorio `inmobiliaria-rg-backend`
5. Railway detectará automáticamente que es Node.js

### Paso 4: Configurar base de datos
1. En el dashboard del proyecto, click "New" > "Database" > "Add MySQL"
2. Railway creará automáticamente la variable `DATABASE_URL`
3. El backend se conectará automáticamente

### Paso 5: Configurar variables de entorno
En Railway Settings > Variables, agregar:
```
NODE_ENV=production
JWT_SECRET=tu_clave_secreta_super_segura
```

## 📱 URLs del sitio desplegado

Después del deploy, tendrás:
- **Sitio principal:** `https://tu-proyecto.railway.app`
- **Panel admin:** `https://tu-proyecto.railway.app/admin`
- **Login:** `https://tu-proyecto.railway.app/login`
- **API:** `https://tu-proyecto.railway.app/api/`

## 🔐 Credenciales Admin

**Usuario:** Daniel Martinez  
**Contraseña:** Daniel Martinez

## 📡 API Endpoints

### Públicos (sin autenticación)
- `GET /api/properties` - Obtener todas las propiedades
- `GET /api/properties/category/:category` - Propiedades por categoría
- `GET /api/properties/:id` - Propiedad específica

### Administración (requiere token JWT)
- `POST /api/auth/login` - Login admin
- `POST /api/properties` - Crear propiedad
- `PUT /api/properties/:id` - Actualizar propiedad
- `DELETE /api/properties/:id` - Eliminar propiedad
- `DELETE /api/properties/:id/images/:imageId` - Eliminar imagen
- `PATCH /api/properties/:id/images/:imageId/main` - Establecer imagen principal

## 🗂️ Categorías Disponibles

- `carousel1` - Casas en Venta
- `carousel2` - Apartamentos en Venta  
- `carousel3` - Casas en Alquiler
- `carousel4` - Apartamentos en Alquiler
- `carousel5` - Locales Comerciales
- `carousel6` - Terrenos

## 📁 Estructura del Proyecto

```
back-end/
├── 📁 config/
│   └── database.js         # Configuración MySQL
├── 📁 middleware/
│   ├── auth.js            # Autenticación JWT
│   └── upload.js          # Subida de imágenes
├── 📁 routes/
│   ├── auth.js            # Rutas de autenticación
│   └── properties.js      # Rutas de propiedades
├── 📁 public/             # Frontend (HTML, CSS, JS)
├── 📁 uploads/            # Imágenes subidas
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── railway.toml           # Configuración Railway
└── .env                   # Variables de entorno
```

## 🛠️ Desarrollo

### Scripts disponibles:
- `npm start` - Iniciar servidor de producción
- `npm run dev` - Desarrollo con recarga automática

### Agregar nuevas características:
1. Crear rutas en `/routes`
2. Agregar middleware en `/middleware` 
3. Actualizar base de datos en `/config/database.js`

## 🔒 Seguridad

- ✅ Helmet.js para headers de seguridad
- ✅ CORS configurado correctamente
- ✅ Rate limiting en endpoints API
- ✅ Validación de tipos de archivo
- ✅ Sanitización de datos de entrada
- ✅ JWT con expiración de 24h

## 📊 Base de Datos

### Tablas creadas automáticamente:

**users** - Usuarios administradores
- id, username, password, role, created_at, updated_at

**properties** - Propiedades inmobiliarias  
- id, title, description, price, category, status, created_at, updated_at

**property_images** - Imágenes de propiedades
- id, property_id, filename, original_name, file_path, file_size, mime_type, is_main, sort_order, created_at

## 🆘 Solución de Problemas

### Error de conexión a base de datos:
```bash
# Verificar variables de entorno
echo $DATABASE_URL

# Verificar que MySQL esté corriendo
mysql -u root -p
```

### Error de subida de imágenes:
- Verificar que la carpeta `uploads/` tenga permisos de escritura
- Verificar límite de tamaño (5MB máximo)

### Error 404 en producción:
- Verificar que los archivos estén en la carpeta `public/`
- Revisar logs en Railway dashboard

## 💡 Próximas Mejoras

- [ ] Integración con WhatsApp Business API
- [ ] Sistema de notificaciones por email
- [ ] Búsqueda avanzada con filtros
- [ ] Geolocalización de propiedades
- [ ] Dashboard con estadísticas
- [ ] Backup automático de imágenes

## 📞 Soporte

Para soporte técnico, contactar al desarrollador o revisar los logs en Railway dashboard.

---

**Desarrollado para Inmobiliaria RG - Daniel Martinez**