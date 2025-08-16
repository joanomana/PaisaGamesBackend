import { Router } from 'express';
import { body } from 'express-validator';
import { postVenta } from '../controllers/venta.controller.js';

const router = Router();

router.post(
    '/',
    [
        body('productoId').isMongoId().withMessage('productoId inválido'),
        body('cantidad').isInt({ min: 1 }).withMessage('cantidad debe ser >= 1'),
    ],
    postVenta
);

export default router;
