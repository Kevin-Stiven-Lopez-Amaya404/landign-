# Programas

Paginas relacionadas con las rutas de acompanamiento de la Fundacion.

## Archivos

- `index.html`: vista general de todos los programas.
- `semilla.html`: Programa Semilla.
- `siembra.html`: Programa Siembra.
- `cosecha.html`: Programa Cosecha.
- `psicosocial.html`: Acompanamiento Psicosocial.

## Como se arman

Cada archivo guarda solo su `<main>` y un encabezado `---` con `layout: layouts/interna.njk`, titulo, descripcion, `canonical` y el enlace `back`. La plantilla `src/_includes/layouts/interna.njk` pone el `<head>`, la cabecera y el pie. Eleventy las publica en `/programas/`, un nivel por debajo de la raiz, por eso sus rutas usan:

```html
../assets/img/brand/logo-fundacion.jpg
../index.html#programas
```

## Regla

Si agregas un nuevo programa, copia aqui una pagina existente, cambia su encabezado y agrega el programa a `programas` en `src/_data/site.json` y la tarjeta en `../index.html` (seccion `#programas`) y la URL en `sitemap.xml`.

