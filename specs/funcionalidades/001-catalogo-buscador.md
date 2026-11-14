# 001 – Catálogo y buscador

**Estado:** Implementado
**Prioridad:** Alta

## Problema
El catálogo actual es un flipbook que Google no lee y en el que no se puede buscar. El cliente no sabe si hay unidades.

## Historias de usuario
- Como **mecánico**, quiero buscar por referencia (ej. HX35) para encontrar el repuesto exacto.
- Como **dueño de vehículo**, quiero buscar por el nombre de mi carro (ej. Duster) para ver qué le sirve.
- Como **cliente**, quiero filtrar por categoría para ver solo cartridges, kits, etc.
- Como **cliente**, quiero ver si hay stock antes de cotizar.

## Criterios de aceptación
- [x] Al escribir en el buscador, la lista se filtra mientras se escribe, por referencia, nombre, marca o vehículo.
- [x] La búsqueda ignora mayúsculas y tildes ("geometria" encuentra "Geometría").
- [x] Desde el inicio, el buscador lleva a `/productos?q=texto` con los resultados.
- [x] Las categorías del inicio llevan a `/productos?cat=slug` ya filtrado.
- [x] Cada producto muestra Disponible, Pocas unidades (3 o menos) o Agotado.
- [x] Cada producto tiene su página en `/productos/[referencia]` con título y descripción para Google.
- [x] Las búsquedas se registran en `eventos` cuando el usuario deja de escribir (1,2 s), no por cada letra.

## Plan técnico
- `app/productos/page.tsx` (servidor) lee productos y pasa `q` y `cat` a `Catalogo.tsx` (cliente).
- `app/productos/[referencia]/page.tsx` con `generateMetadata`.
- `lib/datos.ts` con respaldo local si Supabase falla.

## Pendiente
- [ ] Sitemap y datos estructurados (schema.org Product) para mejorar el SEO.
- [ ] Fotos reales por producto o por categoría.
