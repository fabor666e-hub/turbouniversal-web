# Producto · Turbo Universal Web

## Problema
Importadora Turbo Universal (distribuidora oficial de Turboman y Master Power) vende turbos y repuestos, pero su sitio no ayuda a vender:
- El catálogo es un flipbook (Flipsnack) que Google no puede leer y en el que no se puede buscar.
- No hay buscador por referencia, vehículo o marca.
- Cada cotización se arma a mano por WhatsApp, producto por producto.
- El cliente no sabe si hay unidades disponibles.
- Hay información desactualizada y con errores de ortografía.
- La empresa no sabe qué buscan, miran o cotizan sus clientes.
- El diseño se ve anticuado.

Sitio actual: https://turbouniversal.com.co

## Usuario
- **Principal:** mecánicos, talleres y dueños de vehículos livianos, de carga y maquinaria en Colombia que necesitan un turbo o repuesto y cotizan por WhatsApp.
- **Interno:** el personal de la empresa, que responde cotizaciones y mantiene precios y stock.

## Objetivo del MVP
Que un cliente encuentre el repuesto correcto, vea si hay disponibilidad y envíe una cotización completa por WhatsApp en menos de 2 minutos, sin escribir producto por producto.

## Funcionalidades (ver docs/specs/)
- F1 · Catálogo y buscador
- F2 · Cotización por WhatsApp
- F3 · Asistente por vehículo
- F4 · Panel de analítica
- F5 · Administrador de productos

Páginas de apoyo (dentro de F1): Nosotros, Marcas, Puntos de venta, 404 propia.

## Fuera del MVP
Pagos en línea, cuentas o inicio de sesión de clientes, cálculo de envíos, carga masiva desde Excel, app móvil nativa, chat en vivo, sincronización con otro sistema de inventario.

## Cómo sabremos que funciona
- Las cotizaciones llegan por WhatsApp con referencia, cantidad, nombre y teléfono (se ven en el panel).
- Un cliente llega a un producto en 3 clics o menos desde el inicio.
- El panel muestra qué se busca, qué se ve y qué se cotiza.
- La empresa actualiza precio y stock sin entrar a Supabase.
