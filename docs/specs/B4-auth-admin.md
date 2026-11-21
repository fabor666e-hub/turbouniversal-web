# B4 · Autenticación y administración de productos

## Historia
Como **administrador**, quiero iniciar sesión y gestionar productos desde el panel, sin que nadie más pueda modificarlos.

## Comportamiento
1. El panel envía la clave a `POST /api/auth/login` y recibe un token de 8 horas.
2. Las rutas de escritura exigen ese token.

## Criterios de aceptación
- [x] Con la clave correcta, `POST /api/auth/login` devuelve un token y su fecha de vencimiento.
- [x] Con una clave incorrecta responde 401; al sexto intento en un minuto responde 429.
- [x] Crear, editar, cambiar stock o borrar sin token responde 401.
- [x] Con token: crear un producto válido responde 201 y aparece en `GET /api/productos`.
- [x] Crear una referencia repetida responde 409 `REFERENCIA_DUPLICADA`.
- [x] Un precio negativo o con letras responde 400.
- [x] `PATCH .../stock` con `delta: -1` en un producto con stock 0 lo deja en 0.
- [x] `DELETE` responde 204 y el producto ya no aparece.
- [x] La clave del panel y el secreto del token solo viven en variables de entorno, nunca en el código ni en GitHub.

Verificado con las pruebas automáticas de `backend/test/api.e2e-spec.ts` (32 pruebas) contra PostgreSQL.

## Fuera de alcance
Varios usuarios con roles (fase 2), recuperación de contraseña.
