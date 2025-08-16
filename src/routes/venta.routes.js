import { Router } from 'express';
import { body, param } from 'express-validator';
import {
    postVenta,
    getVentas,
    putVenta
} from '../controllers/venta.controller.js';

const router = Router();

/**
 * @openapi
 * /api/ventas:
 *   post:
 *     summary: Crear venta (1 ítem o multi-ítem)
 *     description: "Acepta dos formatos: (a) productoId + cantidad para una venta de un solo ítem, o (b) items[] para crear UNA venta con múltiples productos."
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [productoId, cantidad]
 *                 properties:
 *                   productoId:
 *                     type: string
 *                     example: "66b0d7f25a53c00012ab34cd"
 *                   cantidad:
 *                     type: integer
 *                     minimum: 1
 *                     example: 2
 *                   cliente:
 *                     type: object
 *                     properties:
 *                       nombre: { type: string, example: "Cliente Demo" }
 *                       email:  { type: string, example: "demo@cliente.com" }
 *                   metadatos:
 *                     type: object
 *                     additionalProperties: true
 *               - type: object
 *                 required: [items]
 *                 properties:
 *                   cliente:
 *                     type: object
 *                     properties:
 *                       nombre: { type: string, example: "Cliente Demo" }
 *                       email:  { type: string, example: "demo@cliente.com" }
 *                   items:
 *                     type: array
 *                     minItems: 1
 *                     items:
 *                       type: object
 *                       required: [cantidad]
 *                       properties:
 *                         producto:
 *                           type: string
 *                           description: ObjectId del producto (alternativamente `productoId`)
 *                           example: "66b0d7f25a53c00012ab34cd"
 *                         productoId:
 *                           type: string
 *                           description: Alias del campo `producto`
 *                           example: "66b0d7f25a53c00012ab34ce"
 *                         cantidad:
 *                           type: integer
 *                           minimum: 1
 *                           example: 3
 *                   metadatos:
 *                     type: object
 *                     additionalProperties: true
 *     responses:
 *       201:
 *         description: Venta creada (una sola venta con 1 o N ítems)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       400:
 *         description: Validación fallida o stock insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    '/',
    [

        body().custom((body) => {
        const hasSingle = body?.productoId && body?.cantidad;
        const hasMulti = Array.isArray(body?.items) && body.items.length > 0;
        if (!hasSingle && !hasMulti) {
            throw new Error('Debes enviar productoId+cantidad o items[] con producto/cantidad');
        }
        return true;
        }),
        // Validaciones opcionales para multi
        body('items').optional().isArray({ min: 1 }),
        body('items.*.producto').optional().isMongoId(),
        body('items.*.productoId').optional().isMongoId(),
        body('items.*.cantidad').optional().isInt({ min: 1 }),

        // Validaciones opcionales para single
        body('productoId').optional().isMongoId().withMessage('productoId inválido'),
        body('cantidad').optional().isInt({ min: 1 }).withMessage('cantidad debe ser >= 1'),

        // Extras
        body('cliente').optional().isObject(),
        body('metadatos').optional().isObject(),
    ],
    postVenta
);

/**
 * @openapi
 * /api/ventas:
 *   get:
 *     summary: Listar todas las ventas
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 */
router.get('/', getVentas);

/**
 * @openapi
 * /api/ventas/{id}:
 *   put:
 *     summary: Actualizar venta (ej. cambiar estado)
 *     tags: [Ventas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [PENDIENTE, PAGADA, CANCELADA]
 *                 example: PAGADA
 *               metadatos:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Venta actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       400:
 *         description: Validación fallida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Venta no encontrada
 */
router.put(
    '/:id',
    [
        param('id').isMongoId().withMessage('id inválido'),
        body('estado').optional().isIn(['PENDIENTE','PAGADA','CANCELADA']),
        body('metadatos').optional().isObject()
    ],
    putVenta
);

export default router;
