import Producto from '../models/Producto.js';
import Venta from '../models/Venta.js';

export async function runSeed() {
  await Promise.all([Producto.init(), Venta.init()]);
  const productos = await seedProductos();
  await seedVentas(productos);
}

async function seedProductos() {
  const count = await Producto.estimatedDocumentCount();
  if (count > 0) {
    console.log(`ℹ️ Productos existentes: ${count}, no se insertan seed.`);
    return Producto.find().limit(20);
  }

  const data = [
    // ==== JUEGOS FÍSICOS ====
    {
      nombre: 'God of War Ragnarök (PS5)',
      descripcion: 'Acción y aventura. Edición estándar.',
      tipo: 'JUEGO_FISICO',
      plataforma: 'PLAYSTATION',
      categoria: 'Acción',
      precio: 300000,
      stock: 8,
      imagen: 'https://www.alkosto.com/medias/711719547013-001-750Wx750H?context=bWFzdGVyfGltYWdlc3w2MDQzNnxpbWFnZS93ZWJwfGFHVTJMMmd5WkM4eE5ETXpNelU1TnpReE56VXdNaTgzTVRFM01UazFORGN3TVROZk1EQXhYemMxTUZkNE56VXdTQXxhMjI5NDdjMjRjY2ZlYjUzZDg2OTcwOTVhYzIxOTdmODNkNWUwNzNjMjZiMmNkNTM3MDRkYTM4YWIyMzlmOWM2',
      metadata: { edicion: 'Estándar', region: 'US' }
    },
    {
      nombre: 'The Legend of Zelda: Tears of the Kingdom (Switch)',
      descripcion: 'Aventura de mundo abierto.',
      tipo: 'JUEGO_FISICO',
      plataforma: 'NINTENDO',
      categoria: 'Aventura',
      precio: 69.99,
      stock: 10,
      imagen: 'https://picsum.photos/seed/totk/600/400',
      metadata: { edicion: 'Estándar', region: 'US' }
    },
    {
      nombre: 'Forza Horizon 5 (Xbox Series)',
      descripcion: 'Carreras de mundo abierto.',
      tipo: 'JUEGO_FISICO',
      plataforma: 'XBOX',
      categoria: 'Carreras',
      precio: 59.99,
      stock: 7,
      imagen: 'https://picsum.photos/seed/fh5/600/400',
      metadata: { edicion: 'Estándar', region: 'US' }
    },

    // ==== LLAVES DIGITALES (PC) ====
    {
      nombre: 'Steam Key: Hades',
      descripcion: 'Código digital para activar en Steam.',
      tipo: 'LLAVE_DIGITAL',
      plataforma: 'STEAM',
      categoria: 'Roguelike',
      precio: 19.99,
      stock: 25, // cantidad de claves disponibles (no guardamos la clave aquí)
      imagen: 'https://picsum.photos/seed/hadeskey/600/400',
      metadata: { region: 'Global', entrega: 'Inmediata por email' }
    },
    {
      nombre: 'Epic Key: Alan Wake Remastered',
      descripcion: 'Código digital para Epic Games Store.',
      tipo: 'LLAVE_DIGITAL',
      plataforma: 'EPIC',
      categoria: 'Acción',
      precio: 24.99,
      stock: 20,
      imagen: 'https://picsum.photos/seed/alanwake/600/400',
      metadata: { region: 'Global' }
    },
    {
      nombre: 'Valorant Points 2050 (Riot)',
      descripcion: 'Moneda virtual para Valorant.',
      tipo: 'LLAVE_DIGITAL',
      plataforma: 'VALORANT',
      categoria: 'Moneda Virtual',
      precio: 19.99,
      stock: 30,
      imagen: 'https://picsum.photos/seed/valorantvp/600/400',
      metadata: { region: 'LATAM', entrega: 'Inmediata' }
    },

    // ==== CONSOLAS ====
    {
      nombre: 'PlayStation 5 Slim 1TB',
      descripcion: 'Consola PS5 Slim, 1TB SSD.',
      tipo: 'CONSOLA',
      plataforma: 'PLAYSTATION',
      categoria: 'Consola',
      precio: 499.99,
      stock: 3,
      imagen: 'https://picsum.photos/seed/ps5slim/600/400',
      metadata: { modelo: 'CFI-2016A', color: 'Blanco' }
    },
    {
      nombre: 'Xbox Series X 1TB',
      descripcion: 'Consola Xbox Series X, 1TB SSD.',
      tipo: 'CONSOLA',
      plataforma: 'XBOX',
      categoria: 'Consola',
      precio: 499.99,
      stock: 4,
      imagen: 'https://picsum.photos/seed/seriesx/600/400',
      metadata: { color: 'Negro' }
    },
    {
      nombre: 'Nintendo Switch OLED',
      descripcion: 'Modelo OLED, 64GB.',
      tipo: 'CONSOLA',
      plataforma: 'NINTENDO',
      categoria: 'Consola',
      precio: 349.99,
      stock: 5,
      imagen: 'https://picsum.photos/seed/switcholed/600/400',
      metadata: { color: 'Blanco' }
    },

    // ==== ACCESORIOS ====
    {
      nombre: 'Control Inalámbrico DualSense (PS5)',
      descripcion: 'Mando para PlayStation 5.',
      tipo: 'ACCESORIO',
      plataforma: 'PLAYSTATION',
      categoria: 'Control',
      precio: 69.99,
      stock: 12,
      imagen: 'https://picsum.photos/seed/dualsense/600/400',
      metadata: { color: 'Midnight Black' }
    },
    {
      nombre: 'Xbox Wireless Controller',
      descripcion: 'Mando inalámbrico Xbox.',
      tipo: 'ACCESORIO',
      plataforma: 'XBOX',
      categoria: 'Control',
      precio: 64.99,
      stock: 10,
      imagen: 'https://picsum.photos/seed/xboxcontroller/600/400',
      metadata: { color: 'Carbon Black' }
    },
    {
      nombre: 'MicroSD 256GB para Switch',
      descripcion: 'Tarjeta de memoria compatible.',
      tipo: 'ACCESORIO',
      plataforma: 'NINTENDO',
      categoria: 'Almacenamiento',
      precio: 29.99,
      stock: 15,
      imagen: 'https://picsum.photos/seed/microsd/600/400',
      metadata: { clase: 'U3', velocidad: 'V30' }
    },

    // ==== COLECCIONABLES ====
    {
      nombre: 'Figura de Colección – Geralt (The Witcher)',
      descripcion: 'Figura detallada, 20cm.',
      tipo: 'COLECCIONABLE',
      plataforma: 'MULTI',
      categoria: 'Figura',
      precio: 49.99,
      stock: 6,
      imagen: 'https://picsum.photos/seed/geraltfig/600/400',
      metadata: { material: 'PVC', tamaño: '20cm' }
    },
    {
      nombre: 'Amiibo – Link (Zelda)',
      descripcion: 'Figura compatible con Nintendo.',
      tipo: 'COLECCIONABLE',
      plataforma: 'NINTENDO',
      categoria: 'Amiibo',
      precio: 15.99,
      stock: 9,
      imagen: 'https://picsum.photos/seed/amiibolink/600/400',
      metadata: { compatibilidad: 'Zelda TOTK, BOTW' }
    }
  ];

  const inserted = await Producto.insertMany(data);
  console.log(`✅ Seed productos insertados: ${inserted.length}`);
  return inserted;
}

async function seedVentas(productosBase) {
  const count = await Venta.estimatedDocumentCount();
  if (count > 0) {
    console.log(`ℹ️ Ventas existentes: ${count}, no se insertan seed.`);
    return;
  }
  const prods = productosBase?.length ? productosBase : await Producto.find().limit(4);
  if (prods.length === 0) return;

  const items = prods.slice(0, 3).map((p, i) => {
    const cantidad = i + 1;
    const precioUnitario = p.precio;
    return {
      producto: p._id,
      cantidad,
      precioUnitario,
      subtotal: precioUnitario * cantidad,
    };
  });
  const total = items.reduce((s, it) => s + it.subtotal, 0);

  await Venta.create({
    cliente: { nombre: 'Cliente Demo', email: 'demo@cliente.com' },
    items,
    total,
    estado: 'PAGADA',
    metadatos: { metodoPago: 'Tarjeta' }
  });

  console.log('✅ Seed venta de ejemplo creada.');
}
