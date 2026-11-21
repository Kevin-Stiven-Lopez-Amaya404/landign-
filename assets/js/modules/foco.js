// Mantiene el foco dentro de un panel abierto (menú, chat): Tab y Mayús+Tab recorren en círculo los elementos
// enfocables del botón que lo abrió y del panel. Devuelve una función para soltarlo.
const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function atraparFoco(panel, boton) {
  const alPresionar = (event) => {
    if (event.key !== "Tab") return;
    const lista = [boton, ...panel.querySelectorAll(ENFOCABLES)].filter((el) => el && el.getClientRects().length && !el.closest("[hidden]"));
    if (!lista.length) return;
    event.preventDefault();
    const actual = lista.indexOf(document.activeElement);
    const paso = event.shiftKey ? -1 : 1;
    const siguiente = actual === -1 ? (event.shiftKey ? lista.length - 1 : 0) : (actual + paso + lista.length) % lista.length;
    lista[siguiente].focus();
  };
  document.addEventListener("keydown", alPresionar);
  return () => document.removeEventListener("keydown", alPresionar);
}
