# Especificaciones del proyecto (Spec-Driven Development)

Esta carpeta es la **fuente de verdad** del sitio de Importadora Turbo Universal.
En SDD primero se escribe *qué* se quiere y *por qué*; el código viene después y debe cumplir lo escrito aquí.

## Cómo está organizada

| Archivo | Para qué sirve |
|---|---|
| `constitucion.md` | Reglas que **nunca** se rompen (marca, stack, seguridad, idioma). |
| `producto.md` | Problema, usuarios, visión y alcance del sitio. |
| `arquitectura.md` | Cómo está construido: stack, carpetas, datos y flujos. |
| `funcionalidades/NNN-nombre.md` | Una especificación por funcionalidad, con historias de usuario y criterios de aceptación. |
| `plantillas/spec-plantilla.md` | Plantilla para crear una funcionalidad nueva. |

## Flujo de trabajo

1. **Especificar:** copia `plantillas/spec-plantilla.md` a `funcionalidades/NNN-nombre.md` (siguiente número libre) y llena *Problema*, *Historias* y *Criterios de aceptación*. Todavía sin código.
2. **Aclarar:** marca con `[DUDA]` lo que no esté claro y resuélvelo con la empresa antes de seguir.
3. **Planear:** llena la sección *Plan técnico* (archivos que se tocan, datos, riesgos). Revisa que no contradiga `constitucion.md`.
4. **Tareas:** divide el plan en tareas pequeñas con casillas `- [ ]`.
5. **Implementar:** programa tarea por tarea y marca `- [x]` al terminar.
6. **Verificar:** prueba cada criterio de aceptación y cambia el *Estado* a `Implementado`.

Si el código y la especificación no coinciden, se corrige uno de los dos **en el mismo cambio**: nunca se deja desactualizado.

## Trabajar con una IA

Pídele a la IA que lea primero `specs/constitucion.md`, `specs/arquitectura.md` y la especificación de la funcionalidad. Ejemplo:

> Lee specs/constitucion.md, specs/arquitectura.md y specs/funcionalidades/005-administrador-productos.md. Implementa solo las tareas pendientes de la sección Tareas, respetando la constitución, y marca las que completes.

## Estado de las funcionalidades

| # | Funcionalidad | Estado |
|---|---|---|
| 001 | Catálogo y buscador | Implementado |
| 002 | Cotización en línea | Implementado |
| 003 | Asistente por vehículo | Implementado |
| 004 | Panel de analítica | Implementado |
| 005 | Administrador de productos | Pendiente |
| 006 | Marcas, sedes y páginas institucionales | Implementado |
