import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/config/swagger.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import productoRoutes from './src/routes/producto.routes.js';
import ventaRoutes from './src/routes/venta.routes.js';
import errorHandler from './src/middleware/errorHandler.js';

const app = express();

app.use(express.json());

// CORS abierto (para probar). En prod, restringe con origin específico.
app.use(cors());

// Healthcheck (útil para probar que está arriba)
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        db: mongoose.connection.readyState, // 0=disconnected,1=connected,2=connecting,3=disconnecting
        uptime: process.uptime(),
    });
});

// Rutas principales
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);

// Docs Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Manejo de errores centralizado
app.use(errorHandler);

export default app;
