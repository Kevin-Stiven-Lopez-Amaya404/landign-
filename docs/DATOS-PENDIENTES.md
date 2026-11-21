# Datos pendientes de la fundación

El sitio ya está listo para mostrar todo esto: solo falta que la fundación entregue cada dato y que alguien lo
escriba en `src/_data/site.json` (ver `docs/GUIA-CONTENIDO.md`). Mientras un campo esté vacío, la sección que
depende de él no aparece: nada queda vacío ni con texto de relleno a la vista.

| Dato | Quién lo entrega | Campo en `site.json` | Qué se activa al llenarlo |
|---|---|---|---|
| Razón social | Dirección o contabilidad | `legal.razonSocial` | Aparece en el pie, en Transparencia, en la política de datos y en el JSON-LD (`legalName`). |
| NIT | Contabilidad | `legal.nit` | Pie, Transparencia, política, términos y JSON-LD (`taxID`). |
| Representante legal | Dirección | `legal.representanteLegal` | Transparencia. |
| Estado en el Régimen Tributario Especial | Contabilidad | `legal.rte` (`true` o `false`) | Bloque «Beneficio tributario» en Donar, botón para pedir el certificado y respuesta del chat sobre certificados. |
| Estados financieros (PDF) | Contabilidad | `legal.estadosFinancieros` (ruta al PDF en `informes/`) | Fila en Transparencia. |
| Certificado de existencia y representación legal (PDF) | Dirección | `legal.certificadoExistencia` | Fila en Transparencia. |
| Acta de asamblea (PDF, opcional) | Dirección | `legal.actaAsamblea` | Fila en Transparencia. |
| Revisión legal de la política de datos y los términos | Abogado o abogada | `legal.politicaRevisada` (`true`) y `legal.vigenciaPolitica` (fecha) | Se quita el aviso de borrador, las dos páginas dejan de llevar `noindex` y entran al sitemap. |
| Medios de pago (cuentas, Nequi, Daviplata…) | Tesorería | `donacion.medios`: `[{ "nombre", "tipo", "numero", "titular" }]` | Página `donar.html` con botón para copiar; todos los botones «Donar» pasan a llevar a esa página. |
| Pasarela de pago (Wompi, ePayco, PSE…) | Tesorería | `donacion.pasarela`: `{ "nombre", "url" }` | Botón «Donar en línea» en Donar (y los botones «Donar» llevan a la página). |
| Montos sugeridos con su impacto | Dirección y tesorería | `donacion.montos`: `[{ "valor", "impacto" }]` | Bloque «Lo que hace tu aporte» en Donar. |
| Donación en especie | Coordinación | `donacion.especie`: `["útiles escolares", …]` | Bloque «Donaciones en especie» en Donar. |
| Dirección, horario, teléfono y mapa de Neiva | Coordinación | `sedes[0]`: `direccion` (ya está), `horario`, `telefono`, `mapa` | Contacto, pie, chat y botón «Cómo llegar». |
| Dirección, horario, teléfono y mapa de Espinal | Coordinación de la sede | `sedes[1]`: `direccion`, `horario`, `telefono`, `mapa` | Contacto, pie, página de la Sede Espinal (con «Cómo llegar»), chat y JSON-LD. |
| ID de Google Analytics 4 | Quien administre la analítica | `analytics.ga4` (`G-…`) | Aviso de cookies y medición solo para quien acepte; botón «Preferencias de cookies» en el pie. |
| Verificación de Search Console | Quien administre el dominio | `verificacion.google` | Meta de verificación en el `<head>`. |
| Misión | Dirección | `institucional.mision` | Sección «Quiénes somos» en la portada y el chat. |
| Visión | Dirección | `institucional.vision` | «Quiénes somos» y el chat. |
| Valores | Dirección | `institucional.valores`: `["…", "…"]` | «Quiénes somos». |
| Junta directiva | Dirección | `institucional.junta`: `[{ "nombre", "cargo" }]` | «Quiénes somos». |
| Logos de aliados (con permiso para publicarlos) | Alianzas | `aliados`: `[{ "nombre", "logo", "url" }]` (logo en `assets/img/aliados/`) | Franja de logos en la portada y en `aliados.html`. Incluye a la Organización Roa Florhuila si entrega su logo. |
| Tipos de alianza | Alianzas | `alianzas.tipos`: `[{ "nombre", "descripcion" }]` | Bloque «Formas de aliarse» en `aliados.html`. |
| Preguntas frecuentes de las familias | Coordinación de programas | `faq`: `[{ "pregunta", "respuesta", "programa" }]` (`programa` opcional, por ejemplo `"semilla.html"`) | Sección con `<details>` en la portada y en cada programa, JSON-LD `FAQPage` y respuestas del chat. |
| Convocatorias | Coordinación de programas | `convocatorias`: `[{ "programa", "titulo", "abre", "cierra", "requisitos", "enlace" }]` (fechas `AAAA-MM-DD`) | Aviso en la portada y en el programa mientras esté abierta (se oculta sola al compilar después del cierre). |
| Detalles del voluntariado | Coordinación | `voluntariado.perfiles`, `voluntariado.compromiso`, `voluntariado.pasos` | Bloques en `voluntariado.html`. |
| Nombre de quien coordina los programas | Dirección | `equipo[1].nombre` (y borrar `pendiente`) | La tarjeta muestra el nombre como el resto del equipo. |
| Rol de Caren González | Dirección | `equipo[3].cargo` (hoy dice «Voluntariado»; su texto habla de gestión sostenible y sus etiquetas de redes y apoyo) | La etiqueta de su tarjeta y el chat. |
| Fecha de corte y fuente de las cifras de impacto | Dirección o coordinación | `impacto.corte`, `impacto.fuente` e `impacto.informe` (ruta al PDF) | Línea «Cifras a …, según …» debajo de las cifras, con enlace al informe; el chat la menciona. |
| Nombres, programas y citas de los testimonios (con autorización) | Comunicaciones | `testimonios[n].nombre`, `programa`, `cita` | Se muestran debajo de cada video. |
| Subtítulos y transcripciones de los videos | Comunicaciones | `testimonios[n].subtitulos` (`.vtt` en `assets/videos/subtitulos/`) y `transcripcion` | Subtítulos en el reproductor y enlace «Leer la transcripción». |
| Logo en alta resolución o en vector (SVG) | Comunicaciones | Reemplazar `assets/img/brand/logo-fundacion.jpg` y correr `npm run iconos` | Íconos nítidos en celulares y al instalar el sitio. Hoy el logo mide 160 × 160 px. |
| Correo con dominio propio | Quien administre el dominio | `email` (por ejemplo `contacto@fundacionamigoscomoarroz.com`) | Cambia en todo el sitio, el chat y `security.txt`. |
| Confirmación de las autorizaciones de imagen de los menores que aparecen en fotos y videos | Coordinación y familias | (no es un campo) | Si falta alguna, hay que retirar esa foto o video del sitio. |
