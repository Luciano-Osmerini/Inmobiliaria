# 🚀 INSTRUCCIONES DE DEPLOY PARA RAILWAY

## ✅ BACKEND COMPLETADO

El backend está 100% listo para Railway con:
- ✅ API REST completa para propiedades
- ✅ Autenticación JWT (Daniel Martinez / Daniel Martinez)
- ✅ Subida de imágenes (hasta 15 por propiedad)
- ✅ Base de datos MySQL con auto-creación
- ✅ Frontend integrado
- ✅ Configuración Railway lista

## 🎯 DEPLOY EN 5 PASOS

### 1️⃣ Crear Repositorio GitHub
```bash
git init
git add .
git commit -m "Inmobiliaria RG Backend - Ready for Railway"
```

### 2️⃣ Subir a GitHub
1. Crear repo en GitHub: `inmobiliaria-rg-backend`
2. Ejecutar:
```bash
git remote add origin https://github.com/TU-USUARIO/inmobiliaria-rg-backend.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy en Railway
1. Ir a [railway.app](https://railway.app)
2. Login con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Seleccionar `inmobiliaria-rg-backend`

### 4️⃣ Agregar Base de Datos
1. En el proyecto Railway: "New" → "Database" → "Add MySQL"
2. Railway conectará automáticamente con `DATABASE_URL`

### 5️⃣ Configurar Variables
En Railway Settings → Variables:
```
NODE_ENV=production
JWT_SECRET=inmobiliaria_rg_secreto_super_seguro_2024
```

## 🌐 RESULTADO FINAL

Después del deploy tendrás:
- **Sitio:** `https://tu-proyecto.railway.app`
- **Admin:** `https://tu-proyecto.railway.app/admin`
- **Login:** `https://tu-proyecto.railway.app/login`

## 🔐 ACCESO ADMIN

**Usuario:** Daniel Martinez  
**Contraseña:** Daniel Martinez

## 🧪 TESTING LOCAL

Para probar sin MySQL:
```bash
npm run test-local
```

Para probar con MySQL completo:
```bash
npm start
```

## 📱 FUNCIONALIDADES

### ✅ PÚBLICAS
- Ver todas las propiedades por categoría
- Carruseles dinámicos actualizados automáticamente
- Responsive design completo

### ✅ ADMINISTRACIÓN
- Login seguro con JWT
- Crear propiedades con múltiples imágenes
- Editar títulos y precios
- Eliminar propiedades
- Gestionar imágenes (establecer principal, eliminar)

## 🚨 IMPORTANTE

- El archivo `server.js` es para producción (Railway)
- El archivo `test-server.js` es solo para testing local
- Railway usará automáticamente `server.js` 

## 📞 PRÓXIMOS PASOS

1. **Deploy en Railway** (15 minutos)
2. **Probar funcionalidades** 
3. **Entregar URL a Daniel**
4. **Opcional:** Configurar dominio personalizado

---

**¡El backend está 100% listo para producción! 🎉**