// Borra la carpeta de salida antes de compilar, para que no queden archivos viejos publicados.
import { rmSync } from "node:fs";
rmSync(process.argv[2] || "_site", { recursive: true, force: true });
