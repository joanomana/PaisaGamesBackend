// src/routes/venta.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import { postVenta } from '../controllers/venta.controller.js';

const router = Router();

/**
 * @openapi
 * /api/ventas:
 *   post:
 *     summary: Registrar venta (descuenta stock si hay disponibilidad)
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productoId, cantidad]
 *             properties:
 *               productoId:
 *                 type: string
 *                 example: "66b0d7f25a53c00012ab34cd"
 *               cantidad:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Venta creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Venta' }
 *       400:
 *         description: Validación fallida o stock insuficiente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post(
    '/',
    [
        body('productoId').isMongoId().withMessage('productoId inválido'),
        body('cantidad').isInt({ min: 1 }).withMessage('cantidad debe ser >= 1'),
    ],
    postVenta
);

export default router;
