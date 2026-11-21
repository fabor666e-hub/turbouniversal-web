# B1 · API de productos y catálogo

## Historia
Como **front del sitio**, quiero obtener productos, categorías y vehículos desde una API, para que el catálogo, el buscador y el asistente usen datos reales y no datos de prueba.

## Comportamiento
1. El front llama a `GET /api/productos` con o sin filtros.
2. La API consulta PostgreSQL y devuelve los productos en el formato del contrato.
3. Para el asistente, el front llama a `GET /api/vehiculos`.

## Criterios de aceptación
Se comprueban con el navegador, Thunder Client/Postman o `curl`.
- [x] `GET /api/salud` responde 200 con `"baseDeDatos": "ok"`.
- [x] `GET /api/productos` devuelve los 12 productos iniciales ordenados por referencia.
- [x] `GET /api/productos?q=npr` devuelve solo productos que mencionan NPR.
- [x] `GET /api/productos?q=geometria` (sin tilde) encuentra "Geometría variable GT1749V".
- [x] `GET /api/productos?categoria=cartridge` devuelve solo los cartridges.
- [x] `GET /api/productos/TB-1002` devuelve el producto; `GET /api/productos/NO-EXISTE` responde 404 con `NO_ENCONTRADO`.
- [x] `GET /api/categorias` devuelve las 8 categorías con su cantidad de productos.
- [x] `GET /api/vehiculos` devuelve las marcas con sus modelos, sin repetidos.
- [x] Una petición desde un dominio distinto a `ORIGEN_FRONT` es rechazada por CORS.

Verificado con las pruebas automáticas de `backend/test/api.e2e-spec.ts` (32 pruebas) contra PostgreSQL.

## Fuera de alcance
Paginación (el catálogo es pequeño), imágenes subidas a la API.
