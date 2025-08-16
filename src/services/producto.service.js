import Producto from '../models/Producto.js';


export async function crearProducto(data) {
    return await Producto.create(data);
}


export async function listarProductos() {
    const rows = await Producto
        .find({}, 'nombre precio stock tipo plataforma categoria imagenes createdAt') 
        .slice('imagenes', 1)   
        .sort({ createdAt: -1 })
        .lean();

    return rows.map(p => ({
        _id: p._id,
        nombre: p.nombre,
        precio: p.precio,
        stock: p.stock,
        tipo: p.tipo,
        plataforma: p.plataforma,
        categoria: p.categoria,
        portada: p.imagenes && p.imagenes.length ? p.imagenes[0] : null,
        createdAt: p.createdAt,
    }));
}


export async function obtenerProducto(id) {
    return await Producto
    .findById(id)
    .lean(); 
}


export async function actualizarProducto(id, data) {
    return await Producto.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}


export async function eliminarProducto(id) {
    return await Producto.findByIdAndDelete(id).lean();
}
