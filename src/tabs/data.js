import { caption, para, section, t } from "../helpers.js";

export function dataTab(s) {
  return [
    section("state", "Estado", "State", "answer.state (a patch) · screen() runs again", [
      { type: "Row", gap: 8, crossAxisAlignment: "center", children: [
        { type: "IconButton", key: "minus", icon: "tune", labelText: "Restar", labelTextEn: "Minus", onPressed: "count", arg: "-1" },
        { type: "Text", key: "countText", text: String(s.count), textEn: String(s.count), style: "h2" },
        { type: "ElevatedButton", key: "plus", labelText: "+1", onPressed: "count", arg: "1" },
      ] },
    ]),
    section("events", "Eventos", "Events", "screenEvent { name, arg, value }", [
      { type: "Text", key: "lastEvent", ...t(s.last === "" ? "Todavía no hay eventos" : s.last, s.last === "" ? "No events yet" : s.last), style: "p" },
    ]),
    section("every", "Temporizador", "Timer", "every: { ms, event }", [
      { type: "Switch", key: "timerSwitch", labelText: "Contar cada 2 segundos", labelTextEn: "Count every 2 seconds", value: s.timer, onChanged: "timer" },
      { type: "Text", key: "tickText", ...t("Ticks: " + s.ticks, "Ticks: " + s.ticks), style: "h4" },
    ]),
    section("responsive", "Valores por tamaño", "Per-size values", "{ compact, medium, expanded } · sizes · devices", [
      { type: "Card", variant: "filled", padding: { compact: 8, medium: 16, expanded: 32 }, children: [para("padding 8 · 16 · 32", "padding 8 · 16 · 32")] },
      { type: "Badge", text: "compact", sizes: ["compact"] },
      { type: "Badge", text: "medium", sizes: ["medium"] },
      { type: "Badge", text: "expanded", sizes: ["expanded"] },
      { type: "Text", ...t("Solo en el teléfono", "Phone only"), devices: ["phone"], color: "primary" },
      { type: "Text", ...t("Solo en la TV", "TV only"), devices: ["tv"], color: "primary" },
      { type: "Text", ...t("Solo en el escritorio", "Desktop only"), devices: ["desktop"], color: "primary" },
    ]),
    section("box-props", "Cajas y textos", "Boxes and texts", "alignSelf · textAlign · border · elevation · background · minWidth · maxWidth · maxHeight", [
      {
        type: "Column", crossAxisAlignment: "start", gap: 8, children: [
          { type: "Card", key: "boxed", border: { width: 2, color: "primary" }, elevation: 3, maxWidth: 320, alignSelf: "center",
            children: [{ type: "Text", ...t("Centrada, con borde y sombra", "Centred, with a border and a shadow"), textAlign: "center", fill: true }] },
          { type: "Stack", background: "primaryContainer", padding: 12, minWidth: 200, children: [para("Fondo de contenedor", "Container fill")] },
        ],
      },
    ]),
    section("animate", "Animaciones", "Animations", "animate · opacity · visible", [
      { type: "ElevatedButton", key: "glideToggle", labelText: "Mostrar u ocultar", labelTextEn: "Show or hide", onPressed: { ui: [{ toggle: "glideCard" }] } },
      { type: "Card", key: "glideCard", animate: { duration: 300, curve: "decelerate" }, background: "surfaceVariant", children: [para("Entra y sale deslizándose", "Glides in and out")] },
      { type: "Text", ...t("Medio transparente", "Half transparent"), opacity: 0.5 },
    ]),
    section("style", "Estilo", "Style tokens", "padding · margin · gap · borderRadius · width · height", [
      {
        type: "Row", wrap: true, gap: 8,
        children: ["none", "small", "medium", "large", "full"].map((r) => ({ type: "Card", variant: "filled", borderRadius: r, width: 96, height: 48, padding: 8, children: [caption(r, r)] })),
      },
      { type: "Row", gap: 8, crossAxisAlignment: "end", children: [16, 24, 32, 48, 64].map((h) => ({ type: "Card", variant: "outlined", width: 40, height: h, padding: 0, children: [] })) },
    ]),
  ];
}
