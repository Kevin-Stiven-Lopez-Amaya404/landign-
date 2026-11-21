// Respuestas fijas del chat: se usan con las preguntas rápidas y cuando /api/chat no responde.
// No toca el DOM (se prueba con node:test). Todo dato sale de site.json (llega en #site-data): si un dato
// no existe, no se adivina y se remite al equipo por WhatsApp con la pregunta ya escrita en el mensaje.
// Cada respuesta es una lista de partes: texto o enlace { text, href }. Nunca HTML.

export const normalizar = (texto) =>
  String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const enlaceWhatsApp = (base, etiqueta, mensaje) => ({ text: etiqueta, href: mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base });

// Pregunta frecuente que más se parece (al menos dos palabras largas en común).
function buscarFaq(texto, faq = []) {
  let mejor = null;
  let puntos = 1;
  for (const item of faq) {
    const palabras = new Set(normalizar(item.pregunta).split(/\W+/).filter((p) => p.length > 4));
    const comunes = [...palabras].filter((p) => texto.includes(p)).length;
    if (comunes > puntos) {
      mejor = item;
      puntos = comunes;
    }
  }
  return mejor;
}

/**
 * @param {string} pregunta lo que escribió o eligió la persona
 * @param {{ whatsapp: string, whatsappLabel: string, chat?: object }} datos contenido de #site-data
 */
export function responder(pregunta, datos) {
  const texto = normalizar(pregunta);
  const chat = datos.chat || {};
  const base = `https://wa.me/${datos.whatsapp}`;
  const wa = (mensaje) => enlaceWhatsApp(base, datos.whatsappLabel, mensaje);
  const alEquipo = [
    "Ese dato te lo da directamente el equipo de la fundación. Escríbenos por WhatsApp al ",
    wa(`Hola, tengo una pregunta: ${String(pregunta).trim().slice(0, 300)}`),
    " y te respondemos."
  ];
  const sedes = (chat.sedes || []).filter((s) => s.ciudad);

  const faq = buscarFaq(texto, chat.faq);
  if (faq) return [faq.respuesta];

  if (/(certificado|deduccion|descuento|tributari|257)/.test(texto)) {
    if (!chat.rte) return alEquipo;
    return [
      "Sí. La fundación pertenece al Régimen Tributario Especial y puedes pedir tu certificado de donación por WhatsApp al ",
      wa("Hola, quiero pedir el certificado de mi donación. Mi nombre, documento, fecha y valor de la donación son:"),
      ". Consulta con tu contador cómo usarlo."
    ];
  }

  if (/(telefono|celular|whatsapp|contacto|comunicar|llamar|numero)/.test(texto)) {
    return ["Puedes comunicarte con la fundación al WhatsApp ", wa(), "."];
  }

  if (/(horario|hora|abren|atienden)/.test(texto)) {
    const conHorario = sedes.filter((s) => s.horario);
    if (!conHorario.length) return alEquipo;
    return [conHorario.map((s) => `${s.nombre}: ${s.horario}.`).join(" ")];
  }

  if (/(ubicacion|direccion|donde|sede|queda|neiva|espinal|barrio|llegar)/.test(texto) && sedes.length) {
    const partes = sedes.map((s) =>
      s.direccion ? `${s.nombre}: ${s.direccion}, ${s.ciudad}, ${s.departamento}.` : `${s.nombre} (${s.ciudad}, ${s.departamento}): pide la dirección por WhatsApp.`
    );
    return [partes.join(" "), " WhatsApp: ", wa(), "."];
  }

  // Detalles que solo tiene el equipo (si no los resolvió una pregunta frecuente).
  if (/(requisit|edad|cost|precio|valor|cupo|inscri|matricul|cuando|fecha)/.test(texto)) return alEquipo;

  if (/(voluntari)/.test(texto)) {
    const partes = ["Puedes sumarte como voluntario. "];
    if (chat.voluntariado) partes.push("Mira cómo empezar en ", { text: "la página de voluntariado", href: chat.voluntariado }, " o escríbenos al ");
    else partes.push("Escríbenos por WhatsApp al ");
    partes.push(wa("Hola, quiero ser voluntario de la Fundación Amigos Como Arroz."), ".");
    return partes;
  }

  if (/(donar|donacion|dono|aporte|aportar)/.test(texto)) {
    if (chat.donar?.pagina) return ["Puedes donar desde ", { text: "la página de donaciones", href: chat.donar.href }, ". Si prefieres, escríbenos al ", wa(), "."];
    return ["Para donar, escríbenos por WhatsApp al ", wa("Hola, quiero hacer una donación a la Fundación Amigos Como Arroz."), " y te contamos cómo."];
  }

  if (/(programa|semilla|siembra|cosecha|psicosocial|actividad)/.test(texto)) {
    return ["Nuestros programas principales son Semilla, Siembra, Cosecha y Acompañamiento Psicosocial."];
  }

  if (/(apoyar|aliado|alianza|empresa|ayudar|patrocin)/.test(texto)) {
    return ["Puedes apoyar como voluntario, aliado o donante. Escríbenos por WhatsApp al ", wa("Hola, quiero apoyar a la Fundación Amigos Como Arroz."), "."];
  }

  return alEquipo;
}
