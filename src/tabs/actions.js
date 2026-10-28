import { caption, para, section, t } from "../helpers.js";
import { initial } from "../state.js";

export function actionsTab(s = initial()) {
  return [
    section("button", "Botones", "Buttons", "ElevatedButton · Button secondary · TextButton · IconButton", [
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "ElevatedButton", key: "btnPrimary", labelText: "Principal", labelTextEn: "Primary", onPressed: "pressed", arg: "primary" },
          { type: "Button", key: "btnSecondary", variant: "secondary", labelText: "Secundario", labelTextEn: "Secondary", onPressed: "pressed", arg: "secondary" },
          { type: "TextButton", key: "btnText", labelText: "Texto", labelTextEn: "Text", onPressed: "pressed", arg: "text" },
          { type: "IconButton", key: "btnIcon", icon: "heart", labelText: "Me gusta", labelTextEn: "Like", onPressed: "pressed", arg: "icon" },
          { type: "ElevatedButton", key: "btnWithIcon", icon: "star", labelText: "Con icono", labelTextEn: "With an icon", onPressed: "pressed", arg: "withIcon" },
          { type: "ElevatedButton", key: "btnOff", labelText: "Apagado", labelTextEn: "Disabled", enabled: false, onPressed: "pressed", arg: "off" },
          { type: "Button", key: "btnConfirm", variant: "secondary", labelText: "Con confirmación", labelTextEn: "With confirmation", confirm: "¿Seguro?", confirmEn: "Are you sure?", onPressed: "pressed", arg: "confirmed" },
        ],
      },
      { type: "Card", key: "longPressCard", variant: "outlined", onTap: "pressed", arg: "card", onLongPress: { event: "pressed", arg: "long" }, children: [para("Toca o mantén pulsada esta tarjeta", "Tap or long-press this card")] },
    ]),
    section("busy", "Pulsaciones lentas", "Slow presses", "loading · onPressed.timeoutMs", [
      caption("Kino marca ocupado el botón mientras tu respuesta tarda; loading lo hace desde tu árbol.", "Kino marks the button busy while your answer takes long; loading does it from your tree."),
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "ElevatedButton", key: "busySlow", labelText: "Tarda un poco", labelTextEn: "Takes a while", onPressed: { event: "slow", timeoutMs: 25000 } },
          { type: "Button", key: "busyLoading", variant: "secondary", labelText: "Siempre ocupado", labelTextEn: "Always busy", loading: true, onPressed: "pressed", arg: "never" },
        ],
      },
    ]),
    section("text-time", "Esperar para reenviar", "Wait to send again", "enabledAt · Text timeFormat countdown", [
      {
        type: "Row", gap: 8, crossAxisAlignment: "center",
        children: s.resendAt > 0 ? [
          { type: "TextButton", key: "resendDemo", labelText: "Reenviar", labelTextEn: "Send again", enabledAt: s.resendAt, onPressed: "resend" },
          { type: "Text", key: "resendLeft", ...t("en", "in"), time: s.resendAt, timeFormat: "countdown", style: "caption" },
        ] : [
          { type: "TextButton", key: "resendDemo", labelText: "Enviar código", labelTextEn: "Send the code", onPressed: "resend" },
        ],
      },
    ]),
    section("floating-action-button", "Botón flotante", "Floating action button", "FloatingActionButton · fab", [
      para("Kino lo dibuja sobre la esquina inferior de la pantalla, no aquí: uno por pantalla.", "Kino draws it over the screen's bottom corner, not here: one per screen."),
      { type: "FloatingActionButton", key: "galleryFab", icon: "add", labelText: "Nuevo", labelTextEn: "New", onPressed: { event: "pressed", arg: "fab" }, tooltip: "Agrega uno", tooltipEn: "Adds one" },
    ]),
    section("tooltip", "Pistas", "Tooltips", "tooltip", [
      caption("Mantén pulsado (o espera con el foco en la TV)", "Long-press (or wait with the TV's focus on it)"),
      { type: "IconButton", key: "tipShare", icon: "share", labelText: "Compartir", labelTextEn: "Share", tooltip: "Compartir la guía", tooltipEn: "Share the guide", onPressed: { event: "pressed", arg: "share" } },
    ]),
    section("chips", "Chips", "Chips", "Chips · chips (one or several)", [
      { type: "Chips", key: "genre", labelText: "Género", labelTextEn: "Genre", value: "all", onChanged: "chips", options: [{ value: "all", label: "Todo", labelEn: "All" }, { value: "movies", label: "Películas", labelEn: "Movies" }, { value: "series", label: "Series", labelEn: "Series" }] },
      { type: "Chips", key: "extras", multiple: true, value: ["hd"], onChanged: "chips", options: [{ value: "hd", label: "HD" }, { value: "sub", label: "Subtítulos", labelEn: "Subtitles" }, { value: "dub", label: "Doblada", labelEn: "Dubbed" }] },
    ]),
    section("toast", "Avisos", "Toasts", "answer.toast (text · role · action · ms)", [
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "Button", key: "toastPlain", variant: "secondary", labelText: "Aviso simple", labelTextEn: "Plain toast", onPressed: "toast", arg: "plain" },
          { type: "Button", key: "toastRole", variant: "secondary", labelText: "Aviso de éxito", labelTextEn: "Success toast", onPressed: "toast", arg: "success" },
          { type: "Button", key: "toastAction", variant: "secondary", labelText: "Aviso con acción", labelTextEn: "Toast with an action", onPressed: "toast", arg: "action" },
        ],
      },
    ]),
    section("ui-ops", "Operaciones locales", "Local ui operations", "show · hide · toggle · enable · disable · focus · set · clear · open · close", [
      { type: "Text", key: "target", ...t("Soy el objetivo de show, hide y toggle", "I am the target of show, hide and toggle"), color: "primary" },
      { type: "TextField", key: "opsField", labelText: "Campo objetivo", labelTextEn: "Target field", value: "Hola" },
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "Button", key: "opShow", variant: "text", labelText: "show", onPressed: { ui: [{ show: "target" }] } },
          { type: "Button", key: "opHide", variant: "text", labelText: "hide", onPressed: { ui: [{ hide: "target" }] } },
          { type: "Button", key: "opToggle", variant: "text", labelText: "toggle", onPressed: { ui: [{ toggle: "target" }] } },
          { type: "Button", key: "opDisable", variant: "text", labelText: "disable", onPressed: { ui: [{ disable: "opsField" }] } },
          { type: "Button", key: "opEnable", variant: "text", labelText: "enable", onPressed: { ui: [{ enable: "opsField" }] } },
          { type: "Button", key: "opFocus", variant: "text", labelText: "focus", onPressed: { ui: [{ focus: "opsField" }] } },
          { type: "Button", key: "opSet", variant: "text", labelText: "set", onPressed: { ui: [{ set: { key: "opsField", value: "Kino" } }] } },
          { type: "Button", key: "opClear", variant: "text", labelText: "clear", onPressed: { ui: [{ clear: "opsField" }] } },
          { type: "Button", key: "opOpen", variant: "text", labelText: "open", onPressed: { ui: [{ open: "declaredMenu" }] } },
        ],
      },
    ]),
  ];
}
