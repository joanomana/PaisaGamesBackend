# 🎮 PaisaGames - Control de Inventario de Tienda de Videojuegos

Una aplicación **Full Stack** para gestionar el inventario y ventas de una tienda de videojuegos físicos y consolas. Desarrollada con **Node.js + Express** en el backend y **MongoDB** como base de datos.

## 📋 Descripción del Proyecto

PaisaGames es un sistema de gestión que permite:
- ✅ Registrar productos (juegos, consolas, accesorios, coleccionables)
- ✅ Gestionar inventario con control de stock
- ✅ Procesar ventas con descuento automático de inventario
- ✅ Validación de stock insuficiente
- ✅ API REST completamente documentada con Swagger
- ✅ Frontend para interacción del usuario


## Video
- Link: [https://drive.google.com/file/d/1C5He7heYDfVm9qSdnXJ3b74VdND5W1mO/view?usp=drive_link](https://drive.google.com/file/d/1C5He7heYDfVm9qSdnXJ3b74VdND5W1mO/view?usp=drive_link)

 
## 🚀 Características Principales

### Backend (Node.js + Express)
- **Modularización completa**: Separación en rutas, controladores, modelos, servicios y middleware
- **Variables de entorno**: Configuración segura con dotenv
- **Validaciones robustas**: express-validator en todas las rutas
- **Base de datos**: MongoDB con Mongoose
- **CORS configurado**: Comunicación segura con el frontend
- **Manejo de errores centralizado**
- **Documentación automática**: Swagger UI integrado
- **Seeding automático**: Datos de prueba al iniciar

### Funcionalidades
- **Gestión de Productos**: CRUD completo con categorización por tipo y plataforma
- **Control de Ventas**: Sistema de ventas con descuento automático de stock
- **Validación de Inventario**: Prevención de ventas con stock insuficiente
- **API Health Check**: Endpoint para monitoreo del sistema

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Node.js** (v18 o superior)
- **MongoDB** (local o remoto)
- **npm** o **yarn**

### 1. Clonar el repositorio
```bash
git clone https://github.com/joanomana/PaisaGamesBackend.git
cd PaisaGamesBackend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
MONGODB_URI=mongodb://127.0.0.1:27017/PaisaGames

# Servidor
PORT=4000
NODE_ENV=development
// Opcional

```

### 4. Iniciar el servidor
```bash
# Modo desarrollo (con nodemon)
npm run dev


```

El servidor estará disponible en: `http://localhost:4000`

## 📚 Documentación de la API

### Swagger UI
Accede a la documentación interactiva en: `http://localhost:4000/docs`

### Endpoints Principales

#### Health Check
```http
GET /health
```
Respuesta:
```json
{
  "status": "ok",
  "db": 1,
  "uptime": 123.456
}
```

#### Productos

**Listar todos los productos**
```http
GET /api/productos
```

**Obtener un producto**
```http
GET /api/productos/{id}
```

**Crear producto**
```http
POST /api/productos
Content-Type: application/json

{
  "nombre": "Call of Duty: Modern Warfare III",
  "descripcion": "El último juego de la saga COD",
  "tipo": "JUEGO_FISICO",
  "plataforma": "PLAYSTATION",
  "categoria": "Acción",
  "precio": 280000,
  "stock": 15,
  "imagenes": [
    "https://example.com/imagen1.jpg",
    "https://example.com/imagen2.jpg",
    "https://example.com/imagen3.jpg"
  ]
}
```

**Actualizar producto**
```http
PUT /api/productos/{id}
```

#### Ventas

**Crear venta (un solo producto)**
```http
POST /api/ventas
Content-Type: application/json

{
  "productoId": "66b0d7f25a53c00012ab34cd",
  "cantidad": 2,
  "cliente": {
    "nombre": "Juan Pérez",
    "email": "juan@email.com"
  }
}
```

**Crear venta (múltiples productos)**
```http
POST /api/ventas
Content-Type: application/json

{
  "cliente": {
    "nombre": "María García",
    "email": "maria@email.com"
  },
  "items": [
    {
      "producto": "66b0d7f25a53c00012ab34cd",
      "cantidad": 1
    },
    {
      "productoId": "66b0d7f25a53c00012ab34ce",
      "cantidad": 3
    }
  ]
}
```

**Listar ventas**
```http
GET /api/ventas
```

**Actualizar venta**
```http
PUT /api/ventas/{id}
Content-Type: application/json

{
  "estado": "PAGADA"
}
```

## 🗂️ Estructura del Proyecto

```
PaisaGames/
├── app.js                      # Configuración de Express
├── server.js                   # Punto de entrada del servidor
├── package.json               # Dependencias y scripts
├── .env                       # Variables de entorno
└── src/
    ├── config/
    │   ├── db.js             # Configuración de MongoDB
    │   └── swagger.js        # Configuración de Swagger
    ├── controllers/
    │   ├── producto.controller.js
    │   └── venta.controller.js
    ├── middleware/
    │   └── errorHandler.js   # Manejo centralizado de errores
    ├── models/
    │   ├── Producto.js       # Modelo de productos
    │   └── Venta.js          # Modelo de ventas
    ├── routes/
    │   ├── producto.routes.js
    │   └── venta.routes.js
    ├── services/
    │   ├── producto.service.js
    │   └── venta.service.js
    └── seed/
        └── index.js          # Datos de prueba
```

## 🧪 Datos de Prueba

Al iniciar el servidor, se ejecuta automáticamente un seeding que crea productos de ejemplo:
- Juegos físicos y digitales
- Consolas (PlayStation, Xbox, Nintendo)
- Accesorios y coleccionables

## 🔧 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar en modo desarrollo (con nodemon)
npm test           # Ejecutar tests (por implementar)
```

## 🌐 CORS y Comunicación Frontend

El proyecto tiene CORS configurado de manera abierta para desarrollo:

```javascript
app.use(cors()); // Permite todas las origins
```

**Para producción**, se recomienda restringir los orígenes:

```javascript
app.use(cors({
  origin: ['https://tu-frontend.com', 'http://localhost:3000']
}));
```

## 🔒 Validaciones Implementadas

### Productos
- ✅ Campos requeridos: `nombre`, `tipo`, `plataforma`, `precio`, `stock`, `imagenes`
- ✅ Validación de tipos y plataformas permitidas
- ✅ Precios y stock no negativos
- ✅ Mínimo 3 imágenes requeridas

### Ventas
- ✅ Validación de stock disponible antes de la venta
- ✅ Descuento automático del inventario
- ✅ Soporte para ventas de un solo ítem o múltiples ítems
- ✅ Validación de ObjectIds de MongoDB
- ✅ Estados de venta: PENDIENTE, PAGADA, CANCELADA

## 📊 Modelos de Datos

### Producto
```javascript
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  tipo: ['JUEGO_FISICO', 'LLAVE_DIGITAL', 'CONSOLA', 'ACCESORIO', 'COLECCIONABLE'],
  plataforma: ['XBOX', 'PLAYSTATION', 'NINTENDO', 'PC', 'STEAM', 'EPIC', 'VALORANT', 'MULTI'],
  categoria: String,
  precio: Number,
  stock: Number,
  imagenes: [String], // Mínimo 3 URLs
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date,
  portada: String // Virtual: primera imagen
}
```

### Venta
```javascript
{
  _id: ObjectId,
  cliente: {
    nombre: String,
    email: String
  },
  items: [{
    producto: ObjectId, // Ref a Producto
    cantidad: Number,
    precioUnitario: Number,
    subtotal: Number
  }],
  total: Number,
  estado: ['PENDIENTE', 'PAGADA', 'CANCELADA'],
  metadatos: Mixed,
  createdAt: Date,
  updatedAt: Date,
  cantidadTotal: Number // Virtual: suma de todas las cantidades
}
```

## 🚀 Despliegue

### Variables de Entorno para Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/PaisaGames
PORT=4000
```

## 🔗 Enlaces

- **Repositorio Backend**: [https://github.com/joanomana/PaisaGames](https://github.com/joanomana/PaisaGames)
- **Repositorio Frontend**: [https://github.com/joanomana/paisagamesfrontend](https://github.com/joanomana/paisagamesfrontend)
- **Enlace despliegue Frontend**: [https://paisagamesfrontend.vercel.app/](https://paisagamesfrontend.vercel.app/)
- **Documentación API**: `http://localhost:4000/docs`
- **Health Check**: `http://localhost:4000/health`

## 👥 Equipo de Desarrollo

- Joan Omaña

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## ✅ Checklist de Requerimientos Cumplidos

### Backend Obligatorio
- ✅ **Node.js + Express**: Implementado
- ✅ **MongoDB**: Configurado con Mongoose
- ✅ **Variables de entorno**: dotenv configurado
- ✅ **Modularización**: Código separado en carpetas organizadas
- ✅ **express-validator**: Validaciones en todas las rutas
- ✅ **Manejo de errores**: Middleware centralizado
- ✅ **CORS**: Configurado para comunicación con frontend
- ✅ **Códigos HTTP**: Respuestas correctas (200, 201, 400, 404, 500)

### Funcionalidades Mínimas
- ✅ **Registro de productos**: Con nombre, tipo, precio, cantidad
- ✅ **Registro de ventas**: Selección de producto y descuento de stock
- ✅ **Validación de stock**: No permite ventas con stock insuficiente
- ✅ **API REST**: Endpoints completos y documentados

### Documentación
- ✅ **README completo**: Explicación, instalación, ejemplos
- ✅ **Variables de entorno**: Documentadas y explicadas
- ✅ **Ejemplos de endpoints**: Con payloads de ejemplo
- ✅ **Link al frontend**: Preparado para ser agregado