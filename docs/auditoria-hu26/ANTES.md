# Línea base HU26 (antes de los cambios)

Medido el 20 de noviembre de 2026 sobre `dev` (commit `06073b6`), compilado y servido en local **sin compresión** (por eso el peso y los tiempos son peores que en Vercel). Las mediciones de «después» se toman igual, para comparar lo mismo con lo mismo. La temporada de Navidad estaba activa (la fecha cae entre el 15 de noviembre y el 6 de enero).

Las capturas (390 y 1440 px, página completa), los JSON de Lighthouse y axe están en `docs/auditoria-hu26/antes/`, que no va a Git.

## Lighthouse móvil

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | TBT | CLS | Peso | Elemento LCP | Fallas |
|---|---|---|---|---|---|---|---|---|---|---|
| Portada | 62 | 100 | 100 | 100 | 5,3 s | 400 ms | 0 | 684 KB | texto de la entrada (`<span>`) | — |
| Semilla | 70 | 95 | 100 | 100 | 3,1 s | 950 ms | 0 | 336 KB | foto de portada | `target-size` (botón Nieve) |
| Sede Espinal | 93 | 95 | 100 | 100 | 3,0 s | 0 ms | 0 | 323 KB | foto de portada | `target-size` (botón Nieve) |

Referencia ya medida en producción (con compresión): portada 78 / 100 / 100 / 100, LCP 4,7 s (texto de «Entrar»); Semilla 93 / 95.

## Recorrido con Playwright (movimiento reducido)

- Sin errores de consola ni respuestas 4xx/5xx en las 7 páginas.
- Sin desborde horizontal de página.
- **La barra flotante se desborda en todas las páginas:** 37 px en la portada (390 y 1440) y 22 px en las internas en celular. El último ícono queda cortado.
- axe-core: solo `color-contrast` sobre texto encima de fotos (falsos positivos conocidos: axe no ve el velo oscuro de la foto; el contraste real se midió en HU19).
