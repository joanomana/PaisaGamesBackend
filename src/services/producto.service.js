import Producto from '../models/Producto.js';

export async function crearProducto(data) {
    return await Producto.create(data);
}

export async function listarProductos() {
    return await Producto.find().sort({ createdAt: -1 });
}

export async function obtenerProducto(id) {
    return await Producto.findById(id);
}

export async function actualizarProducto(id, data) {
    return await Producto.findByIdAndUpdate(id, data, { new: true });
}

export async function eliminarProducto(id) {
    return await Producto.findByIdAndDelete(id);
}
