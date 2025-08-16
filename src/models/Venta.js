import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    producto:       { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad:       { type: Number, min: 1, required: true },
    precioUnitario: { type: Number, min: 0, required: true }, // se congela al crear la venta
    subtotal:       { type: Number, min: 0, required: true }  // cantidad * precioUnitario
}, { _id: false });

const ventaSchema = new mongoose.Schema({
    cliente: {
        nombre:  { type: String },
        email:   { type: String },
    },
    items:   { type: [itemSchema], validate: v => v.length > 0 },
    total:   { type: Number, min: 0, required: true },
    estado:  { type: String, enum: ['PENDIENTE', 'PAGADA', 'CANCELADA'], default: 'PENDIENTE' },
    metadatos: { type: mongoose.Schema.Types.Mixed } // opcional: método de pago, etc.
}, { timestamps: true });

// Campo Virtual para cantidad total de ítems general de cada venta
ventaSchema.virtual('cantidadTotal').get(function () {
    return this.items.reduce((acc, it) => acc + it.cantidad, 0);
});

export default mongoose.model('Venta', ventaSchema);
