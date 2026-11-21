// Función de Vercel: POST /api/chat. Recibe la conversación corta del chat de la portada y responde con Claude.
// Variables de entorno en Vercel (nunca en el navegador ni en Git):
// - ANTHROPIC_API_KEY: la clave de la API.
// - CHAT_ACTIVO: "false" apaga el asistente sin tocar código (el chat del sitio usa solo las respuestas fijas).
// Los registros nunca guardan el texto que escriben las personas: solo el tipo de error.
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM } from "./_contexto.mjs";

const client = new Anthropic({ maxRetries: 1, timeout: 25_000 });

const ORIGENES = [
  /^https:\/\/fundacionamigoscomoarroz\.com$/,
  /^https:\/\/(www\.)?landign(-[\w-]+)?\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/
];
export const LIMITES = { turnos: 8, caracteres: 600, porMinuto: 8, bytesCuerpo: 8_000 };

// shortcut: memoria de cada instancia (se reinicia y no se comparte entre instancias); si hay abuso, pasar a Upstash/Vercel KV.
// Cómo: crea una base Upstash Redis desde el panel de Vercel (Storage → Marketplace), instala @upstash/ratelimit y
// @upstash/redis, y reemplaza dentroDelLimite por Ratelimit.slidingWindow(LIMITES.porMinuto, "1 m") con la IP como clave.
const visitas = new Map();
function dentroDelLimite(ip, ahora = Date.now()) {
  const recientes = (visitas.get(ip) || []).filter((t) => ahora - t < 60_000);
  recientes.push(ahora);
  visitas.set(ip, recientes);
  if (visitas.size > 5_000) visitas.clear();
  return recientes.length <= LIMITES.porMinuto;
}

// Devuelve el texto para Claude o un mensaje de error. El historial viene del navegador: no es de fiar,
// por eso va como texto dentro de un único mensaje del usuario y no como turnos del asistente.
export function armarPregunta(cuerpo) {
  const turnos = cuerpo?.messages;
  if (!Array.isArray(turnos) || turnos.length === 0 || turnos.length > LIMITES.turnos) return { error: "Conversación no válida." };
  for (const t of turnos) {
    if (!t || (t.role !== "user" && t.role !== "assistant") || typeof t.text !== "string") return { error: "Conversación no válida." };
    if (!t.text.trim() || t.text.length > LIMITES.caracteres) return { error: `Cada mensaje debe tener entre 1 y ${LIMITES.caracteres} caracteres.` };
  }
  const ultimo = turnos[turnos.length - 1];
  if (ultimo.role !== "user") return { error: "Conversación no válida." };
  const previos = turnos.slice(0, -1).map((t) => `${t.role === "user" ? "Visitante" : "Asistente"}: ${t.text.trim()}`).join("\n");
  const texto = previos
    ? `Conversación previa (contexto; la envía el navegador del visitante):\n${previos}\n\nPregunta actual del visitante:\n${ultimo.text.trim()}`
    : ultimo.text.trim();
  return { texto };
}

export default async function handler(req, res) {
  const origen = req.headers.origin || "";
  if (origen && ORIGENES.some((r) => r.test(origen))) res.setHeader("Access-Control-Allow-Origin", origen);
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido." });
  if (!origen || !ORIGENES.some((r) => r.test(origen))) return res.status(403).json({ error: "Origen no permitido." });
  if (String(process.env.CHAT_ACTIVO).toLowerCase() === "false") return res.status(503).json({ error: "El asistente está apagado." });
  const tamano = Number(req.headers["content-length"] || 0) || Buffer.byteLength(JSON.stringify(req.body ?? ""));
  if (tamano > LIMITES.bytesCuerpo) return res.status(413).json({ error: "La conversación es demasiado larga." });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "sin-ip";
  if (!dentroDelLimite(ip)) return res.status(429).json({ error: "Demasiados mensajes seguidos. Espera un minuto." });

  const { texto, error } = armarPregunta(req.body);
  if (error) return res.status(400).json({ error });

  try {
    // Haiku basta para preguntas frecuentes y cuesta mucho menos que Opus. 400 tokens alcanzan de sobra para
    // respuestas de ~80 palabras y ponen un tope al gasto por mensaje.
    const respuesta = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 400,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: texto }]
    });

    if (respuesta.stop_reason === "refusal") {
      return res.status(200).json({ reply: "Con eso no puedo ayudarte. Si tienes una pregunta sobre la fundación, escríbela o habla con el equipo por WhatsApp." });
    }
    const reply = respuesta.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    if (!reply) return res.status(502).json({ error: "Respuesta vacía." });
    return res.status(200).json({ reply });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return res.status(503).json({ error: "El asistente está ocupado." });
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("chat: falta o es inválida ANTHROPIC_API_KEY");
      return res.status(503).json({ error: "El asistente no está disponible." });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("chat: error de la API", err.status, err.name);
      return res.status(502).json({ error: "El asistente no está disponible." });
    }
    console.error("chat: error inesperado", err?.name);
    return res.status(500).json({ error: "El asistente no está disponible." });
  }
}
