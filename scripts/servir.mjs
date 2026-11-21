// node scripts/servir.mjs <carpeta> <puerto>: servidor estático mínimo para las pruebas (npm run test:e2e).
// Sirve index.html en las carpetas y responde 404 con la página 404.html, como Vercel.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, resolve, extname } from "node:path";

const [carpeta = "_site", puerto = "8180"] = process.argv.slice(2);
const raiz = resolve(carpeta);
const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".pdf": "application/pdf", ".webmanifest": "application/manifest+json", ".woff2": "font/woff2", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain", ".vtt": "text/vtt" };

createServer(async (req, res) => {
  let ruta = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (ruta.endsWith("/")) ruta += "index.html";
  const archivo = join(raiz, ruta);
  if (!archivo.startsWith(raiz)) return res.writeHead(403).end();
  try {
    const datos = await readFile(archivo);
    res.writeHead(200, { "content-type": TIPOS[extname(archivo).toLowerCase()] || "application/octet-stream" }).end(datos);
  } catch {
    const pagina = await readFile(join(raiz, "404.html")).catch(() => "404");
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" }).end(pagina);
  }
}).listen(Number(puerto), () => console.log(`Sirviendo ${raiz} en http://localhost:${puerto}`));
