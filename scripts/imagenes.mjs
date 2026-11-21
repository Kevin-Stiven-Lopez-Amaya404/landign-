// npm run imagenes: crea las versiones WebP (calidad 80) de cada foto original nueva, en assets/img/opt/.
// - Busca originales .jpg, .jpeg, .png y .webp en las carpetas de ORIGENES.
// - Nombre de salida: la ruta desde assets/ en minúsculas, sin tildes ni espacios, con guiones, más el ancho:
//   assets/semilla/futbol/_KEP4521.JPG → semilla-futbol-kep4521-960.webp
//   assets/img/hero/hero-principal.jpg → img-hero-hero-principal-480.webp
// - Anchos: 480, 960 y 1600 px; si la foto es más angosta, el último es su ancho real (nunca se agranda).
// - No toca las fotos que ya tienen versiones en assets/img/opt/ (no regenera lo existente).
// Uso: npm run imagenes           → procesa todo lo nuevo
//      npm run imagenes -- --ver  → solo muestra qué haría
import sharp from "sharp";
import { readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ORIGENES = ["assets/img/hero", "assets/img/content", "assets/img/team", "assets/semilla", "assets/siembra", "assets/cosecha", "assets/psicologia"];
const DESTINO = "assets/img/opt";
const ANCHOS = [480, 960, 1600];
const soloVer = process.argv.includes("--ver");

const fotos = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const ruta = join(dir, f);
        if (statSync(ruta).isDirectory()) return fotos(ruta);
        return /\.(jpe?g|png|webp)$/i.test(f) ? [ruta] : [];
      })
    : [];

export const nombreBase = (ruta) =>
  relative("assets", ruta)
    .split("\\").join("/")
    .replace(extname(ruta), "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

mkdirSync(DESTINO, { recursive: true });
const existentes = readdirSync(DESTINO);
let nuevas = 0;

for (const foto of ORIGENES.flatMap(fotos)) {
  const base = nombreBase(foto);
  if (existentes.some((f) => f.startsWith(`${base}-`) && /-\d+\.webp$/.test(f))) continue;
  const { width } = await sharp(foto).metadata();
  const anchos = [...new Set([...ANCHOS.filter((a) => a < width), Math.min(width, 1600)])].sort((a, b) => a - b);
  for (const ancho of anchos) {
    const salida = `${DESTINO}/${base}-${ancho}.webp`;
    console.log(`${soloVer ? "(ver) " : ""}${foto} → ${salida}`);
    if (!soloVer) await sharp(foto).rotate().resize({ width: ancho }).webp({ quality: 80 }).toFile(salida);
    nuevas++;
  }
}
console.log(nuevas ? `${nuevas} versiones ${soloVer ? "por crear" : "creadas"}.` : "No hay fotos nuevas: todo está al día.");
