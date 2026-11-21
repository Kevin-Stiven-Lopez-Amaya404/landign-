// npm test: pruebas unitarias con node:test (sin navegador).
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import vm from "node:vm";

import {
  whatsapp,
  raiz,
  hayDonacion,
  migasLd,
  faqDe,
  faqLd,
  convocatoriasAbiertas,
  fechaLarga,
  peso,
  avisarPestanaNueva,
  minificarHtml,
  programaLd,
  indexable,
  ngoLd
} from "../lib/sitio.mjs";
import { armarPregunta, LIMITES } from "../api/chat.mjs";
import { armarContexto } from "../api/_contexto.mjs";
import { responder } from "../assets/js/modules/respuestas.js";

const require = createRequire(import.meta.url);
const { calcularFechas } = require("../src/_data/fechas.js");
const site = JSON.parse(readFileSync(new URL("../src/_data/site.json", import.meta.url), "utf8"));
const ejemplo = JSON.parse(readFileSync(new URL("./fixtures/site.ejemplo.json", import.meta.url), "utf8"));

test("whatsapp arma el enlace con el mensaje codificado", () => {
  assert.equal(whatsapp("573000000000"), "https://wa.me/573000000000");
  assert.equal(whatsapp("573000000000", "Hola, ¿cómo están?"), "https://wa.me/573000000000?text=Hola%2C%20%C2%BFc%C3%B3mo%20est%C3%A1n%3F");
});

test("raiz da el prefijo relativo según la profundidad", () => {
  assert.equal(raiz("/index.html"), "");
  assert.equal(raiz("/donar.html"), "");
  assert.equal(raiz("/programas/semilla.html"), "../");
  assert.equal(raiz("/programas/"), "../");
  assert.equal(raiz(false), "");
});

test("hayDonacion solo con medios o pasarela", () => {
  assert.equal(hayDonacion({ donacion: { medios: [], pasarela: { url: "" } } }), false);
  assert.equal(hayDonacion({ donacion: { medios: [{ nombre: "x" }], pasarela: { url: "" } } }), true);
  assert.equal(hayDonacion({ donacion: { medios: [], pasarela: { url: "https://x" } } }), true);
  assert.equal(hayDonacion(site), false, "hoy site.json no tiene medios de pago");
});

test("fechas: años desde septiembre de 2007 y mes actual", () => {
  assert.equal(calcularFechas(new Date(2026, 7, 31)).aniosFundacion, 18); // agosto de 2026
  assert.equal(calcularFechas(new Date(2026, 8, 1)).aniosFundacion, 19); // septiembre de 2026
  assert.equal(calcularFechas(new Date(2027, 0, 5)).mesActual, "2027-01");
  assert.equal(calcularFechas(new Date(2027, 0, 5)).iso, "2027-01-05");
  assert.ok("2027-01" > "2026-12", "«próximamente» se apaga cuando el mes actual pasa a diciembre de 2026");
});

test("convocatorias abiertas según abre y cierra", () => {
  const lista = [
    { titulo: "a", abre: "2026-01-01", cierra: "2026-06-30", programa: "siembra.html" },
    { titulo: "b", abre: "2026-07-01", cierra: "2026-12-31", programa: "semilla.html" }
  ];
  assert.deepEqual(convocatoriasAbiertas(lista, "2026-03-01").map((c) => c.titulo), ["a"]);
  assert.deepEqual(convocatoriasAbiertas(lista, "2026-06-30").map((c) => c.titulo), ["a"]);
  assert.deepEqual(convocatoriasAbiertas(lista, "2026-07-01", "semilla.html").map((c) => c.titulo), ["b"]);
  assert.deepEqual(convocatoriasAbiertas(lista, "2027-01-01"), []);
});

test("preguntas frecuentes: filtro por programa y JSON-LD solo con datos", () => {
  const faq = [{ pregunta: "¿A?", respuesta: "1", programa: "semilla.html" }, { pregunta: "¿B?", respuesta: "2" }];
  assert.equal(faqDe(faq).length, 2);
  assert.equal(faqDe(faq, "semilla.html").length, 1);
  assert.equal(faqLd([]), null);
  assert.equal(faqLd(faq).mainEntity.length, 2);
});

test("lo que depende de datos se oculta con site.json vacío y aparece con datos", () => {
  assert.equal(faqDe(site.faq).length, 0);
  assert.equal(convocatoriasAbiertas(site.convocatorias).length, 0);
  assert.equal(site.aliados.length, 0);
  assert.equal(hayDonacion(ejemplo), true);
  assert.ok(faqDe(ejemplo.faq, "semilla.html").length > 0);
});

test("formatos: fecha larga y peso de archivos", () => {
  assert.equal(fechaLarga("2027-03-15"), "15 de marzo de 2027");
  assert.equal(peso(19517493), "18,6 MB");
  assert.equal(peso(462431), "452 KB");
});

test("JSON-LD: migas, programa y fundación desde site.json", () => {
  const migas = migasLd("https://x.co", [{ nombre: "Programas", url: "programas/" }], "Semilla", "/programas/semilla.html");
  assert.deepEqual(migas.itemListElement.map((m) => m.item), ["https://x.co/", "https://x.co/programas/", "https://x.co/programas/semilla.html"]);
  assert.equal(programaLd(site, "semilla.html").provider.name, site.name);
  const ngo = ngoLd(site);
  assert.equal(ngo.foundingDate, "2007-09");
  assert.equal(ngo.location.length, 2);
  assert.ok(!("taxID" in ngo), "sin NIT no se inventa uno");
  assert.equal(ngoLd({ ...site, legal: { ...site.legal, nit: "900" } }).taxID, "900");
});

test("indexable: noindex con false o \"false\"", () => {
  assert.equal(indexable({}), true);
  assert.equal(indexable({ indexar: false }), false);
  assert.equal(indexable({ indexar: "false" }), false);
  assert.equal(indexable({ indexar: "true" }), true);
});

test("HTML: aviso de pestaña nueva y minificación conservadora", () => {
  assert.equal(avisarPestanaNueva('<a href="x" target="_blank">Ir</a>'), '<a href="x" target="_blank">Ir<span class="sr-only"> (se abre en una pestaña nueva)</span></a>');
  assert.equal(avisarPestanaNueva('<a aria-label="WhatsApp" target="_blank" href="x"></a>'), '<a aria-label="WhatsApp (se abre en una pestaña nueva)" target="_blank" href="x"></a>');
  const ya = '<a href="x" target="_blank">Ir (se abre en una pestaña nueva)</a>';
  assert.equal(avisarPestanaNueva(ya), ya);
  assert.equal(minificarHtml("  <p>\n    Hola <!-- nota -->\n  </p>\n\n"), "<p>\nHola\n</p>");
  assert.equal(minificarHtml("<pre>  a\n  b</pre>"), "<pre>  a\n  b</pre>");
});

test("chat: armarPregunta valida y arma el texto", () => {
  assert.ok(armarPregunta({}).error);
  assert.ok(armarPregunta({ messages: [{ role: "assistant", text: "hola" }] }).error, "el último turno debe ser del visitante");
  assert.ok(armarPregunta({ messages: [{ role: "user", text: "x".repeat(LIMITES.caracteres + 1) }] }).error);
  assert.ok(armarPregunta({ messages: Array.from({ length: LIMITES.turnos + 1 }, () => ({ role: "user", text: "hola" })) }).error);
  assert.equal(armarPregunta({ messages: [{ role: "user", text: "  ¿Dónde están?  " }] }).texto, "¿Dónde están?");
  const dos = armarPregunta({ messages: [{ role: "user", text: "Hola" }, { role: "assistant", text: "¡Hola!" }, { role: "user", text: "¿Horarios?" }] }).texto;
  assert.match(dos, /Visitante: Hola/);
  assert.match(dos, /Pregunta actual del visitante:\n¿Horarios\?/);
});

test("chat: el contexto sale de site.json y no inventa datos", () => {
  const texto = armarContexto(site, new Date(2026, 10, 21));
  assert.match(texto, /Lleva 19 años/);
  assert.match(texto, /Sede Espinal \(Espinal, Tolima\): la dirección se da por WhatsApp/);
  assert.match(texto, /todavía no hay medios de pago publicados/);
  assert.match(texto, /Nunca pidas datos de niñas, niños o adolescentes/);
  assert.match(armarContexto({ ...site, donacion: ejemplo.donacion }), /donar\.html/);
  assert.match(armarContexto({ ...site, faq: ejemplo.faq }), /Preguntas frecuentes/);
});

test("respuestas fijas del chat", () => {
  const datos = { whatsapp: "573000000000", whatsappLabel: "300 000 0000", chat: { sedes: site.sedes, faq: [], rte: false, donar: { pagina: false } } };
  const texto = (partes) => partes.map((p) => (typeof p === "string" ? p : p.text)).join("");
  const enlace = (partes) => partes.find((p) => typeof p !== "string")?.href || "";
  assert.match(texto(responder("¿Tienen horarios para Semilla?", datos)), /te lo da directamente el equipo/);
  assert.match(decodeURIComponent(enlace(responder("¿Tienen horarios para Semilla?", datos))), /¿Tienen horarios para Semilla\?/, "el mensaje de WhatsApp lleva la pregunta");
  assert.match(texto(responder("ubicacion", datos)), /Carrera 7A/);
  assert.match(texto(responder("ubicacion", datos)), /Sede Espinal \(Espinal, Tolima\): pide la dirección/);
  assert.match(texto(responder("programas", datos)), /Semilla, Siembra, Cosecha/);
  assert.match(texto(responder("¿Cómo dono?", datos)), /escríbenos por WhatsApp/);
  assert.match(texto(responder("certificado de donación", datos)), /te lo da directamente el equipo/);
  const conRte = { ...datos, chat: { ...datos.chat, rte: true, donar: { pagina: true, href: "donar.html" } } };
  assert.match(texto(responder("certificado de donación", conRte)), /Régimen Tributario Especial/);
  assert.equal(enlace(responder("quiero donar", conRte)), "donar.html");
  const conFaq = { ...datos, chat: { ...datos.chat, faq: [{ pregunta: "¿Qué edad deben tener los niños para Semilla?", respuesta: "De 6 a 17 años." }] } };
  assert.deepEqual(responder("¿qué edad deben tener los niños?", conFaq), ["De 6 a 17 años."]);
});

test("temporada: la Navidad va del 15 de noviembre al 6 de enero", () => {
  const codigo = readFileSync(new URL("../assets/js/seasonal.js", import.meta.url), "utf8");
  const temporadaEn = (fecha, busqueda = "") => {
    const RealDate = Date;
    class FechaFija extends RealDate {
      constructor(...a) {
        super(...(a.length ? a : [fecha]));
      }
    }
    const html = { dataset: {}, classList: { add() {} } };
    const contexto = {
      Date: FechaFija,
      URLSearchParams,
      window: { location: { search: busqueda } },
      document: { documentElement: html, querySelector: () => null }
    };
    vm.runInNewContext(codigo, contexto);
    return html.dataset.season || null;
  };
  assert.equal(temporadaEn("2026-11-14T12:00:00"), null);
  assert.equal(temporadaEn("2026-11-15T12:00:00"), "navidad");
  assert.equal(temporadaEn("2027-01-06T12:00:00"), "navidad");
  assert.equal(temporadaEn("2027-01-07T12:00:00"), null, "se apaga sola después del 6 de enero");
  assert.equal(temporadaEn("2026-12-10T12:00:00", "?temporada=off"), null);
  assert.equal(temporadaEn("2026-07-10T12:00:00", "?temporada=navidad"), "navidad");
});
