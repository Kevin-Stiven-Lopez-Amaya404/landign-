# Centro de documentación

Lo que debe leer cualquier persona antes de modificar el sitio.

## Para la fundación (sin programar)

- [`GUIA-CONTENIDO.md`](GUIA-CONTENIDO.md): cómo llenar `site.json`, agregar fotos, informes, noticias, testimonios,
  convocatorias y preguntas frecuentes, activar la analítica y publicar.
- [`DATOS-PENDIENTES.md`](DATOS-PENDIENTES.md): qué datos faltan, quién los entrega y qué se activa con cada uno.

## Para programadores (en este orden)

1. [`GUIA_PROGRAMADOR.md`](GUIA_PROGRAMADOR.md): arquitectura, carpetas, cómo se arma cada página y flujo de trabajo.
2. [`CODIGO.md`](CODIGO.md): compilación, plantillas, CSS, JavaScript, chat, pruebas y reglas de mantenimiento.
3. [`DOCUMENTACION.md`](DOCUMENTACION.md): secciones visibles y cambios comunes.
4. [`PROGRAMAS.md`](PROGRAMAS.md): el bloque de Programas y sus páginas.
5. [`DESPLIEGUE.md`](DESPLIEGUE.md): ramas, PR, integración continua y publicación en Vercel.

## HU26 (sitio completo y profesional)

- [`AUDITORIA-HU26.md`](AUDITORIA-HU26.md): qué se corrigió, mediciones de antes y después y lo pendiente.
- [`DECISIONES-HU26.md`](DECISIONES-HU26.md): decisiones tomadas, por qué y cómo revertirlas.
- [`PROGRESO-HU26.md`](PROGRESO-HU26.md): lista de tareas del encargo.
- [`auditoria-hu26/ANTES.md`](auditoria-hu26/ANTES.md): línea base.

Históricas (ya no describen el estado actual): [`AUDITORIA-2026-11.md`](AUDITORIA-2026-11.md) y
[`AUDITORIA-ESTRUCTURA-2026-11.md`](AUDITORIA-ESTRUCTURA-2026-11.md).

## Regla rápida

- Ver el sitio: `npm start` (no abrir el HTML con doble clic).
- Datos de la fundación: solo `src/_data/site.json`.
- Portada: `src/index.html`. Partes comunes: `src/_includes/`.
- Estilos: `assets/css/sitio.css` (dirección visual en `DESIGN.md`). Interacciones: `assets/js/modules/`.
- Antes de un PR: `npm run build`, `npm test`, `npm run check`, `npm run lint` y `npm run test:e2e`.
