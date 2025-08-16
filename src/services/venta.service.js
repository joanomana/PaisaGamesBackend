import mongoose from 'mongoose';
import Producto from '../models/Producto.js';
import Venta from '../models/Venta.js';


export async function crearVenta({ productoId, cantidad }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productoActualizado = await Producto.findOneAndUpdate(
        { _id: productoId, stock: { $gte: cantidad } },
        { $inc: { stock: -cantidad } },
        { new: true, session }
        );

        if (!productoActualizado) {
        throw new Error('Stock insuficiente o producto no encontrado');
        }

        const precioUnitario = Number(productoActualizado.precio);
        const subtotal = precioUnitario * Number(cantidad);
        const total = subtotal;

        const [ventaDoc] = await Venta.create(
        [
            {
            cliente: {},
            items: [{ producto: productoId, cantidad, precioUnitario, subtotal }],
            total,
            estado: 'PENDIENTE',
            },
        ],
        { session }
        );

        await session.commitTransaction();

        return await Venta.findById(ventaDoc._id)
        .populate('items.producto', 'nombre plataforma tipo precio imagenes')
        .lean();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}


export async function crearVentaMultiple({ items = [], cliente = {}, metadatos = {} }) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Se requieren items para crear la venta');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const norm = items.map((it) => ({
        producto: it.producto ?? it.productoId,
        cantidad: Number(it.cantidad || 1),
        }));

        const ids = norm.map((i) => i.producto);
        const prods = await Producto.find({ _id: { $in: ids } }).session(session);
        const byId = new Map(prods.map((p) => [String(p._id), p]));

        let total = 0;
        const detalle = [];
        const bulk = [];

        for (const it of norm) {
        const pid = String(it.producto);
        const cant = it.cantidad;
        const prod = byId.get(pid);
        if (!prod) throw new Error(`Producto no existe: ${pid}`);
        if (prod.stock < cant) throw new Error(`Stock insuficiente para ${prod.nombre}`);

        const precioUnitario = Number(prod.precio);
        const subtotal = precioUnitario * cant;
        total += subtotal;

        detalle.push({ producto: prod._id, cantidad: cant, precioUnitario, subtotal });
        bulk.push({
            updateOne: {
            filter: { _id: prod._id, stock: { $gte: cant } },
            update: { $inc: { stock: -cant } },
            },
        });
        }

        if (bulk.length) {
        const res = await Producto.bulkWrite(bulk, { session });

        const ok = (res.modifiedCount ?? 0) + (res.upsertedCount ?? 0);
        if (ok !== bulk.length) {
            throw new Error('No fue posible reservar stock para todos los productos');
        }
        }

        const [ventaDoc] = await Venta.create(
        [
            {
            cliente,
            items: detalle,
            total,
            estado: 'PENDIENTE',
            metadatos,
            },
        ],
        { session }
        );

        await session.commitTransaction();

        return await Venta.findById(ventaDoc._id)
        .populate('items.producto', 'nombre plataforma tipo precio imagenes')
        .lean();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}


export async function listarVentas() {
    return await Venta.find()
        .sort({ createdAt: -1 })
        .populate('items.producto', 'nombre plataforma tipo precio imagenes')
        .lean();
}


export async function actualizarVenta(id, data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const ventaActual = await Venta.findById(id).session(session);
        if (!ventaActual) throw new Error('Venta no encontrada');

        const estadoPrevio = ventaActual.estado;
        const estadoNuevo = data.estado ?? estadoPrevio;
        const cambiaEstado = estadoNuevo !== estadoPrevio;

        if (cambiaEstado) {

        if (estadoNuevo === 'CANCELADA' && estadoPrevio !== 'CANCELADA') {
            const bulk = (ventaActual.items || []).map((it) => ({
            updateOne: {
                filter: { _id: it.producto },
                update: { $inc: { stock: it.cantidad } },
            },
            }));
            if (bulk.length) {
            await Producto.bulkWrite(bulk, { session });
            }
        }


        if (estadoPrevio === 'CANCELADA' && (estadoNuevo === 'PENDIENTE' || estadoNuevo === 'PAGADA')) {
            const ids = (ventaActual.items || []).map((it) => it.producto);
            const prods = await Producto.find({ _id: { $in: ids } }).session(session);
            const byId = new Map(prods.map((p) => [String(p._id), p]));

            for (const it of ventaActual.items || []) {
            const p = byId.get(String(it.producto));
            if (!p) throw new Error(`Producto no existe: ${it.producto}`);
            if (p.stock < it.cantidad) {
                throw new Error(`Stock insuficiente para reactivar: ${p.nombre}`);
            }
            }


            const bulk = (ventaActual.items || []).map((it) => ({
            updateOne: {
                filter: { _id: it.producto, stock: { $gte: it.cantidad } },
                update: { $inc: { stock: -it.cantidad } },
            },
            }));
            if (bulk.length) {
            const res = await Producto.bulkWrite(bulk, { session });
            const ok = (res.modifiedCount ?? 0) + (res.upsertedCount ?? 0);
            if (ok !== bulk.length) {
                throw new Error('No fue posible volver a descontar stock para todos los productos');
            }
            }
        }
        }

        const updated = await Venta.findOneAndUpdate(
        { _id: id, estado: estadoPrevio },
        data,
        { new: true, session }
        )
        .populate('items.producto', 'nombre plataforma tipo precio imagenes')
        .lean();

        if (!updated) {
        throw new Error('La venta cambió de estado concurrentemente. Intenta de nuevo.');
        }

        await session.commitTransaction();
        return updated;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}
