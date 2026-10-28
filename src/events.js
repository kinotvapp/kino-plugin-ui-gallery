import { DOCS, GROUP_IDS, LIST_MAX } from "./constants.js";
import { sanitize } from "./state.js";

const said = (es, en, lang) => (lang === "en" ? en : es);

const describe = (name, arg, value) => {
  const v = value === undefined ? "" : " · value " + JSON.stringify(value).slice(0, 120);
  return name + (arg === undefined || arg === null ? "" : " · arg " + String(arg).slice(0, 60)) + v;
};

/** What each event answers. Pure: a function of the event and the state. */
export function answer({ name, arg, value, state, route, lang }) {
  const s = sanitize(state);
  const last = describe(name, arg, value);
  switch (name) {
    case "open": {
      // A go.screen may name the tab to start at.
      const wanted = route && route.args && route.args.tab;
      return GROUP_IDS.includes(wanted) ? { state: { tab: wanted } } : null;
    }
    case "tab": return GROUP_IDS.includes(value) ? { state: { tab: value } } : null;
    case "inner": return ["a", "b", "c"].includes(value) ? { state: { inner: value, last } } : null;
    case "count": return { state: { count: Math.max(-1000000, Math.min(1000000, s.count + (arg === "-1" ? -1 : 1))), last } };
    case "timer": return { state: { timer: value === true, ticks: value === true ? s.ticks : 0, last } };
    case "tick": return { state: { ticks: s.ticks + 1 } };
    case "more": return s.listCount >= LIST_MAX ? null : { state: { listCount: Math.min(LIST_MAX, s.listCount + 5), loading: false } };
    case "pressed": return { state: { last }, toast: { text: said("Pulsaste: " + arg, "You pressed: " + arg, lang), ms: 2000 } };
    case "chips": case "changed": case "searched": case "sort": return { state: { last }, toast: said("Evento: " + last, "Event: " + last, lang) };
    case "retry": case "demoTitle": return { state: { last }, toast: said("Aquí iría la acción", "The action would go here", lang) };
    case "dismiss": return { state: { last }, toast: said("Aviso cerrado", "Notice dismissed", lang) };
    case "toast":
      if (arg === "success") return { toast: { text: "Guardado", textEn: "Saved", role: "success" } };
      if (arg === "action") return { toast: { text: "Elemento borrado", textEn: "Item deleted", action: { label: "Deshacer", labelEn: "Undo", event: "pressed", arg: "undo" }, ms: 6000 } };
      return { toast: "Hola", toastEn: "Hello" };
    case "submit": return { state: { last }, toast: { text: "Formulario válido", textEn: "Valid form", role: "success" } };
    case "term": return { state: { last }, ui: [{ close: "declaredSheet" }], toast: said("Término guardado", "Term saved", lang) };
    case "writeConfig": return { config: { greeting: lang === "en" ? "Hello" : "Hola" }, toast: said("Ajuste escrito", "Setting written", lang) };
    case "dialog":
      return { dialog: { title: "Un diálogo", titleEn: "A dialog", body: "Lo arma la respuesta de screenEvent.", bodyEn: "screenEvent's answer builds it.", buttons: [{ label: "Aceptar", labelEn: "OK", event: "pressed", arg: "dialogOk", variant: "primary" }, { label: "Cancelar", labelEn: "Cancel", variant: "text" }] } };
    case "sheet":
      return { sheet: { title: "Una hoja", titleEn: "A sheet", body: [{ type: "Text", text: "Abajo en el teléfono, a un lado en la TV.", textEn: "At the bottom on a phone, at the side on a TV." }, { type: "QrImage", value: DOCS, size: "small" }] } };
    case "menu":
      return { menu: { title: "Acciones", titleEn: "Actions", items: [{ label: "Compartir", labelEn: "Share", icon: "language", onTap: { event: "pressed", arg: "share" } }, { label: "Guardar", labelEn: "Save", icon: "bookmark", onTap: { event: "pressed", arg: "save" } }] } };
    case "story":
      // The robust way: patch the state, then open the declared pop-up once the new tree is drawn.
      return { state: { story: arg === "sintel" ? "sintel" : "bunny", last }, ui: [{ open: "declaredDialog" }] };
    case "dialogClosed": return { state: { story: "", last }, toast: said("Lo cerraste tú (onClose)", "You closed it (onClose)", lang) };
    case "slow": return { state: { last }, toast: said("Listo, tras la espera", "Done, after the wait", lang) };
    case "checkCode": {
      const typed = state && state.inputs && typeof state.inputs.codeDemo === "string" ? state.inputs.codeDemo : "";
      return typed.trim() === "1234" ? { state: { codeError: false, last }, toast: { text: "Código correcto", textEn: "Right code", role: "success" } } : { state: { codeError: true, last } };
    }
    case "resend": return Number.isFinite(arg) ? { state: { resendAt: arg, last } } : null;
    case "push": return { route: { push: arg === "scaffold" ? "scaffold" : "detail", params: { from: "gallery" } } };
    case "pop": return { route: { pop: true } };
    default: return null;
  }
}

export async function screenEvent(ev) {
  // the slow press waits a little (Kino's pending cue shows meanwhile); resend counts 30 s from now.
  if (ev.name === "slow" && typeof kino !== "undefined" && kino.sleep) await kino.sleep(1200);
  if (ev.name === "resend") return answer({ ...ev, arg: Date.now() + 30000 });
  return answer(ev);
}
