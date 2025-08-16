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

const TIPOS = ['JUEGO_FISICO', 'LLAVE_DIGITAL', 'CONSOLA', 'ACCESORIO', 'COLECCIONABLE'];
const PLATAFORMAS = ['XBOX', 'PLAYSTATION', 'NINTENDO', 'PC', 'STEAM', 'EPIC', 'VALORANT', 'MULTI'];

router.get('/', getProductos);

router.get(
    '/:id',
    [param('id').isMongoId().withMessage('id inválido')],
    getProducto
);

router.post(
    '/',
    [
        body('nombre').isString().trim().notEmpty(),
        body('descripcion').isString().trim().notEmpty(),
        body('tipo').isIn(TIPOS).withMessage(`tipo inválido: ${TIPOS.join('|')}`),
        body('plataforma').isIn(PLATAFORMAS).withMessage(`plataforma inválida: ${PLATAFORMAS.join('|')}`),
        body('categoria').isString().trim().notEmpty(),
        body('precio').isFloat({ gt: 0 }).withMessage('precio debe ser > 0'),
        body('stock').isInt({ min: 0 }).withMessage('stock debe ser >= 0'),
        body('imagen').isString().trim().notEmpty(),
        body('metadata').optional().isObject().withMessage('metadata debe ser objeto'),
    ],
    postProducto
);

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
        body('imagen').optional().isString().trim().notEmpty(),
        body('metadata').optional().isObject(),
    ],
    putProducto
);

router.delete(
    '/:id',
    [param('id').isMongoId()],
    deleteProducto
);

export default router;
