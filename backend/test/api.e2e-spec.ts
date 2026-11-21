// Pruebas de los criterios de aceptación B1 a B4 (docs/specs/) contra una base PostgreSQL real.
// Requiere DATABASE_URL apuntando a una base de PRUEBAS: la vacía antes de empezar.
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configurarApp } from '../src/configurar-app';

process.env.JWT_SECRETO ??= 'secreto-de-prueba';
process.env.PANEL_CLAVE ??= 'clave-de-prueba';
process.env.ORIGEN_FRONT ??= 'http://localhost:3000';

let app: INestApplication;
let api: ReturnType<typeof request>;
let token = '';

beforeAll(async () => {
  // Base limpia: se borran las tablas para que la migración y la semilla corran desde cero
  const limpia = new DataSource({ type: 'postgres', url: process.env.DATABASE_URL });
  await limpia.initialize();
  await limpia.query('DROP TABLE IF EXISTS productos, eventos, cotizaciones, migrations CASCADE');
  await limpia.destroy();

  const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = configurarApp(modulo.createNestApplication());
  await app.init();
  api = request(app.getHttpServer());
});

afterAll(async () => {
  await app?.close();
});

const admin = () => ({ Authorization: `Bearer ${token}` });

describe('B1 · Productos y catálogo', () => {
  it('GET /api/salud responde ok con la base de datos', async () => {
    const r = await api.get('/api/salud').expect(200);
    expect(r.body).toEqual({ estado: 'ok', baseDeDatos: 'ok' });
  });

  it('devuelve los 12 productos iniciales ordenados por referencia', async () => {
    const r = await api.get('/api/productos').expect(200);
    expect(r.body).toHaveLength(12);
    const refs = r.body.map((p: { referencia: string }) => p.referencia);
    expect(refs).toEqual([...refs].sort());
  });

  it('?q=npr devuelve solo productos que mencionan NPR', async () => {
    const r = await api.get('/api/productos?q=npr').expect(200);
    expect(r.body.length).toBe(6);
    for (const p of r.body) expect(JSON.stringify(p).toLowerCase()).toContain('npr');
  });

  it('?q=geometria (sin tilde) encuentra "Geometría variable"', async () => {
    const r = await api.get('/api/productos?q=geometria').expect(200);
    expect(r.body.map((p: { nombre: string }) => p.nombre)).toEqual(['Geometría variable GT1749V']);
  });

  it('?categoria=cartridge devuelve solo cartridges', async () => {
    const r = await api.get('/api/productos?categoria=cartridge').expect(200);
    expect(r.body).toHaveLength(2);
    expect(r.body.every((p: { categoria: string }) => p.categoria === 'cartridge')).toBe(true);
  });

  it('GET /api/productos/TB-1002 devuelve el producto y una referencia inexistente da 404', async () => {
    const r = await api.get('/api/productos/TB-1002').expect(200);
    expect(r.body).toMatchObject({ referencia: 'TB-1002', precio: 2400000, stock: 2 });
    const n = await api.get('/api/productos/NO-EXISTE').expect(404);
    expect(n.body.error.codigo).toBe('NO_ENCONTRADO');
  });

  it('GET /api/categorias devuelve las 8 categorías con su cantidad', async () => {
    const r = await api.get('/api/categorias').expect(200);
    expect(r.body).toHaveLength(8);
    expect(r.body.find((c: { slug: string }) => c.slug === 'cartridge').cantidad).toBe(2);
  });

  it('GET /api/vehiculos devuelve marcas con modelos sin repetidos', async () => {
    const r = await api.get('/api/vehiculos').expect(200);
    const chevrolet = r.body.find((v: { marca: string }) => v.marca === 'Chevrolet');
    expect(chevrolet.modelos).toEqual(['NPR']);
    const marcas = r.body.map((v: { marca: string }) => v.marca);
    expect(new Set(marcas).size).toBe(marcas.length);
  });

  it('CORS: un dominio no permitido no recibe permiso', async () => {
    const ok = await api.get('/api/productos').set('Origin', 'http://localhost:3000');
    expect(ok.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    const malo = await api.get('/api/productos').set('Origin', 'https://sitio-ajeno.com');
    expect(malo.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('B4 · Autenticación', () => {
  it('con la clave correcta devuelve token y vencimiento', async () => {
    const r = await api.post('/api/auth/login').send({ clave: process.env.PANEL_CLAVE }).expect(200);
    expect(typeof r.body.token).toBe('string');
    expect(new Date(r.body.expiraEn).getTime()).toBeGreaterThan(Date.now());
    token = r.body.token;
  });

  it('con una clave incorrecta responde 401', async () => {
    const r = await api.post('/api/auth/login').send({ clave: 'mala' }).expect(401);
    expect(r.body.error.codigo).toBe('NO_AUTORIZADO');
  });

  it('crear, editar, cambiar stock o borrar sin token responde 401', async () => {
    await api.post('/api/productos').send({}).expect(401);
    await api.put('/api/productos/TB-1001').send({}).expect(401);
    await api.patch('/api/productos/TB-1001/stock').send({ delta: 1 }).expect(401);
    await api.delete('/api/productos/TB-1001').expect(401);
    await api.get('/api/productos/TB-1001').expect(200); // sigue existiendo
  });
});

describe('B4 · Administración de productos', () => {
  const nuevo = {
    referencia: 'tb-9999',
    nombre: 'Turbo de prueba',
    marca: 'Turboman',
    categoria: 'turboalimentadores',
    vehiculos: ['Toyota Hilux'],
    precio: 1500000,
    stock: 3,
  };

  it('crear un producto válido responde 201 y aparece en el catálogo', async () => {
    const r = await api.post('/api/productos').set(admin()).send(nuevo).expect(201);
    expect(r.body.referencia).toBe('TB-9999');
    await api.get('/api/productos/TB-9999').expect(200);
  });

  it('una referencia repetida responde 409 REFERENCIA_DUPLICADA', async () => {
    const r = await api.post('/api/productos').set(admin()).send(nuevo).expect(409);
    expect(r.body.error.codigo).toBe('REFERENCIA_DUPLICADA');
  });

  it('un precio negativo o con letras responde 400', async () => {
    const a = await api.post('/api/productos').set(admin()).send({ ...nuevo, referencia: 'TB-9998', precio: -5 }).expect(400);
    expect(a.body.error.codigo).toBe('VALIDACION');
    await api.post('/api/productos').set(admin()).send({ ...nuevo, referencia: 'TB-9998', precio: 'mil' }).expect(400);
  });

  it('un vehículo sin modelo responde 400', async () => {
    const r = await api.post('/api/productos').set(admin()).send({ ...nuevo, referencia: 'TB-9997', vehiculos: ['Chevrolet'] }).expect(400);
    expect(r.body.error.mensaje).toContain('Marca Modelo');
  });

  it('PUT edita el producto', async () => {
    const { referencia, ...resto } = nuevo;
    const r = await api.put('/api/productos/TB-9999').set(admin()).send({ ...resto, precio: 1600000 }).expect(200);
    expect(r.body.precio).toBe(1600000);
  });

  it('PATCH stock con delta -1 sobre stock 0 lo deja en 0', async () => {
    const r = await api.patch('/api/productos/TB-1003/stock').set(admin()).send({ delta: -1 }).expect(200);
    expect(r.body.stock).toBe(0);
    const s = await api.patch('/api/productos/TB-1003/stock').set(admin()).send({ delta: 1 }).expect(200);
    expect(s.body.stock).toBe(1);
  });

  it('DELETE responde 204 y el producto ya no aparece', async () => {
    await api.delete('/api/productos/TB-9999').set(admin()).expect(204);
    await api.get('/api/productos/TB-9999').expect(404);
  });
});

describe('B2 · Cotizaciones', () => {
  const base = { nombre: 'Camila Pérez', telefono: '300 123 4567', aceptaDatos: true };

  it('una cotización válida responde 201 con precios de la base de datos y total correcto', async () => {
    const r = await api
      .post('/api/cotizaciones')
      .send({ ...base, items: [{ referencia: 'TB-1002', cantidad: 1 }, { referencia: 'tb-3001', cantidad: 2 }] })
      .expect(201);
    expect(r.body.id).toBeGreaterThan(0);
    expect(r.body.telefono).toBe('3001234567');
    expect(r.body.items[0]).toMatchObject({ nombre: 'Turboalimentador HX35', precio: 2400000, subtotal: 2400000 });
    expect(r.body.total).toBe(2400000 + 2 * 190000);
  });

  it('un precio inventado en el cuerpo se ignora', async () => {
    const r = await api
      .post('/api/cotizaciones')
      .send({ ...base, total: 1, items: [{ referencia: 'TB-2001', cantidad: 1, precio: 1 }] })
      .expect(201);
    expect(r.body.total).toBe(780000);
  });

  it('sin aceptar el tratamiento de datos responde 400', async () => {
    const r = await api
      .post('/api/cotizaciones')
      .send({ ...base, aceptaDatos: false, items: [{ referencia: 'TB-2001', cantidad: 1 }] })
      .expect(400);
    expect(r.body.error.mensaje).toContain('Ley 1581');
  });

  it('un teléfono con letras o muy corto responde 400', async () => {
    await api.post('/api/cotizaciones').send({ ...base, telefono: '300abc', items: [{ referencia: 'TB-2001', cantidad: 1 }] }).expect(400);
    await api.post('/api/cotizaciones').send({ ...base, telefono: '123', items: [{ referencia: 'TB-2001', cantidad: 1 }] }).expect(400);
  });

  it('una referencia inexistente responde 404', async () => {
    const r = await api.post('/api/cotizaciones').send({ ...base, items: [{ referencia: 'NO-EXISTE', cantidad: 1 }] }).expect(404);
    expect(r.body.error.codigo).toBe('NO_ENCONTRADO');
  });

  it('pedir más que el stock responde 409 STOCK_INSUFICIENTE', async () => {
    const r = await api.post('/api/cotizaciones').send({ ...base, items: [{ referencia: 'TB-1002', cantidad: 3 }] }).expect(409);
    expect(r.body.error.codigo).toBe('STOCK_INSUFICIENTE');
  });

  it('la cotización aparece en GET /api/cotizaciones con token (y sin token da 401)', async () => {
    await api.get('/api/cotizaciones').expect(401);
    const r = await api.get('/api/cotizaciones').set(admin()).expect(200);
    expect(r.body.length).toBe(2);
    expect(r.body[0].nombre).toBe('Camila Pérez');
  });
});

describe('B3 · Eventos y panel', () => {
  it('un evento válido responde 202', async () => {
    await api.post('/api/eventos').send({ tipo: 'busqueda', detalle: 'npr' }).expect(202);
    await api.post('/api/eventos').send({ tipo: 'asistente', detalle: 'modelo:Chevrolet NPR' }).expect(202);
    await api.post('/api/eventos').send({ tipo: 'vista_producto', detalle: 'TB-1002' }).expect(202);
  });

  it('un tipo no permitido responde 400', async () => {
    await api.post('/api/eventos').send({ tipo: 'hackeo', detalle: 'x' }).expect(400);
  });

  it('un detalle de más de 120 caracteres responde 400', async () => {
    await api.post('/api/eventos').send({ tipo: 'clic', detalle: 'x'.repeat(121) }).expect(400);
  });

  it('el resumen sin token responde 401 y con token trae totales, listas y stock bajo', async () => {
    await api.get('/api/panel/resumen').expect(401);
    const r = await api.get('/api/panel/resumen').set(admin()).expect(200);
    expect(r.body.totales).toEqual({ vistas: 1, busquedas: 1, agregados: 0, cotizaciones: 2 });
    expect(r.body.masBuscados[0]).toEqual({ valor: 'npr', cantidad: 1 });
    expect(r.body.vehiculosAsistente[0].valor).toBe('modelo:Chevrolet NPR');
    expect(r.body.stockBajo.every((p: { stock: number }) => p.stock <= 3)).toBe(true);
    expect(r.body.stockBajo.map((p: { referencia: string }) => p.referencia)).toContain('TB-5001');
  });

  it('más de 60 eventos en un minuto desde la misma IP responde 429', async () => {
    let ultimo = 0;
    for (let i = 0; i < 61; i++) ultimo = (await api.post('/api/eventos').send({ tipo: 'clic', detalle: 'prueba' })).status;
    expect(ultimo).toBe(429);
  });
});

describe('B4 · Límite de intentos de login', () => {
  it('al sexto intento en un minuto responde 429', async () => {
    // Ya hubo 2 intentos (uno bueno y uno malo); se hacen 3 más y el sexto debe bloquearse
    for (let i = 0; i < 3; i++) await api.post('/api/auth/login').send({ clave: 'mala' }).expect(401);
    const r = await api.post('/api/auth/login').send({ clave: 'mala' }).expect(429);
    expect(r.body.error.codigo).toBe('DEMASIADAS_SOLICITUDES');
  });
});
