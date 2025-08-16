import { validationResult } from 'express-validator';
import {
    crearVenta,              
    crearVentaMultiple,      
    listarVentas,
    actualizarVenta,
} from '../services/venta.service.js';

export async function postVenta(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { productoId, cantidad, items, cliente = {}, metadatos = {} } = req.body || {};

        let venta;
        if (Array.isArray(items) && items.length > 0) {

        const normalizados = items.map((it) => ({
            producto: it.producto ?? it.productoId,
            cantidad: Number(it.cantidad || 1),
        }));
        venta = await crearVentaMultiple({ items: normalizados, cliente, metadatos });
        } else {
        venta = await crearVenta({ productoId, cantidad: Number(cantidad || 1) });
        }

        return res.status(201).json(venta);
    } catch (e) {
        next(e);
    }
}

export async function getVentas(_req, res, next) {
    try {
        const ventas = await listarVentas();
        res.json(ventas);
    } catch (e) { next(e); }
}

export async function putVenta(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


        const ALLOWED = ['estado', 'metadatos'];
        const data = Object.fromEntries(
        Object.entries(req.body).filter(([k]) => ALLOWED.includes(k))
        );

        const venta = await actualizarVenta(req.params.id, data);
        if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

        res.json(venta);
    } catch (e) { next(e); }
}
