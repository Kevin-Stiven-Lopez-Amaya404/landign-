// npm run compartir: imágenes para compartir en redes y WhatsApp (1200 × 630, JPG de menos de 300 KB)
// a partir de fotos reales del sitio. El recorte usa la estrategia «attention» de sharp, que conserva la zona
// con más detalle (normalmente las caras). Revisa el resultado a ojo si cambias una foto.
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";

const DESTINO = "assets/img/compartir";
const FOTOS = {
  general: ["assets/img/hero/duenos-hero-clean.jpg", "top"], // «attention» cortaba una cabeza: se recorta desde arriba
  semilla: "assets/semilla/futbol/_KEP4521.JPG",
  siembra: "assets/siembra/becados/WhatsApp Image 2026-06-16 at 7.03.57 AM.jpeg",
  cosecha: "assets/cosecha/WhatsApp Image 2026-06-16 at 7.00.24 AM.jpeg",
  psicosocial: "assets/psicologia/1.jpg",
  "sede-espinal": "assets/img/content/taller-educativo.jpg",
  donar: "assets/img/hero/hero-principal.jpg"
};
mkdirSync(DESTINO, { recursive: true });

for (const [nombre, valor] of Object.entries(FOTOS)) {
  const [foto, posicion = sharp.strategy.attention] = [].concat(valor);
  const salida = `${DESTINO}/${nombre}.jpg`;
  let calidad = 80;
  do {
    await sharp(foto).rotate().resize(1200, 630, { fit: "cover", position: posicion }).jpeg({ quality: calidad, mozjpeg: true }).toFile(salida);
    calidad -= 8;
  } while (statSync(salida).size > 300 * 1024 && calidad > 40);
  console.log(salida, Math.round(statSync(salida).size / 1024) + " KB");
}
