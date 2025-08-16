import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const TIPOS = ['JUEGO_FISICO', 'LLAVE_DIGITAL', 'CONSOLA', 'ACCESORIO', 'COLECCIONABLE'];
const PLATAFORMAS = ['XBOX', 'PLAYSTATION', 'NINTENDO', 'PC', 'STEAM', 'EPIC', 'VALORANT', 'MULTI'];

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'PaisaGames API',
            version: '1.0.0',
            description: 'API para tienda de videojuegos (productos, ventas, inventario).',
        },
        servers: [
            { url: `http://localhost:${process.env.PORT || 3000}`, description: 'Local' },
        ],
        components: {

        schemas: {
            // ---------- Productos ----------
            ProductoListItem: {
            type: 'object',
            properties: {
                _id: { type: 'string', readOnly: true },
                nombre: { type: 'string', example: 'God of War Ragnarök (PS5)' },
                precio: { type: 'number', example: 299000 },
                stock: { type: 'integer', example: 8 },
                tipo: { type: 'string', enum: TIPOS, example: 'JUEGO_FISICO' },
                plataforma: { type: 'string', enum: PLATAFORMAS, example: 'PLAYSTATION' },
                categoria: { type: 'string', example: 'Acción' },
                portada: { type: 'string', format: 'uri', example: 'https://www.alkosto.com/medias/711719547013-001-750Wx750H?context=bWFzdGVyfGltYWdlc3w2MDQzNnxpbWFnZS93ZWJwfGFHVTJMMmd5WkM4eE5ETXpNelU1TnpReE56VXdNaTgzTVRFM01UazFORGN3TVROZk1EQXhYemMxTUZkNE56VXdTQXxhMjI5NDdjMjRjY2ZlYjUzZDg2OTcwOTVhYzIxOTdmODNkNWUwNzNjMjZiMmNkNTM3MDRkYTM4YWIyMzlmOWM2' },
                createdAt: { type: 'string', format: 'date-time', readOnly: true }
            }
            },

            ProductoDetail: {
            type: 'object',
            required: ['nombre','descripcion','tipo','plataforma','categoria','precio','stock','imagenes'],
            properties: {
                _id: { type: 'string', readOnly: true },
                nombre: { type: 'string', example: 'God of War Ragnarök (PS5)' },
                descripcion: { type: 'string', example: 'Acción y aventura. Edición estándar.' },
                tipo: { type: 'string', enum: TIPOS, example: 'JUEGO_FISICO' },
                plataforma: { type: 'string', enum: PLATAFORMAS, example: 'PLAYSTATION' },
                categoria: { type: 'string', example: 'Acción' },
                precio: { type: 'number', example: 299000 },
                stock: { type: 'integer', example: 8 },
                imagenes: {
                type: 'array',
                minItems: 3,
                items: { type: 'string', format: 'uri' },
                example: [
                    'https://www.alkosto.com/medias/711719547013-001-750Wx750H?context=bWFzdGVyfGltYWdlc3w2MDQzNnxpbWFnZS93ZWJwfGFHVTJMMmd5WkM4eE5ETXpNelU1TnpReE56VXdNaTgzTVRFM01UazFORGN3TVROZk1EQXhYemMxTUZkNE56VXdTQXxhMjI5NDdjMjRjY2ZlYjUzZDg2OTcwOTVhYzIxOTdmODNkNWUwNzNjMjZiMmNkNTM3MDRkYTM4YWIyMzlmOWM2',
                    'https://www.alkosto.com/medias/711719547013-002-750Wx750H?context=bWFzdGVyfGltYWdlc3w2MzIxMnxpbWFnZS93ZWJwfGFEUTFMMmd6Wmk4eE5ETXpNelU1TnprME1UYzVNQzgzTVRFM01UazFORGN3TVROZk1EQXlYemMxTUZkNE56VXdTQXw4YmZmMmZmNjFjZTg1NmUwMzBkYzlmNjdlMmYxOTI5NGI1N2JhZGNlYjk3ZDk0MDZkOTc1ZWUzOGVhMDVlMjA1',
                    'https://www.alkosto.com/medias/711719547013-003-750Wx750H?context=bWFzdGVyfGltYWdlc3w2ODk2MHxpbWFnZS93ZWJwfGFETmxMMmc1T0M4eE5ETXpNelU1T0RRMk5qQTNPQzgzTVRFM01UazFORGN3TVROZk1EQXpYemMxTUZkNE56VXdTQXwxN2Q3YWM4OTIyNWNhNGY1ZWQyN2JkOTRlZGRkMDAwYTU1OWI0MWNiZjkwN2Y0MDQxZGYyNGRiZGJjNmE1Yzll'
                ]
                },
                metadata: { type: 'object', additionalProperties: true, example: { edicion: 'Estándar', region: 'US' } },
                createdAt: { type: 'string', format: 'date-time', readOnly: true },
                updatedAt: { type: 'string', format: 'date-time', readOnly: true }
            }
            },

            ProductoCreate: {
            type: 'object',
            required: ['nombre','descripcion','tipo','plataforma','categoria','precio','stock','imagenes'],
            properties: {
                nombre: { type: 'string', example: 'FIFA (PS5)' },
                descripcion: { type: 'string', example: 'Con EA SPORTS FC™ 25, tienes más formas de ganar por el club.' },
                tipo: { type: 'string', enum: TIPOS, example: 'JUEGO_FISICO' },
                plataforma: { type: 'string', enum: PLATAFORMAS, example: 'PLAYSTATION' },
                categoria: { type: 'string', example: 'Deportes' },
                precio: { type: 'number', example: 300000 },
                stock: { type: 'integer', example: 15 },
                imagenes: {
                type: 'array',
                minItems: 3,
                items: { type: 'string', format: 'uri' },
                example: [
                    'https://www.alkosto.com/medias/014633750027-001-750Wx750H?context=bWFzdGVyfGltYWdlc3w0Mzg4NHxpbWFnZS93ZWJwfGFEbGpMMmczTnk4eE5EWTNNalU1T0RVMk5EZzVOQzh3TVRRMk16TTNOVEF3TWpkZk1EQXhYemMxTUZkNE56VXdTQXxkOTVkM2E1ZDczZTBiZjNjMTM5ZDdlYzVjNWM0NDZiZGY0ZDYyYmM5NGI2ZTY0ODAxNjcwZjVjYzg1NzRkYTQz',
                    'https://www.alkosto.com/medias/014633750027-002-750Wx750H?context=bWFzdGVyfGltYWdlc3wyNzE4OHxpbWFnZS93ZWJwfGFEa3pMMmd4WWk4eE5EWTNNalU1T1RFMU5EY3hPQzh3TVRRMk16TTNOVEF3TWpkZk1EQXlYemMxTUZkNE56VXdTQXwxZjg5ODZlMDNmNTdjYjZhMmVhNjJhZDM1ZWIwOWM5NmFmMjhjMTcwOWM5ZTQwZGUyMjljZTMyMjM5YmVmYjU0',
                    'https://www.alkosto.com/medias/014633750027-003-750Wx750H?context=bWFzdGVyfGltYWdlc3wzNzgyNHxpbWFnZS93ZWJwfGFETTFMMmd3Tnk4eE5EWTNNalU1T1RjME5EVTBNaTh3TVRRMk16TTNOVEF3TWpkZk1EQXpYemMxTUZkNE56VXdTQXwzNzYwNjhhOTM5MzQxMDk0Yjg2ODc5OWQ2ZDdlODRjN2Y1ZTBiYWFjMGEyMTk1YWU0MWU2YTg2NDMyZTQ1YTQx'
                ]
                },
                metadata: { type: 'object', additionalProperties: true, example: { edicion: 'Estándar', region: 'ES' } }
            }
            },

            ProductoUpdate: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                descripcion: { type: 'string' },
                tipo: { type: 'string', enum: TIPOS },
                plataforma: { type: 'string', enum: PLATAFORMAS },
                categoria: { type: 'string' },
                precio: { type: 'number' },
                stock: { type: 'integer' },
                imagenes: {
                type: 'array',
                minItems: 3,
                items: { type: 'string', format: 'uri' }
                },
                metadata: { type: 'object', additionalProperties: true }
            }
            },

            // ---------- Ventas ----------
            VentaItem: {
            type: 'object',
            required: ['producto','cantidad','precioUnitario','subtotal'],
            properties: {
                producto: { type: 'string', description: 'ObjectId de Producto', example: '66b0d7f25a53c00012ab34cd' },
                cantidad: { type: 'integer', minimum: 1, example: 2 },
                precioUnitario: { type: 'number', example: 69990 },
                subtotal: { type: 'number', example: 139980 }
            }
            },

            Venta: {
            type: 'object',
            required: ['items','total'],
            properties: {
                _id: { type: 'string', readOnly: true },
                cliente: {
                type: 'object',
                properties: {
                    nombre: { type: 'string', example: 'Cliente Demo' },
                    email: { type: 'string', example: 'demo@cliente.com' }
                }
                },
                items: { type: 'array', items: { $ref: '#/components/schemas/VentaItem' } },
                total: { type: 'number', example: 199970 },
                estado: { type: 'string', enum: ['PENDIENTE','PAGADA','CANCELADA'], default: 'PENDIENTE' },
                metadatos: { type: 'object', additionalProperties: true },
                createdAt: { type: 'string', format: 'date-time', readOnly: true },
                updatedAt: { type: 'string', format: 'date-time', readOnly: true }
            }
            },

            Error: {
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Stock insuficiente o producto no encontrado' }
            }
            },
        },
        },
    },

    apis: [path.join(__dirname, '../routes/*.js')],
});
