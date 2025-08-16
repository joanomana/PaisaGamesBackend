import mongoose from 'mongoose';

export const TIPOS = ['JUEGO_FISICO','LLAVE_DIGITAL','CONSOLA','ACCESORIO','COLECCIONABLE'];
export const PLATAFORMAS = ['XBOX','PLAYSTATION','NINTENDO','PC','STEAM','EPIC','VALORANT','MULTI'];

const productoSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    tipo: { type: String, enum: TIPOS, required: true },
    plataforma: { type: String, enum: PLATAFORMAS, required: true },
    categoria: String,
    precio: { type: Number, min: 0, required: true },
    stock: { type: Number, min: 0, required: true },
    imagenes: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length >= 3
    },
    metadata: mongoose.Schema.Types.Mixed
    }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


productoSchema.virtual('portada').get(function () {
    return Array.isArray(this.imagenes) && this.imagenes.length ? this.imagenes[0] : null;
});

export default mongoose.model('Producto', productoSchema);
