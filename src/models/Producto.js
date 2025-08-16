import mongoose from 'mongoose';

const TIPOS = ['JUEGO_FISICO', 'LLAVE_DIGITAL', 'CONSOLA', 'ACCESORIO', 'COLECCIONABLE'];
const PLATAFORMAS = ['XBOX', 'PLAYSTATION', 'NINTENDO', 'PC', 'STEAM', 'EPIC', 'VALORANT', 'MULTI'];

const productoSchema = new mongoose.Schema({
    nombre:      { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    tipo:        { type: String, required: true, enum: TIPOS },
    plataforma:  { type: String, required: true, enum: PLATAFORMAS },
    categoria:   { type: String, required: true, trim: true }, // ej: "Acción", "Consola", "Control", "Figura"
    precio:      { type: Number, required: true, min: 0 },
    stock:       { type: Number, required: true, min: 0 },     // 👈 inventario
    imagen:      { type: String, required: true, trim: true },
    metadata:    { type: mongoose.Schema.Types.Mixed },        // opcional: {region, edicion, marca, modelo, color, tamaño...}
}, { timestamps: true });

productoSchema.index({ nombre: 1 });
productoSchema.index({ plataforma: 1, tipo: 1 });

export default mongoose.model('Producto', productoSchema);
