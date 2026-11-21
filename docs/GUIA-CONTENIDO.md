# Guía de contenido

Esta guía es para la persona de la fundación que actualiza el sitio. No hace falta saber programar: casi todo
se cambia en un solo archivo, `src/_data/site.json`.

## Antes de empezar

- `site.json` es un archivo JSON: los textos van entre comillas dobles `"…"`, cada dato se separa del siguiente
  con una coma y las listas van entre corchetes `[ … ]`. Si falta una coma o sobra una, el sitio no compila y
  Vercel avisa del error.
- Para revisar el archivo puedes pegarlo en un validador de JSON en línea antes de guardar.
- Lo que dejes vacío (`""` o `[]`) simplemente no se muestra.
- Después de cada cambio, publica (ver el final de esta guía).

## Los campos de `site.json`

### Datos de contacto

```json
"whatsapp": "573187073308",
"whatsappLabel": "318 707 3308",
"email": "amigoscomoarroz@gmail.com",
"instagram": "https://www.instagram.com/amigoscomoarroz",
"facebook": "https://www.facebook.com/amigoscomoarroz"
```

`whatsapp` va con el 57 adelante y sin espacios; `whatsappLabel` es como se ve en pantalla. Cuando exista un
correo con el dominio de la fundación (por ejemplo `contacto@fundacionamigoscomoarroz.com`), cámbialo en `email`.

### Datos legales

```json
"legal": {
  "razonSocial": "Fundación Amigos Como Arroz",
  "nit": "900.123.456-7",
  "representanteLegal": "Nombre Apellido",
  "rte": true,
  "politicaRevisada": false,
  "vigenciaPolitica": "1 de febrero de 2027",
  "estadosFinancieros": "informes/ESTADOS-FINANCIEROS-2025.pdf",
  "certificadoExistencia": "informes/CERTIFICADO-EXISTENCIA-2026.pdf",
  "actaAsamblea": ""
}
```

- `rte: true` muestra el beneficio tributario en Donar. Ponlo solo si la fundación está calificada en el
  Régimen Tributario Especial.
- `politicaRevisada: true` solo cuando un abogado haya revisado `src/privacidad.html` y `src/terminos.html`.

### Sedes

```json
"sedes": [
  { "nombre": "Sede Neiva", "ciudad": "Neiva", "departamento": "Huila", "direccion": "Carrera 7A No. 16-25, barrio Quirinal", "horario": "Lunes a viernes, 8:00 a. m. a 5:00 p. m.", "telefono": "", "mapa": "https://maps.app.goo.gl/…" },
  { "nombre": "Sede Espinal", "ciudad": "Espinal", "departamento": "Tolima", "direccion": "", "horario": "", "telefono": "", "mapa": "" }
]
```

`mapa` es el enlace que da Google Maps con «Compartir» → «Copiar vínculo». Con ese enlace aparece el botón
«Cómo llegar».

### Donaciones

```json
"donacion": {
  "medios": [
    { "nombre": "Bancolombia", "tipo": "Cuenta de ahorros", "numero": "000-000000-00", "titular": "Fundación Amigos Como Arroz" }
  ],
  "pasarela": { "nombre": "Wompi", "url": "https://checkout.wompi.co/l/…" },
  "montos": [ { "valor": "$50.000", "impacto": "Un mes de refrigerios para un niño o una niña." } ],
  "especie": [ "Útiles escolares", "Balones" ]
}
```

En cuanto haya un medio de pago o una pasarela, todos los botones «Donar» del sitio llevan a `donar.html`.

### Cifras de impacto

```json
"impacto": {
  "cifras": [ { "valor": 4200, "texto": "participantes beneficiados por programas educativos y sociales.", "destacada": true } ],
  "corte": "diciembre de 2025",
  "fuente": "Informe de gestión 2025",
  "informe": "informes/INFORME-GESTION-FUNDACION-AMIGOS-COMO-ARROZ-2025.pdf"
}
```

`valor` va sin puntos (el sitio pone «4.200» solo).

### Quiénes somos

```json
"institucional": { "mision": "…", "vision": "…", "valores": ["Respeto", "Servicio"], "junta": [ { "nombre": "…", "cargo": "Presidenta" } ] }
```

### Equipo

Cada persona es un bloque en `equipo`. Si no hay nombre (`"nombre": ""`), la tarjeta muestra el cargo como título.

```json
{ "nombre": "Moira Quintero", "cargo": "Directora", "descripcion": "…", "etiquetas": ["Dirección general", "+ alianzas"],
  "foto": { "src": "assets/img/opt/img-team-directora-480.webp", "srcset": "…", "ancho": 720, "alto": 817 },
  "alt": "Moira Quintero, directora de la Fundación Amigos Como Arroz" }
```

### Aliados y alianzas

```json
"aliados": [ { "nombre": "Organización Roa Florhuila", "logo": "assets/img/aliados/roa.webp", "url": "https://…" } ],
"alianzas": { "tipos": [ { "nombre": "Patrocinio de un programa", "descripcion": "…" } ] }
```

Pide siempre el permiso del aliado para publicar su logo.

### Voluntariado

```json
"voluntariado": { "perfiles": ["Docentes de refuerzo escolar"], "compromiso": "Cuatro horas a la semana durante seis meses.", "pasos": ["Escríbenos", "Entrevista", "Inducción"] }
```

## Cómo agregar…

### Una pregunta frecuente

En `faq` agrega un bloque. `programa` es opcional: si lo pones, también aparece en la página de ese programa.

```json
{ "pregunta": "¿Los programas tienen costo?", "respuesta": "No: son gratuitos para las familias.", "programa": "" }
```

### Una convocatoria

```json
{ "programa": "siembra.html", "titulo": "Becas Siembra 2027", "abre": "2027-01-15", "cierra": "2027-02-28", "requisitos": "Ser bachiller y…", "enlace": "" }
```

Se muestra entre `abre` y `cierra`. El sitio la oculta al compilar después del cierre: publica de nuevo ese día
(o deja programada una publicación diaria en Vercel con un *Deploy Hook*).

### Un informe o documento

1. Copia el PDF en `informes/` (nombre en mayúsculas, sin tildes ni espacios).
2. Si pesa mucho, crea la versión web (ver `informes/README.md`).
3. Agrégalo al principio de `documentos`:

```json
{ "etiqueta": "2026", "anio": 2026, "tipo": "Informe de gestión", "estado": "Más reciente", "titulo": "Informe de gestión 2026", "descripcion": "…", "archivo": "informes/INFORME-GESTION-FUNDACION-AMIGOS-COMO-ARROZ-2026.pdf", "destacado": true }
```

Al informe anterior cámbiale `"estado": "Histórico"` y quítale `"destacado"`.

### Una foto

1. Copia el original en la carpeta que corresponde (`assets/semilla/danza/`, `assets/img/content/`…).
2. Corre `npm run imagenes`: crea las versiones WebP de 480, 960 y 1600 px en `assets/img/opt/` y muestra sus nombres.
3. Usa esos nombres en la página (`src="assets/img/opt/…-960.webp"`) con un `alt` que describa lo que se ve.

### Un testimonio en video con subtítulos

1. Copia el video en `assets/videos/originales/` y su versión comprimida en `assets/videos/` (ver
   `assets/videos/originales/README.md`).
2. Crea los subtítulos `.vtt` (ver `assets/videos/subtitulos/README.md`).
3. Agrega el testimonio en `testimonios` con `video`, `poster`, `posterAncho`, `posterAlto`, `etiqueta`, `titulo`,
   `texto` y, si los tienes, `nombre`, `programa`, `cita`, `subtitulos` y `transcripcion`.

### Una noticia

1. Copia `src/noticias/_ejemplo.md.txt` como `src/noticias/nombre-corto.md` (sin tildes ni espacios).
2. Cambia el encabezado (título, descripción, fecha e imagen) y el texto.
3. Con la primera noticia aparece la página `noticias/` y las noticias entran al sitemap.

## Activar la analítica

1. Crea una propiedad de Google Analytics 4 y copia su ID (empieza por `G-`).
2. Escríbelo en `analytics.ga4`.
3. Al publicar aparece el aviso de cookies; solo se mide a quien acepta.

## Publicar

1. Guarda los cambios y súbelos a la rama `dev` (o pide a quien mantiene el sitio que lo haga).
2. GitHub revisa todo automáticamente (pruebas, enlaces rotos, accesibilidad).
3. Al pasar a `main`, Vercel publica el sitio en uno o dos minutos.

Para ver los cambios en tu computador antes de publicar: `npm install` (una sola vez) y luego `npm start`.
