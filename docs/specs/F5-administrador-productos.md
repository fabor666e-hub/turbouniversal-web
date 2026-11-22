# F5 · Administrador de productos

## Historia
Como **administrador de la empresa**, quiero crear, editar y borrar productos y cambiar su stock, para mantener el catálogo al día sin entrar a Supabase.

## Comportamiento
1. Desde el panel toca "Administrar productos" y ve la tabla con buscador.
2. Usa "+ Nuevo producto", "Editar", los botones − y + del stock o "Borrar".
3. Tras guardar, vuelve a la lista con un mensaje de confirmación.

## Criterios de aceptación
Implementado y compilado sin errores. Los criterios que guardan datos se marcan al probarlos con Supabase activo (hoy está pausado).
- [x] Sin sesión, `/panel/productos` redirige a `/panel`.
- [ ] La tabla muestra referencia, nombre, marca, categoría, precio y stock, y el buscador filtra.
- [ ] Crear un producto con todos los campos válidos lo muestra en la lista y en el catálogo público.
- [ ] Crear un producto con una referencia que ya existe muestra un error en español y no lo guarda.
- [ ] Un precio con letras o un stock negativo muestra un error y no se guarda.
- [ ] Un vehículo sin modelo (ej. solo "Chevrolet") muestra un error.
- [ ] El botón "+" sube el stock en 1 y "−" lo baja, sin pasar de 0.
- [ ] "Borrar" pide confirmación y, al aceptar, el producto desaparece de la lista.
- [ ] Se pueden escribir números de parte OEM (uno por línea, máximo 20) y la garantía; aparecen en la ficha del producto y el buscador encuentra el producto por OEM. (La API lo valida: pruebas B4 "PUT guarda números OEM…".)

## Fuera de alcance
Subir fotos, carga masiva desde Excel, historial de cambios.
