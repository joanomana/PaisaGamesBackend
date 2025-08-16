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
      stock: 18,
      imagenes: [
        'https://www.alkosto.com/medias/711719547013-001-750Wx750H?context=bWFzdGVyfGltYWdlc3w2MDQzNnxpbWFnZS93ZWJwfGFHVTJMMmd5WkM4eE5ETXpNelU1TnpReE56VXdNaTgzTVRFM01UazFORGN3TVROZk1EQXhYemMxTUZkNE56VXdTQXxhMjI5NDdjMjRjY2ZlYjUzZDg2OTcwOTVhYzIxOTdmODNkNWUwNzNjMjZiMmNkNTM3MDRkYTM4YWIyMzlmOWM2',
        'https://www.alkosto.com/medias/711719547013-002-750Wx750H?context=bWFzdGVyfGltYWdlc3w2MzIxMnxpbWFnZS93ZWJwfGFEUTFMMmd6Wmk4eE5ETXpNelU1TnprME1UYzVNQzgzTVRFM01UazFORGN3TVROZk1EQXlYemMxTUZkNE56VXdTQXw4YmZmMmZmNjFjZTg1NmUwMzBkYzlmNjdlMmYxOTI5NGI1N2JhZGNlYjk3ZDk0MDZkOTc1ZWUzOGVhMDVlMjA1',
        'https://www.alkosto.com/medias/711719547013-003-750Wx750H?context=bWFzdGVyfGltYWdlc3w2ODk2MHxpbWFnZS93ZWJwfGFETmxMMmc1T0M4eE5ETXpNelU1T0RRMk5qQTNPQzgzTVRFM01UazFORGN3TVROZk1EQXpYemMxTUZkNE56VXdTQXwxN2Q3YWM4OTIyNWNhNGY1ZWQyN2JkOTRlZGRkMDAwYTU1OWI0MWNiZjkwN2Y0MDQxZGYyNGRiZGJjNmE1Yzll'
      ],
      metadata: { edicion: 'Estándar', region: 'US' }
    },
    {
      nombre: 'The Legend of Zelda: Tears of the Kingdom (Switch)',
      descripcion: 'Aventura de mundo abierto.',
      tipo: 'JUEGO_FISICO',
      plataforma: 'NINTENDO',
      categoria: 'Aventura',
      precio: 370000,
      stock: 30,
      imagenes: [
        'https://www.alkosto.com/medias/045496905736-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wyNzA2NnxpbWFnZS93ZWJwfGFHRXdMMmhoTkM4eE5URXlOemcwTVRZd016WXhOQzh3TkRVME9UWTVNRFUzTXpaZk1EQXhYemMxTUZkNE56VXdTQXw0YmM0YzFjM2E1NGE0ZDI0YjJjOWU0MGMzYjUwNDRjNjEwZTYyMGNjZjJhNmU5M2U0YmE1ZTJkODVkNDVkYzcz',
        'https://www.alkosto.com/medias/045496905736-002-750Wx750H?context=bWFzdGVyfGltYWdlc3w1MjAxMHxpbWFnZS93ZWJwfGFHVTNMMmcwWVM4eE5URXlOemcwTWpFNU16UXpPQzh3TkRVME9UWTVNRFUzTXpaZk1EQXlYemMxTUZkNE56VXdTQXxjMTg5NWI2ZjE1YzQ4MjU0YzlmZmY2NmUzNDRhNDFlNTE1NjhmMGFhYmU4YzQ1MTdiZjI5ODVmZDQ4NmExYWRk',
        'https://www.alkosto.com/medias/045496905736-003-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMjM0NHxpbWFnZS93ZWJwfGFEZzVMMmd6Tmk4eE5URXlOemcwTWpjNE16STJNaTh3TkRVME9UWTVNRFUzTXpaZk1EQXpYemMxTUZkNE56VXdTQXxjMGNkNjNiMDZlNTgyZDVkZWVhNzViNTdhNjgzNmVkNTFjOTUwNGUwMTgzZGY0N2Y3N2M2ZTczMWNkZjYyNjBl'
      ],
      metadata: { edicion: 'Estándar', region: 'US' }
    },
    {
      nombre: 'Forza Horizon 5 (Xbox Series)',
      descripcion: 'Carreras de mundo abierto.',
      tipo: 'JUEGO_FISICO',
      plataforma: 'XBOX',
      categoria: 'Carreras',
      precio: 250000,
      stock: 10,
      imagenes: [
        'https://http2.mlstatic.com/D_NQ_NP_762554-MLA51424398770_092022-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_923526-MLA48463731032_122021-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_655567-MLA48463488870_122021-O.webp'
      ],
      metadata: { edicion: 'Estándar', region: 'US' }
    },

    // ==== LLAVES DIGITALES (PC) ====
    {
      nombre: 'Random DIAMOND 5 Keys - Steam Key - GLOBAL',
      descripcion: 'Código digital para activar en Steam.',
      tipo: 'LLAVE_DIGITAL',
      plataforma: 'STEAM',
      categoria: 'Roguelike',
      precio: 35000,
      stock: 25,
      imagenes: [
        'https://images.g2a.com/300x400/1x1x1/random-diamond-5-keys-steam-key-global-i10000312656001/22114304cce64409acf9f6f1',
        'https://images.g2a.com/300x400/1x1x1/random-vip-5-keys-steam-key-global-i10000325281001/ea23eaead2c04b2d8744893e',
        'https://images.g2a.com/300x400/1x1x1/grand-random-5-keys-steam-key-global-i10000338585003/308e4cac85924de6b8da7cdc'
      ],
      metadata: { region: 'Global', entrega: 'Inmediata por email' }
    },
    {
      nombre: 'Fortnite 1000 V-Bucks',
      descripcion: 'Código digital para Epic Games Store.',
      tipo: 'LLAVE_DIGITAL',
      plataforma: 'EPIC',
      categoria: 'Acción',
      precio: 20000,
      stock: 20,
      imagenes: [
        'https://images.g2a.com/300x400/1x1x1/fortnite-epic-games-key-1000-v-bucks-i10000174299001/bf6ea89fb4434f2989fccf2c',
        'https://images.g2a.com/300x400/1x1x1/fortnite-epic-games-key-1000-v-bucks-i10000174299001/bf6ea89fb4434f2989fccf2c',
        'https://images.g2a.com/1024x576/1x1x1/fortnite-epic-games-key-1000-v-bucks-i10000174299001/5bc477975bafe3e3253ea1f3'
      ],
      metadata: { region: 'Global' }
    },
    {
      nombre: 'Valorant Points 2050 (Riot)',
      descripcion: 'Moneda virtual para Valorant.',
      tipo: 'LLAVE_DIGITAL',
      plataforma: 'VALORANT',
      categoria: 'Moneda Virtual',
      precio: 70000,
      stock: 30,
      imagenes: [
        'https://images.g2a.com/300x400/1x1x1/valorant-5350-vp-riot-key-turkey-i10000196108116/bc67734021e045949611ca47',
        'https://images.g2a.com/300x400/1x1x1/valorant-5350-vp-riot-key-turkey-i10000196108116/bc67734021e045949611ca47',
        'https://images.g2a.com/1024x576/1x1x1/valorant-5350-vp-riot-key-turkey-i10000196108116/b21b798c4c3344bc825eae40'
      ],
      metadata: { region: 'LATAM', entrega: 'Inmediata' }
    },

    // ==== CONSOLAS ====
    {
      nombre: 'PlayStation 5 Slim 1TB',
      descripcion: 'Consola PS5 Slim, 1TB SSD.',
      tipo: 'CONSOLA',
      plataforma: 'PLAYSTATION',
      categoria: 'Consola',
      precio: 1700000,
      stock: 100,
      imagenes: [
        'https://www.alkosto.com/medias/711719570875-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wyMjQ5OHxpbWFnZS93ZWJwfGFEWXdMMmd4Tnk4eE5EWTNOVEF6TWpNM05UTXlOaTgzTVRFM01UazFOekE0TnpWZk1EQXhYemMxTUZkNE56VXdTQXxhMDY5ZDYwMDAwODlhOTljMGY0OGZlODQxMGViZmNhODIzZDMzMWUxY2EyZDE1NDZjNTM3ZTMwNGRmYzI2NWMy',
        'https://www.alkosto.com/medias/711719570875-002-750Wx750H?context=bWFzdGVyfGltYWdlc3wyNTI0MnxpbWFnZS93ZWJwfGFHSmtMMmd5WWk4eE5EWTNOVEF6TWprMk5URTFNQzgzTVRFM01UazFOekE0TnpWZk1EQXlYemMxTUZkNE56VXdTQXw1YjJjYjdhN2ZmY2MxMGZiYzdiNmUwNjc2MTNmMDBhMjc1MGQ4ZmY5YjM0OGNmODYyOWNmOTNjZTcwNDMzMzI0',
        'https://www.alkosto.com/medias/711719570875-003-750Wx750H?context=bWFzdGVyfGltYWdlc3wzOTE0OHxpbWFnZS93ZWJwfGFEVTVMMmd3WXk4eE5USXpNVFF6TWpJNU5EUXpNQzgzTVRFM01UazFOekE0TnpWZk1EQXpYemMxTUZkNE56VXdTQXw5OGY4ZDNhMDU5YTc1NzQ0ZmI0MjM3YmRlYzQ1ZGM3YmU3NGFlNGM4MWY0MWY1YjRkNWNhOWNhNWZhZWY0YTUz'
      ],
      metadata: { modelo: 'CFI-2016A', color: 'Blanco' }
    },
    {
      nombre: 'Consola Xbox Series S 512 GB + 1 Control Inalámbrico',
      descripcion: 'Consola Xbox Series S, 512 GB.',
      tipo: 'CONSOLA',
      plataforma: 'XBOX',
      categoria: 'Consola',
      precio: 1600000,
      stock: 14,
      imagenes: [
        'https://www.alkosto.com/medias/196388421398-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wxOTEzMHxpbWFnZS93ZWJwfGFERTRMMmczTnk4eE5EazNORGcxTlRFMU1UWTBOaTh4T1RZek9EZzBNakV6T1RoZk1EQXhYemMxTUZkNE56VXdTQXw5ZGI1MWM2OGQ4N2FmYjEyMGQ0ZmQ0ZDJhNzdjY2UzYjExZjQxNjQwNGNlNGJlN2E2NjMyNTVhN2M5MWJkNTE1',
        'https://www.alkosto.com/medias/196388421398-002-750Wx750H?context=bWFzdGVyfGltYWdlc3wxNjc4MnxpbWFnZS93ZWJwfGFEYzJMMmc0WWk4eE5EazNORGcxTlRjME1UUTNNQzh4T1RZek9EZzBNakV6T1RoZk1EQXlYemMxTUZkNE56VXdTQXw0ODJlOTgxOThkZmZjOTFlYWUxMTc4ZjM1YjIzYWRhY2JmZGQ2OGYwNWI4NzAyZmE1OWY0ZWQ4MGVmODFmMzY1',
        'https://www.alkosto.com/medias/196388421398-003-750Wx750H?context=bWFzdGVyfGltYWdlc3wzNDc4NnxpbWFnZS93ZWJwfGFEZ3dMMmhsTnk4eE5EazNORGcxTmpNek1USTVOQzh4T1RZek9EZzBNakV6T1RoZk1EQXpYemMxTUZkNE56VXdTQXwzMTBlZGQ0OWViNjJjMDgyNThmNGYwN2U4N2I3MzE5ZjkwYTZlMDVjMjU0ZDNkMDZmY2NjYjY1YmJjMDEwYjA2'
      ],
      metadata: { color: 'Negro' }
    },
    {
      nombre: 'Consola NINTENDO SWITCH 2 + Juego Mario Kart World',
      descripcion: 'Modelo OLED, 64GB.',
      tipo: 'CONSOLA',
      plataforma: 'NINTENDO',
      categoria: 'Consola',
      precio: 2000000,
      stock: 5,
      imagenes: [
        'https://www.alkosto.com/medias/045496885472-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wyMzc1NHxpbWFnZS93ZWJwfGFHWmtMMmhoWmk4eE5UQTRNVGN6TWprNU56RTFNQzh3TkRVME9UWTRPRFUwTnpKZk1EQXhYemMxTUZkNE56VXdTQXxmMTY2M2EwNmJjOTljYTY2MjYwOTI2NTMwYjlkZjE5ZjNlMTU1Nzk5MzQwZGI5MzFjMzJkOWYxMzA0Yjg2MDlk',
        'https://www.alkosto.com/medias/045496885472-002-750Wx750H?context=bWFzdGVyfGltYWdlc3w4OTg4fGltYWdlL3dlYnB8YUdZMEwyZzFNeTh4TlRBNE1UY3pNelU0TmprM05DOHdORFUwT1RZNE9EVTBOekpmTURBeVh6YzFNRmQ0TnpVd1NBfDUxY2MyZDU5NGE1OTVmY2YxNWY2YWFjNTFhZmVjZWU3NTVkMTc0YmE5YzdiODM1NzBkYzBmYWIyNGNkY2ZmZTI',
        'https://www.alkosto.com/medias/045496885472-003-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMzk1NHxpbWFnZS93ZWJwfGFERTBMMmd3T0M4eE5UQTRNVGN6TkRFM05qYzVPQzh3TkRVME9UWTRPRFUwTnpKZk1EQXpYemMxTUZkNE56VXdTQXw2ZDNlNWQ0NmIxYjEzZDJmNzVkNDliMWM1MDUwMmQyNGFiY2Y1OTc2M2FlYjlhZTExNGE0MzQ2NWNiOGI3NDBh'
      ],
      metadata: { color: 'Blanco' }
    },

    // ==== ACCESORIOS ====
    {
      nombre: 'Control PLAYSTATION PS5 Dualsense Death Stranding 2',
      descripcion: 'Mando para PlayStation 5.',
      tipo: 'ACCESORIO',
      plataforma: 'PLAYSTATION',
      categoria: 'Control',
      precio: 399000,
      stock: 12,
      imagenes: [
        'https://www.alkosto.com/medias/711719599906-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wxOTYyMHxpbWFnZS93ZWJwfGFESTVMMmc0WlM4eE5URTFNakl3TWpBNE9EUTNPQzgzTVRFM01UazFPVGs1TURaZk1EQXhYemMxTUZkNE56VXdTQXwxMzAyYTgxNTRmYmJmMjBlMDNkNjAwODQ4YTkwZDI2NWIyYzVhNDRiNGM4MGVlZWYwMjRlZmJhNzdiZTZmNTVl',
        'https://www.alkosto.com/medias/711719599906-005-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMDkwNnxpbWFnZS93ZWJwfGFHRTBMMmcxTWk4eE5URTFNakl3TkRRME56YzNOQzgzTVRFM01UazFPVGs1TURaZk1EQTFYemMxTUZkNE56VXdTQXw1ZjNmMDkyNmU0ZmE0MTQ5MGVjZjE5MmQ3MzM5MWQ3MjNlMDlhNWRjYTAyOTVhNzI5ZmY2NWU3MjY0ZTJiNTQy',
        'https://www.alkosto.com/medias/711719599906-006-750Wx750H?context=bWFzdGVyfGltYWdlc3wxNTg5MHxpbWFnZS93ZWJwfGFHRmxMMmhoWlM4eE5URTFNakl3TlRBek56VTVPQzgzTVRFM01UazFPVGs1TURaZk1EQTJYemMxTUZkNE56VXdTQXw4ZjE4NGMxNTU4MjcxMjk5NTZmMjI0ZWJiNTEzOGExNmUyN2YzNWZkZWE2MmY0NWMyNzExYTk2ZjI3NWY1NzM5'
      ],
      metadata: { color: 'Midnight Black' }
    },
    {
      nombre: 'Xbox Wireless Controller',
      descripcion: 'Mando inalámbrico Xbox.',
      tipo: 'ACCESORIO',
      plataforma: 'XBOX',
      categoria: 'Control',
      precio: 300000,
      stock: 10,
      imagenes: [
        'https://www.alkosto.com/medias/889842946901-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wxNjU1OHxpbWFnZS93ZWJwfGFHSmxMMmhqTWk4eE5EUXhOalU1TmpVek16STNPQzg0T0RrNE5ESTVORFk1TURGZk1EQXhYemMxTUZkNE56VXdTQXwwZTNhZDI3YzYxNmMyOTQxYjVhNzIzYzc5YzY0MDI0MTFmMTAwM2RiYTIyYzBlN2Q3MmExYzNmZjU2ZjM3ZGVh',
        'https://www.alkosto.com/medias/889842946901-004-750Wx750H?context=bWFzdGVyfGltYWdlc3wyMzM5MHxpbWFnZS93ZWJwfGFHSXhMMmd3T1M4eE5EUXhOalU1T0RNd01qYzFNQzg0T0RrNE5ESTVORFk1TURGZk1EQTBYemMxTUZkNE56VXdTQXwwZjQxMDk3NjBmMDM3NmEwZmI1YjJlODQ5N2I4NjA2Y2Y3ZTA4MWQzNGI3ZWUxMjI3ZWI4OWYxNTU3MTkxMjVm',
        'https://www.alkosto.com/medias/889842946901-006-750Wx750H?context=bWFzdGVyfGltYWdlc3wxNDIxMHxpbWFnZS93ZWJwfGFHTTRMMmczTnk4eE5EUXhOalU1T1RRNE1qTTVPQzg0T0RrNE5ESTVORFk1TURGZk1EQTJYemMxTUZkNE56VXdTQXxmNWQ5ZDg4ZWIzNDYxYTBiYjI1NDA4MzJhNTRmNmVlZTRlN2E5MWJiOTEzYjUyMjk5OTgxNjNkNWM4MTI5NDRhhttps://www.alkosto.com/medias/889842946901-006-750Wx750H?context=bWFzdGVyfGltYWdlc3wxNDIxMHxpbWFnZS93ZWJwfGFHTTRMMmczTnk4eE5EUXhOalU1T1RRNE1qTTVPQzg0T0RrNE5ESTVORFk1TURGZk1EQTJYemMxTUZkNE56VXdTQXxmNWQ5ZDg4ZWIzNDYxYTBiYjI1NDA4MzJhNTRmNmVlZTRlN2E5MWJiOTEzYjUyMjk5OTgxNjNkNWM4MTI5NDRh'
      ],
      metadata: { color: 'Carbon Black' }
    },
    {
      nombre: 'Memoria Micro SD ADATA 128 GB para Switch',
      descripcion: 'Tarjeta de memoria compatible.',
      tipo: 'ACCESORIO',
      plataforma: 'NINTENDO',
      categoria: 'Almacenamiento',
      precio: 39900,
      stock: 15,
      imagenes: [
        'https://www.alkosto.com/medias/4713218461940-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMzcxMHxpbWFnZS93ZWJwfGFETXlMMmd6T0M4eE5EUTJNVFl5T1RRNU56TTNOQzgwTnpFek1qRTRORFl4T1RRd1h6QXdNVjgzTlRCWGVEYzFNRWd8OTJjYTg1YzdkNDU3Mzc0MGUzODc2NzJlYjc2MzA1OTVhOThlODk2M2RjNzQzYzUxMTZhNjA1MmU0ZTM0YTQyOA',
        'https://www.alkosto.com/medias/4713218461940-002-750Wx750H?context=bWFzdGVyfGltYWdlc3wxODI2MHxpbWFnZS93ZWJwfGFHWmxMMmhpWkM4eE5EUTJNVFl6TURBNE56RTVPQzgwTnpFek1qRTRORFl4T1RRd1h6QXdNbDgzTlRCWGVEYzFNRWd8OTNlY2VlZmJlZTYzNDMwYzAzYWI3ZWFlOWFlNTA5ZWZmZGU2N2Q3ODNiYmMwYzA1ZjIxNGZjNTAwMDJmMzMwZQ',
        'https://www.alkosto.com/medias/4713218461940-003-750Wx750H?context=bWFzdGVyfGltYWdlc3wxOTQ5MnxpbWFnZS93ZWJwfGFHRXdMMmhoT1M4eE5EUTJNVFl6TURZM056QXlNaTgwTnpFek1qRTRORFl4T1RRd1h6QXdNMTgzTlRCWGVEYzFNRWd8MGE1OTBiNjE4YjAwNjBiNzFmMzNiNzI5ZWNlZGI3OTk5OTM4NzgxZTBlZmYwMjcwNzIzN2UyMjIxMmM1OTM1NA'
      ],
      metadata: { clase: 'U3', velocidad: 'V30' }
    },

    // ==== COLECCIONABLES ====
    {
      nombre: 'Funko POP! TV: Witcher',
      descripcion: 'Geralt con espada - brilla en la oscuridad',
      tipo: 'COLECCIONABLE',
      plataforma: 'MULTI',
      categoria: 'Figura',
      precio: 70000,
      stock: 6,
      imagenes: [
        'https://m.media-amazon.com/images/I/71Qd85tJK+L._AC_SY300_SX300_QL70_FMwebp_.jpg',
        'https://m.media-amazon.com/images/I/71VDS-okacL._AC_SY450_.jpg',
        'https://m.media-amazon.com/images/I/61ERNEJPeKL._AC_SL1500_.jpg'
      ],
      metadata: { material: 'PVC', tamaño: '20cm' }
    },
    {
      nombre: 'Amiibo – Riju (Zelda)',
      descripcion: 'Figura compatible con Nintendo.',
      tipo: 'COLECCIONABLE',
      plataforma: 'NINTENDO',
      categoria: 'Amiibo',
      precio: 95000,
      stock: 9,
      imagenes: [
        'https://www.alkosto.com/medias/045496894306-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wzNDQ4MHxpbWFnZS93ZWJwfGFHRTBMMmd5WlM4eE5URXlOemd4T0RZMk5qQXhOQzh3TkRVME9UWTRPVFF6TURaZk1EQXhYemMxTUZkNE56VXdTQXxmYmM3MTc2NzFiOTA3ZmI1NGNlYTY3MWY5MWRmOWIxNGRmMDMyM2U1YmQ4MmUxNTNlZjk2YzFlNzdmOGM2ZjVj',
        'https://www.alkosto.com/medias/045496894306-002-750Wx750H?context=bWFzdGVyfGltYWdlc3wyMDA5MHxpbWFnZS93ZWJwfGFEWXpMMmd5WkM4eE5URXlOemd4T1RJMU5UZ3pPQzh3TkRVME9UWTRPVFF6TURaZk1EQXlYemMxTUZkNE56VXdTQXxhODFlZTJmZmZjMWUzMGE4YzRlNDQ1YjQ0M2RkNDY5ZjA3Zjc0Mjk1YjBkZGExMTMyNjNkNTQ2MDFjNmE0MmY0',
        'https://www.alkosto.com/medias/045496894306-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wzNDQ4MHxpbWFnZS93ZWJwfGFHRTBMMmd5WlM4eE5URXlOemd4T0RZMk5qQXhOQzh3TkRVME9UWTRPVFF6TURaZk1EQXhYemMxTUZkNE56VXdTQXxmYmM3MTc2NzFiOTA3ZmI1NGNlYTY3MWY5MWRmOWIxNGRmMDMyM2U1YmQ4MmUxNTNlZjk2YzFlNzdmOGM2ZjVj'
      ],
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
