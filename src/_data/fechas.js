// Fechas que se calculan al compilar (Eleventy), para que no se venzan en el HTML.
// Ojo: el sitio es estático; estos valores se actualizan con cada publicación (cada build en Vercel).
const FUNDACION = { anio: 2007, mes: 9 }; // septiembre de 2007

// Se exporta también la función para probarla con cualquier fecha (test/unitarias.test.mjs).
function calcularFechas(hoy) {
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth() + 1;
  return {
    anio,
    // Años cumplidos desde la fundación: el aniversario es en septiembre.
    aniosFundacion: anio - FUNDACION.anio - (mes < FUNDACION.mes ? 1 : 0),
    // "AAAA-MM" de hoy, para comparar con fechas de eventos ("2026-12" ya pasó si hoy es posterior).
    mesActual: `${anio}-${String(mes).padStart(2, "0")}`,
    // "AAAA-MM-DD" de hoy (convocatorias abiertas, noticias).
    iso: `${anio}-${String(mes).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`
  };
}

module.exports = { ...calcularFechas(new Date()), calcularFechas };
