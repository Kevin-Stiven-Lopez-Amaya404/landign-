# Despliegue

## Ramas y revisión

- Cada bloque de trabajo va en su rama (nace de `dev`) y llega a `dev` con un PR.
- GitHub Actions (`.github/workflows/ci.yml`) corre en cada PR y en cada push a `dev`, `qa` y `main`:
  `npm ci`, `npm run build`, `npm run build:ejemplo`, `npm test`, `npm run check`, `npm run lint` y Playwright
  en Chromium (390 y 1440 px). En los PR corre además Lighthouse como aviso (no bloquea).
- Vercel crea una vista previa por PR. Fusionar `dev` en `main` publica producción.

## Antes de publicar

- `npm run build`, `npm test`, `npm run check`, `npm run lint` y `npm run test:e2e` en verde.
- Revisar la vista previa de Vercel en computador y celular, con y sin temporada (`?temporada=off`).
- Si se tocaron datos legales: la política y los términos solo pierden el aviso de borrador y el `noindex`
  con `legal.politicaRevisada: true`, después de la revisión de un abogado.

## Variables de entorno en Vercel

| Variable | Para qué |
|---|---|
| `ANTHROPIC_API_KEY` | Que el chat responda con Claude (Production y Preview). Sin ella, el chat usa sus respuestas fijas. Conviene un límite de gasto mensual en la consola de Anthropic. |
| `CHAT_ACTIVO` | `false` apaga el asistente sin tocar código. |

`VERCEL_ENV` la pone Vercel: el aviso de «borrador» de la política solo se ve fuera de producción.

## Qué publica Vercel

`vercel.json` ejecuta `npm run build` y publica `_site/`. Solo se copian los recursos que el sitio usa
(`assets/img/opt`, `iconos`, `compartir`, `fonts`, videos comprimidos, subtítulos, PDF, `robots.txt`, manifiesto
y favicon); el JS y el CSS los escribe esbuild minificados. Los originales de fotos y videos se quedan en el
repositorio.

`vercel.json` también define:

- **Encabezados de seguridad:** CSP (sin `unsafe-inline` en scripts; permite Google Analytics, que solo carga con
  permiso), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` y HSTS.
- **Caché:** HTML siempre revalidado; `assets/` por un año (`immutable`, el JS y el CSS llevan huella); videos y
  PDF un día; `/api/` sin caché.
- **Redirecciones 301:** `www` al dominio sin `www`, `/index.html` a `/` y los `index.html` de las carpetas.

## Otro hosting

Ejecuta `npm run build` y sube el contenido de `_site/`. Los encabezados y redirecciones de `vercel.json` hay que
configurarlos en ese hosting, y el chat necesita una función equivalente a `api/chat.mjs`.
