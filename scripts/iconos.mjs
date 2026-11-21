// npm run iconos: genera los íconos del sitio a partir del logo (assets/img/brand/logo-fundacion.jpg).
// No redibuja el logo: solo lo escala. Hoy el original mide 160 × 160 px, así que los de 192 y 512 px se ven
// algo suaves; cuando la fundación entregue el logo en alta resolución o vector, reemplaza el original y vuelve
// a correr este script.
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

const ORIGEN = "assets/img/brand/logo-fundacion.jpg";
const DESTINO = "assets/img/iconos";
const BLANCO = { r: 255, g: 255, b: 255, alpha: 1 };
mkdirSync(DESTINO, { recursive: true });

const png = (lado) => sharp(ORIGEN).resize(lado, lado, { kernel: "lanczos3", fit: "contain", background: BLANCO }).png({ compressionLevel: 9 }).toBuffer();

for (const [nombre, lado] of [["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
  writeFileSync(`${DESTINO}/${nombre}`, await png(lado));
}

// Maskable: el logo ocupa el 80 % central (zona segura) sobre fondo blanco, para que Android lo recorte sin cortarlo.
const interior = await png(410);
writeFileSync(
  `${DESTINO}/icon-maskable-512.png`,
  await sharp({ create: { width: 512, height: 512, channels: 4, background: BLANCO } }).composite([{ input: interior, gravity: "center" }]).png().toBuffer()
);

// favicon.ico de 32 px: un ICO con un PNG adentro (lo leen todos los navegadores actuales).
const ico32 = await png(32);
const cabecera = Buffer.alloc(22);
cabecera.writeUInt16LE(0, 0); // reservado
cabecera.writeUInt16LE(1, 2); // tipo: ícono
cabecera.writeUInt16LE(1, 4); // una imagen
cabecera.writeUInt8(32, 6); // ancho
cabecera.writeUInt8(32, 7); // alto
cabecera.writeUInt8(0, 8); // sin paleta
cabecera.writeUInt8(0, 9);
cabecera.writeUInt16LE(1, 10); // planos
cabecera.writeUInt16LE(32, 12); // bits por píxel
cabecera.writeUInt32LE(ico32.length, 14); // tamaño de la imagen
cabecera.writeUInt32LE(22, 18); // dónde empieza
writeFileSync("favicon.ico", Buffer.concat([cabecera, ico32]));

console.log("Íconos listos en", DESTINO, "y favicon.ico");
