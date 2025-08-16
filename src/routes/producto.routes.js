import { Router } from 'express';
import { body, param } from 'express-validator';
import {
    postProducto,
    getProductos,
    getProducto,
    putProducto,
    deleteProducto
} from '../controllers/producto.controller.js';

const router = Router();


const TIPOS = ['JUEGO_FISICO','LLAVE_DIGITAL','CONSOLA','ACCESORIO','COLECCIONABLE'];
const PLATAFORMAS = ['XBOX','PLAYSTATION','NINTENDO','PC','STEAM','EPIC','VALORANT','MULTI'];


const validateImagenesCreate = [
    body('imagenes')
        .isArray({ min: 3 }).withMessage('imagenes debe ser un arreglo con mínimo 3 elementos'),
    body('imagenes.*')
        .isString().trim().notEmpty().withMessage('cada imagen debe ser string no vacío')
        .bail()
        .isURL().withMessage('cada imagen debe ser una URL válida'),
];

const validateImagenesUpdate = [
    body('imagenes').optional().isArray({ min: 3 }),
    body('imagenes.*').optional().isString().trim().notEmpty().isURL(),
];

/**
 * @openapi
 * /api/productos:
 *   get:
 *     summary: Listar productos (con portada)
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductoListItem'
 */
router.get('/', getProductos);

/**
 * @openapi
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener producto por ID (detalle con todas las imágenes)
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductoDetail'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    '/:id',
    [param('id').isMongoId().withMessage('id inválido')],
    getProducto
);

/**
 * @openapi
 * /api/productos:
 *   post:
 *     summary: Crear producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoCreate'
 *     responses:
 *       201:
 *         description: Creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductoDetail'
 *       400:
 *         description: Validación fallida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    '/',
    [
        body('nombre').isString().trim().notEmpty(),
        body('descripcion').isString().trim().notEmpty(),
        body('tipo').isIn(TIPOS),
        body('plataforma').isIn(PLATAFORMAS),
        body('categoria').isString().trim().notEmpty(),
        body('precio').isFloat({ gt: 0 }),
        body('stock').isInt({ min: 0 }),
        ...validateImagenesCreate,
        body('metadata').optional().isObject(),
        // Evitar timestamps del cliente
        body('createdAt').not().exists(),
        body('updatedAt').not().exists(),
    ],
    postProducto
);

/**
 * @openapi
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
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
 *             $ref: '#/components/schemas/ProductoUpdate'
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductoDetail'
 *       400:
 *         description: Validación fallida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No encontrado
 */
router.put(
    '/:id',
    [
        param('id').isMongoId(),
        body('nombre').optional().isString().trim().notEmpty(),
        body('descripcion').optional().isString().trim().notEmpty(),
        body('tipo').optional().isIn(TIPOS),
        body('plataforma').optional().isIn(PLATAFORMAS),
        body('categoria').optional().isString().trim().notEmpty(),
        body('precio').optional().isFloat({ gt: 0 }),
        body('stock').optional().isInt({ min: 0 }),
        ...validateImagenesUpdate,
        body('metadata').optional().isObject(),
        body('createdAt').not().exists(),
        body('updatedAt').not().exists(),
    ],
    putProducto
);

/**
 * @openapi
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 */
router.delete(
    '/:id',
    [param('id').isMongoId()],
    deleteProducto
);

export default router;
