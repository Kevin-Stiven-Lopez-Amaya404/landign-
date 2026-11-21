import { SELECTORS, WHATSAPP_URL } from "./config.js";
import { registrarEvento } from "./eventos.js";

// Valida el formulario antes de abrir WhatsApp con el mensaje armado por el usuario.
// Teléfono y correo son opcionales (WhatsApp ya muestra el número); si se escriben, deben ser válidos.
// La autorización de datos es obligatoria. Si hay errores, un resumen arriba del formulario recibe el foco
// y enlaza a cada campo.
export function initContactForm() {
  const form = document.querySelector(SELECTORS.form);
  const status = document.querySelector(SELECTORS.formStatus);

  if (!form || !status) return;

  const fields = {
    name: form.elements.name,
    phone: form.elements.phone,
    email: form.elements.email,
    interest: form.elements.interest,
    message: form.elements.message,
    autorizo: form.elements.autorizo
  };
  const resumen = form.querySelector("#form-resumen");
  const avisoMenor = form.querySelector("#aviso-menor");

  const setStatus = (message, tipo = "") => {
    status.textContent = message;
    status.dataset.tipo = tipo;
  };

  const setFieldError = (field, message) => {
    const error = document.querySelector(`#${field.id}-error`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) {
      error.textContent = message;
    }
  };

  const validators = {
    name(value) {
      if (!value) return "Escribe tu nombre completo.";
      if (value.length < 3) return "El nombre debe tener al menos 3 caracteres.";
      if (!/^[\p{L}\s.'-]+$/u.test(value)) return "Usa solo letras y espacios en el nombre.";
      if (value.trim().split(/\s+/).length < 2) return "Incluye nombre y apellido.";
      return "";
    },
    phone(value) {
      const digits = value.replace(/\D/g, "");
      if (!value) return "";
      if (digits.length < 7 || digits.length > 15) return "El teléfono debe tener entre 7 y 15 dígitos.";
      if (/^(\d)\1+$/.test(digits)) return "Ingresa un teléfono válido.";
      return "";
    },
    email(value) {
      if (!value) return "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Ingresa un correo electrónico válido.";
      return "";
    },
    interest(value) {
      if (!value) return "Selecciona un interés.";
      return "";
    },
    message(value) {
      if (!value) return "Escribe tu mensaje.";
      if (value.length < 10) return "Cuéntanos un poco más (al menos 10 caracteres).";
      if (value.length > 700) return "El mensaje no debe superar los 700 caracteres.";
      return "";
    },
    autorizo(marcada) {
      if (!marcada) return "Para enviar tu mensaje, autoriza el tratamiento de tus datos.";
      return "";
    }
  };

  const valorDe = (field) => (field.type === "checkbox" ? field.checked : field.value.trim());

  const validateField = (name) => {
    const field = fields[name];
    const error = validators[name](valorDe(field));
    setFieldError(field, error);
    return error;
  };

  const mostrarAvisoMenor = () => {
    if (avisoMenor) avisoMenor.hidden = fields.interest.value !== "programas";
  };

  Object.keys(fields).forEach((name) => {
    const field = fields[name];
    const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
    field.addEventListener(eventName, () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(name);
      }
      if (name === "interest") mostrarAvisoMenor();
      setStatus("");
    });

    field.addEventListener("blur", () => {
      validateField(name);
    });
  });

  const mostrarResumen = (errores) => {
    if (!resumen) return;
    const lista = resumen.querySelector("ul");
    lista.replaceChildren(
      ...errores.map(([name, mensaje]) => {
        const item = document.createElement("li");
        const enlace = document.createElement("a");
        enlace.href = `#${fields[name].id}`;
        enlace.textContent = mensaje;
        enlace.addEventListener("click", (event) => {
          event.preventDefault();
          fields[name].focus();
        });
        item.append(enlace);
        return item;
      })
    );
    resumen.hidden = errores.length === 0;
    if (errores.length) resumen.focus();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errores = Object.keys(fields)
      .map((name) => [name, validateField(name)])
      .filter(([, error]) => error);

    if (errores.length) {
      setStatus("Revisa los campos marcados antes de enviar.", "error");
      mostrarResumen(errores);
      return;
    }
    mostrarResumen([]);

    const interestLabels = {
      programas: "Inscripción a un programa",
      donacion: "Donación",
      voluntariado: "Voluntariado",
      alianza: "Alianza",
      informacion: "Información general"
    };
    const values = Object.fromEntries(Object.keys(fields).map((name) => [name, valorDe(fields[name])]));
    const interes = interestLabels[values.interest] || values.interest;

    const whatsappMessage = [
      "Hola, quiero contactar a la Fundación Amigos Como Arroz.",
      "",
      `Nombre: ${values.name}`,
      values.phone ? `Teléfono: ${values.phone}` : null,
      values.email ? `Correo: ${values.email}` : null,
      `Interés: ${interes}`,
      "",
      `Mensaje: ${values.message}`
    ]
      .filter((linea) => linea !== null)
      .join("\n");

    const whatsappUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`;

    setStatus("Todo listo. Se abrirá WhatsApp para que termines de enviar tu mensaje.", "ok");
    registrarEvento("envio_formulario_whatsapp", "contacto", interes);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    form.reset();
    mostrarAvisoMenor();
    Object.values(fields).forEach((field) => setFieldError(field, ""));
  });
}
