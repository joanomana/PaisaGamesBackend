import { validationResult } from 'express-validator';
import { crearVenta } from '../services/venta.service.js';

export async function postVenta(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { productoId, cantidad } = req.body;
        const venta = await crearVenta({ productoId, cantidad });
        res.status(201).json(venta);
    } catch (e) { next(e); }
}
