import mongoose from 'mongoose';
import Producto from '../models/Producto.js';
import Venta from '../models/Venta.js';

// Crea una venta si y solo si hay stock suficiente.
// Usa findOneAndUpdate con condición + transacción para atomicidad.
export async function crearVenta({ productoId, cantidad }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const productoActualizado = await Producto.findOneAndUpdate(
        { _id: productoId, cantidad: { $gte: cantidad } }, // condición de stock
        { $inc: { cantidad: -cantidad } },                 // descuento
        { new: true, session }
        );

        if (!productoActualizado) {
        throw new Error('Stock insuficiente o producto no encontrado');
        }

        const ventaDocs = await Venta.create(
        [{
            producto: productoId,
            cantidad,
            precioUnitario: productoActualizado.precio,
            total: productoActualizado.precio * cantidad
        }],
        { session }
        );

        await session.commitTransaction();
        session.endSession();
        return ventaDocs[0];
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
}
