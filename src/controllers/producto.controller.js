import { validationResult } from 'express-validator';
import {crearProducto, listarProductos, obtenerProducto,actualizarProducto, eliminarProducto} from '../services/producto.service.js';

const ALLOWED = ['nombre','descripcion','tipo','plataforma','categoria','precio','stock','imagen','metadata'];

const pickAllowed = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => ALLOWED.includes(k)));

export async function postProducto(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const data = pickAllowed(req.body);      
        const prod = await crearProducto(data);
        res.status(201).json(prod);
    } catch (e) { next(e); }
}

export async function putProducto(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const data = pickAllowed(req.body);      // 👈 también en update
        const item = await actualizarProducto(req.params.id, data);
        if (!item) return res.status(404).json({ error: 'No encontrado' });
        res.json(item);
    } catch (e) { next(e); }
}

export async function getProductos(_req, res, next) {
    try {
        const items = await listarProductos();
        res.json(items);
    } catch (e) { next(e); }
}

export async function getProducto(req, res, next) {
    try {
        const item = await obtenerProducto(req.params.id);
        if (!item) return res.status(404).json({ error: 'No encontrado' });
        res.json(item);
    } catch (e) { next(e); }
}


export async function deleteProducto(req, res, next) {
    try {
        const ok = await eliminarProducto(req.params.id);
        if (!ok) return res.status(404).json({ error: 'No encontrado' });
        res.status(204).send();
    } catch (e) { next(e); }
}
