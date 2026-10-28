// Screen gallery: every component of Kino's screen kit in one plugin screen, grouped like the User interface reference
// (docs/plugins/ui.md), with interactive demos (apiVersion 14).
//
// One tab per group (Layout, Content, Actions, Forms, Overlays, Navigation, Data). Each component sits in a section whose
// key is "sec-<anchor>", the same anchor its section has in ui.md, so screenshot-map.json can say where to find it and the
// tests can prove every documented component is on screen. No network: the two pictures are public https files Kino loads
// itself (an image needs no host declaration), and every `go` aims at a harmless target (the docs site, a public-domain
// film's TMDB page, this very screen).

/** The tabs, in order: the value, the Spanish label and the English one. */
export const GROUPS = [
  ["layout", "Diseño", "Layout"],
  ["content", "Contenido", "Content"],
  ["actions", "Acciones", "Actions"],
  ["forms", "Formularios", "Forms"],
  ["overlays", "Ventanas", "Overlays"],
  ["navigation", "Navegación", "Navigation"],
  ["data", "Datos", "Data"],
];
const GROUP_IDS = GROUPS.map(([v]) => v);

/** Kino's icon names (contract.json manifest.panel.icons): the first sixteen since apiVersion 9, the rest from 14. */
export const ICONS = [
  "info", "tune", "settings", "star", "bolt", "language", "subtitles", "list", "magic", "heart", "movie", "tv",
  "sports", "music", "bookmark", "help", "refresh", "sync", "add", "remove", "delete", "edit", "search", "close",
  "check", "share", "play", "pause", "download", "upload", "link", "open_in_new", "home", "person", "lock",
  "notifications", "warning", "error", "visibility", "copy", "arrow_back", "arrow_forward", "expand_more",
  "expand_less", "more_vert", "filter_list", "calendar", "schedule", "send", "mood",
];

/** A 16:9 still of Big Buck Bunny (Blender Foundation, CC BY 3.0) and a square icon, both public https files. */
export const PICTURE = "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg";
export const SQUARE = "https://raw.githubusercontent.com/kinotvapp/kino-plugin-archive/main/icon.png";
/** A public https address that does not exist: the image's fallback is drawn instead. */
export const MISSING = "https://kinotvapp.github.io/kino-plugins/missing-picture.png";
/** The docs site: the harmless target of go.url and of the QR code. */
export const DOCS = "https://kinotvapp.github.io/kino-plugins/";
/** Big Buck Bunny on TMDB: the harmless target of go.titleByIds. */
export const TMDB_ID = 10378;

/** The longest list the load-more demo grows to. */
export const LIST_MAX = 20;

const t = (es, en) => ({ text: es, textEn: en === undefined ? es : en });
const caption = (es, en) => ({ type: "Text", ...t(es, en), style: "caption", color: "muted" });
const para = (es, en) => ({ type: "Text", ...t(es, en) });

/**
 * One component's section: its name, the type names it is written with (Flutter-style first) and the demo. The key
 * "sec-<anchor>" is the section's anchor in ui.md.
 */
function section(anchor, es, en, names, children) {
  return {
    type: "Column", key: "sec-" + anchor, gap: 8, fill: true,
    children: [{ type: "Text", ...t(es, en), style: "h3" }, caption(names, names), ...children],
  };
}

/** A small framed box for layout demos, so the space it takes shows. */
const cell = (es, en, extra = {}) => ({ type: "Card", variant: "outlined", padding: 8, ...extra, children: [{ type: "Text", ...t(es, en), style: "label" }] });

/** Three items of Kino's own cards: each opens this screen again at the Content tab (`open.screen`), never a title. */
export function demoItems() {
  return ["one", "two", "three"].map((id, i) => ({
    id: "demo-" + id, ref: "demo-" + id, title: ["Big Buck Bunny", "Sintel", "Tears of Steel"][i], kind: "movie",
    year: [2008, 2010, 2012][i], poster: PICTURE, open: { screen: { route: "gallery", args: { tab: "content" } } },
  }));
}

// ---------- the state ----------

/** The state the gallery starts with: plain JSON, no nulls. */
export function initial() {
  return { tab: "layout", inner: "a", count: 0, ticks: 0, timer: false, last: "", listCount: 5, story: "", loading: false, codeError: false, resendAt: 0 };
}

/** The gallery's own keys read from whatever Kino kept (anything odd falls back to the initial value). */
export function sanitize(s) {
  const d = initial();
  if (!s || typeof s !== "object") return d;
  const int = (v, lo, hi, def) => (Number.isInteger(v) && v >= lo && v <= hi ? v : def);
  const str = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");
  return {
    tab: GROUP_IDS.includes(s.tab) ? s.tab : d.tab,
    inner: ["a", "b", "c"].includes(s.inner) ? s.inner : d.inner,
    count: int(s.count, -1000000, 1000000, 0),
    ticks: int(s.ticks, 0, 1000000000, 0),
    timer: s.timer === true,
    last: str(s.last, 200),
    listCount: int(s.listCount, 0, LIST_MAX, d.listCount),
    story: ["bunny", "sintel"].includes(s.story) ? s.story : "",
    loading: s.loading === true,
    // the forceErrorText demo's verdict and the enabledAt demo's time.
    codeError: s.codeError === true,
    resendAt: int(s.resendAt, 0, 253402300799999, 0),
  };
}

// ---------- the tabs ----------

function layoutTab(s) {
  return [
    section("column", "Columna", "Column", "Column · col", [
      { type: "Column", gap: 8, children: [cell("Primero", "First"), cell("Segundo", "Second"), cell("Tercero", "Third")] },
    ]),
    section("row", "Fila", "Row", "Row · row", [
      { type: "Row", gap: 8, mainAxisAlignment: "spaceBetween", children: [cell("Izquierda", "Start"), cell("Centro", "Middle"), cell("Derecha", "End")] },
      { type: "Row", gap: 8, children: [cell("flex 1", "flex 1", { flex: 1 }), cell("flex 2", "flex 2", { flex: 2 })] },
      caption("stackOnNarrow: en un teléfono las tres cajas se apilan", "stackOnNarrow: on a phone the three boxes stack"),
      { type: "Row", gap: 8, stackOnNarrow: true, children: [cell("Uno", "One", { flex: 1 }), cell("Dos", "Two", { flex: 1 }), cell("Tres", "Three", { flex: 1 })] },
    ]),
    section("wrap-row", "Fila de doce columnas", "Twelve-column row", "Row wrap: true · span · offset", [
      {
        type: "Row", key: "demoGrid", wrap: true, gap: 8,
        children: [1, 2, 3, 4, 5, 6].map((n) => ({
          type: "Card", key: "gridCard" + n, span: { compact: 12, medium: 6, expanded: 4 },
          children: [{ type: "Text", ...t("Tarjeta " + n, "Card " + n), style: "h5" }, caption("12 · 6 · 4 columnas", "12 · 6 · 4 columns")],
        })),
      },
      {
        type: "Row", wrap: true, gap: 8,
        children: [cell("span 4", "span 4", { span: 4 }), cell("span 4 offset 4", "span 4 offset 4", { span: 4, offset: 4 }), cell("auto", "auto", { span: "auto" }), cell("auto", "auto")],
      },
    ]),
    section("stack", "Pila", "Stack", "Stack · box", [
      { type: "Stack", children: [{ type: "Image", url: PICTURE, aspect: "banner", alt: "Big Buck Bunny" }, { type: "Badge", ...t("Encima", "On top"), margin: 8 }] },
    ]),
    section("positioned", "Hijos posicionados", "Positioned children", "Stack · positioned", [
      {
        type: "Stack", key: "posStack", height: 160, borderRadius: "medium",
        children: [
          { type: "Image", url: PICTURE, aspect: "banner", alt: "Big Buck Bunny", fill: true, height: 160 },
          { type: "Badge", ...t("EN VIVO", "LIVE"), color: "error", positioned: { top: 8, right: 8 } },
          { type: "Card", background: "surfaceVariant", positioned: { left: 12, right: 12, bottom: 12 }, children: [para("Abajo, de lado a lado", "At the bottom, side to side")] },
        ],
      },
    ]),
    section("spacer", "Espacio", "Spacer and SizedBox", "Spacer · SizedBox · spacer", [
      { type: "Row", children: [cell("A", "A"), { type: "SizedBox", width: 48 }, cell("B", "B"), { type: "Spacer", flex: 1 }, cell("C", "C")] },
    ]),
    section("divider", "Separador", "Divider", "Divider · divider", [para("Arriba", "Above"), { type: "Divider" }, para("Abajo", "Below")]),
    section("scroll", "Desplazamiento", "Scroll", "SingleChildScrollView · scroll", [
      {
        type: "SingleChildScrollView", direction: "horizontal",
        children: [{ type: "Row", gap: 8, children: ICONS.slice(0, 10).map((n) => ({ type: "Badge", ...t(n, n) })) }],
      },
    ]),
    section("grid-view", "Cuadrícula", "GridView", "GridView · grid", [
      { type: "GridView", columns: { compact: 2, medium: 3, expanded: 4 }, gap: 8, children: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => cell(String(n), String(n))) },
    ]),
    section("card", "Tarjeta", "Card", "Card · card (plain · outlined · filled · flush)", [
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "Card", span: { compact: 12, medium: 4 }, children: [para("plain", "plain")] },
          { type: "Card", variant: "outlined", span: { compact: 12, medium: 4 }, children: [para("outlined", "outlined")] },
          { type: "Card", variant: "filled", span: { compact: 12, medium: 4 }, children: [para("filled", "filled")] },
        ],
      },
      {
        type: "Card", key: "flushCard", flush: true, width: { medium: 320, expanded: 320 },
        children: [
          { type: "Image", url: PICTURE, aspect: "16:9", alt: "Big Buck Bunny" },
          { type: "Column", padding: 12, gap: 4, children: [{ type: "Text", ...t("Tarjeta flush", "Flush card"), style: "h4" }, caption("La imagen llega a los bordes", "The picture runs edge to edge")] },
        ],
      },
    ]),
    section("accordion", "Acordeón", "ExpansionTile", "ExpansionTile · accordion", [
      {
        type: "ExpansionTile", key: "faq",
        items: [
          { key: "what", ...titleOf("¿Qué es?", "What is it?"), open: true, children: [para("Secciones que se abren y se cierran.", "Sections that open and close.")] },
          { key: "who", ...titleOf("¿Quién lo dibuja?", "Who draws it?"), children: [para("Kino, sin llamar al plugin.", "Kino, without calling the plugin.")] },
          { key: "tv", ...titleOf("¿Y en la TV?", "And on the TV?"), children: [para("Cada encabezado toma el foco; OK lo abre.", "Each header takes focus; OK toggles it.")] },
        ],
      },
    ]),
    section("tab-bar", "Pestañas", "TabBar", "TabBar · tabs", [
      { type: "TabBar", key: "innerTabs", value: s.inner, onChanged: "inner", tabs: [{ value: "a", label: "Uno", labelEn: "One" }, { value: "b", label: "Dos", labelEn: "Two" }, { value: "c", label: "Tres", labelEn: "Three" }] },
      para("Pestaña elegida: " + s.inner, "Chosen tab: " + s.inner),
    ]),
    section("list-view", "Lista", "ListView", "ListView · list (onEndReached)", [
      {
        type: "ListView", key: "demoList", onEndReached: { event: "more" }, loadingMore: s.loading, done: s.listCount >= LIST_MAX,
        empty: { type: "emptyState", ...titleOf("Sin elementos", "No items") },
        items: Array.from({ length: s.listCount }, (_, i) => ({ type: "Row", key: "item" + i, gap: 8, padding: { y: 4 }, children: [{ type: "Icon", name: "list" }, para("Elemento " + (i + 1), "Item " + (i + 1))] })),
      },
    ]),
    section("list-tile", "Filas de lista", "ListTile", "ListTile · listTile", [
      {
        type: "Column", children: [
          { type: "ListTile", key: "tileAna", ...titleOf("Ana", "Ana"), subtitle: "En línea", subtitleEn: "Online", onTap: "pressed", arg: "ana", selected: s.inner === "a",
            leading: { type: "CircleAvatar", text: "AN" }, trailing: { type: "Badge", text: "2" } },
          { type: "ListTile", key: "tileLuis", ...titleOf("Luis", "Luis"), subtitle: "Hace un rato", subtitleEn: "A while ago", onTap: "pressed", arg: "luis", dense: true,
            leading: { type: "Icon", name: "person" }, trailing: { type: "Icon", name: "more_vert" } },
        ],
      },
    ]),
    section("page-view", "Páginas y carrusel", "PageView and carousel", "PageView · pageView (viewportFraction · autoPlayMs)", [
      {
        type: "PageView", key: "covers", viewportFraction: { compact: 0.85, expanded: 0.5 }, onPageChanged: "changed",
        children: ["Big Buck Bunny", "Sintel", "Tears of Steel"].map((name, i) => ({
          type: "Card", key: "page" + i, flush: true,
          children: [{ type: "Image", url: PICTURE, aspect: "16:9", alt: name }, { type: "Text", text: name, style: "h5", padding: 8 }],
        })),
      },
    ]),
    section("scaffold", "Pantalla con Scaffold", "A Scaffold screen", "Scaffold · AppBar · NavigationBar", [
      para("Abre la galería como un Scaffold: barra arriba (bajo la barra de Kino), cuerpo, botón flotante y barra abajo.",
        "Opens the gallery as a Scaffold: a bar on top (under Kino's own bar), a body, a floating button and a bottom bar."),
      { type: "ElevatedButton", key: "openScaffold", labelText: "Abrir el ejemplo", labelTextEn: "Open the example", onPressed: { event: "push", arg: "scaffold" } },
    ]),
  ];
}

const titleOf = (es, en) => ({ title: es, titleEn: en });

function contentTab() {
  const styles = ["h1", "h2", "h3", "h4", "h5", "p", "caption", "label"];
  const roles = ["primary", "secondary", "surface", "muted", "warning", "error"];
  return [
    section("text", "Texto", "Text", "Text · text (h1 to h5, p, caption, label)", [
      ...styles.map((st) => ({ type: "Text", text: "Texto " + st, textEn: "Text " + st, style: st })),
      { type: "Text", ...t("Un párrafo en negrita", "A bold paragraph"), bold: true },
      { type: "Text", ...t("Un texto largo que se corta en dos líneas con puntos suspensivos, porque maxLines es 2 y el texto sigue y sigue mucho más allá.", "A long text cut at two lines with an ellipsis, because maxLines is 2 and the text goes on and on well past it."), maxLines: 2 },
    ]),
    section("colors", "Colores", "Colour roles", "color: primary · secondary · surface · muted · warning · error", roles.map((r) => ({ type: "Text", text: r, textEn: r, color: r, bold: true }))),
    section("image", "Imagen", "Image", "Image · image (aspect · fallback)", [
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "Image", span: { compact: 12, medium: 6 }, url: PICTURE, aspect: "16:9", alt: "Big Buck Bunny" },
          { type: "Image", span: { compact: 6, medium: 3 }, url: SQUARE, aspect: "1:1", alt: "Archive", altEn: "Archive" },
          {
            type: "Image", key: "brokenImage", span: { compact: 6, medium: 3 }, url: MISSING, aspect: "1:1", alt: "Sin imagen", altEn: "No picture",
            fallback: { type: "Stack", color: "surface", children: [{ type: "Column", padding: 8, gap: 4, children: [{ type: "Icon", name: "movie" }, caption("fallback", "fallback")] }] },
          },
        ],
      },
    ]),
    section("icon", "Icono", "Icon", "Icon · icon", [
      {
        type: "Row", gap: 16, crossAxisAlignment: "center",
        children: [
          { type: "Icon", name: "star", color: "primary" }, { type: "Icon", name: "heart", color: "error" }, { type: "Icon", name: "warning", color: "warning" },
          { type: "Icon", name: "check", color: "secondary" }, { type: "Icon", name: "movie" },
          { type: "ElevatedButton", key: "iconRefresh", icon: "refresh", labelText: "Actualizar ahora", labelTextEn: "Refresh now", onPressed: "pressed", arg: "refresh" },
        ],
      },
    ]),
    section("icon-names", "Todos los iconos", "Every icon", "Icon.name · " + ICONS.length + " names", [
      {
        type: "Row", key: "iconGrid", wrap: true, gap: 8,
        children: ICONS.map((n) => ({ type: "Column", span: { compact: 3, medium: 2, expanded: 2 }, crossAxisAlignment: "center", gap: 4, children: [{ type: "Icon", name: n }, caption(n, n)] })),
      },
    ]),
    section("badge", "Insignia", "Badge", "Badge · badge", [
      { type: "Row", gap: 8, children: [{ type: "Badge", ...t("Nuevo", "New") }, { type: "Badge", text: "4K", textEn: "4K" }, { type: "Badge", text: "HDR", textEn: "HDR", color: "warning" }] },
    ]),
    section("circle-avatar", "Avatares", "CircleAvatar", "CircleAvatar · avatar", [
      {
        type: "Row", gap: 12, crossAxisAlignment: "center", children: [
          { type: "CircleAvatar", image: SQUARE, text: "KI", labelText: "Kino" },
          { type: "CircleAvatar", image: MISSING, text: "BB", radius: 28, backgroundColor: "secondary", labelText: "Big Buck Bunny" },
          { type: "CircleAvatar", icon: "person", radius: 16 },
        ],
      },
    ]),
    section("banner", "Banner", "MaterialBanner", "MaterialBanner · banner (info · warning · error · success)", [
      { type: "MaterialBanner", role: "info", ...t("Hay una versión nueva de la guía.", "There is a new version of the guide.") },
      { type: "MaterialBanner", key: "warnBanner", role: "warning", ...titleOf("Atención", "Heads up"), ...t("Puedes cerrar este aviso.", "You can dismiss this notice."), dismissible: true },
      { type: "MaterialBanner", role: "error", ...t("No se pudo cargar.", "Could not load."), action: { label: "Reintentar", labelEn: "Retry", onTap: "retry" } },
      { type: "MaterialBanner", role: "success", ...t("Guardado.", "Saved.") },
    ]),
    section("skeleton", "Esqueleto", "Skeleton", "Skeleton · skeleton (line · block · circle · card)", [
      {
        type: "Row", wrap: true, gap: 12,
        children: [
          { type: "Skeleton", shape: "line", lines: 3, span: { compact: 12, medium: 6 } },
          { type: "Skeleton", shape: "block", height: 64, span: { compact: 12, medium: 6 } },
          { type: "Skeleton", shape: "circle", width: 48, height: 48 },
          { type: "Skeleton", shape: "card", width: 120 },
        ],
      },
    ]),
    section("qr", "Código QR", "QrImage", "QrImage · qr", [{ type: "QrImage", value: DOCS, size: "medium", labelText: "Guía de plugins", labelTextEn: "Plugin guide" }]),
    section("table", "Tabla", "DataTable", "DataTable · table · TableRow · TableCell", [
      {
        type: "DataTable", header: true, zebra: true, columns: [{ flex: 2 }, { flex: 1 }, { flex: 1 }],
        children: [
          { type: "TableRow", children: [{ type: "TableCell", ...t("Componente", "Component") }, { type: "TableCell", ...t("Teléfono", "Phone") }, { type: "TableCell", text: "TV", textEn: "TV" }] },
          { type: "TableRow", children: [{ type: "TableCell", text: "TextField" }, { type: "TableCell", ...t("teclado", "keyboard") }, { type: "TableCell", ...t("diálogo", "dialog") }] },
          { type: "TableRow", children: [{ type: "TableCell", text: "NumberStepper" }, { type: "TableCell", text: "− 1 +" }, { type: "TableCell", text: "← →" }] },
          { type: "TableRow", key: "spanRow", children: [{ type: "TableCell", ...t("Una celda que ocupa tres columnas", "One cell across three columns"), colSpan: 3, crossAxisAlignment: "center" }] },
        ],
      },
    ]),
    section("progress", "Progreso", "Progress", "LinearProgressIndicator · CircularProgressIndicator", [
      { type: "LinearProgressIndicator", value: 0.6, labelText: "60 %", labelTextEn: "60 %" },
      { type: "LinearProgressIndicator" },
      { type: "CircularProgressIndicator", ...t("Cargando", "Loading") },
    ]),
    section("empty-state", "Estados vacío y de error", "Empty and error states", "emptyState · errorState", [
      { type: "emptyState", ...titleOf("Nada por aquí", "Nothing here"), ...t("Agrega algo para verlo.", "Add something to see it."), icon: "bookmark" },
      { type: "errorState", ...titleOf("Algo falló", "Something failed"), ...t("Inténtalo de nuevo más tarde.", "Try again later."), icon: "help" },
    ]),
    section("title-card", "Tarjetas de Kino", "Kino's own cards", "titleCard · titleRail · titleGrid · heroCard", [
      { type: "titleCard", item: demoItems()[0], size: "medium", onTap: "demoTitle" },
      { type: "titleRail", ...titleOf("Una fila de Inicio", "A Home row"), items: demoItems(), size: "small" },
      { type: "titleGrid", items: demoItems(), columns: { compact: 3, expanded: 6 } },
      {
        type: "heroCard", ...titleOf("Una portada", "A hero"), ...t("El banner de una sección, con hasta dos botones.", "A section's banner, with up to two buttons."), image: PICTURE,
        buttons: [{ type: "ElevatedButton", labelText: "Ver", labelTextEn: "Watch", onPressed: "demoTitle" }, { type: "TextButton", labelText: "Más", labelTextEn: "More", onPressed: "demoTitle" }],
      },
    ]),
  ];
}

function actionsTab(s = initial()) {
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

function formsTab(s = initial()) {
  const options = [{ value: "es", label: "Español", labelEn: "Spanish" }, { value: "en", label: "Inglés", labelEn: "English" }, { value: "pt", label: "Portugués", labelEn: "Portuguese" }];
  return [
    section("form", "Formulario con validación", "Form with validation", "Form · form · submit: true", [
      {
        type: "Form", key: "signup", onSubmitted: "submit", gap: 12,
        children: [
          { type: "TextField", key: "name", labelText: "Nombre", labelTextEn: "Name", required: true, minLength: 2, maxLength: 40, errorText: "Escribe al menos 2 letras", errorTextEn: "Type at least 2 letters" },
          { type: "TextField", key: "email", kind: "email", labelText: "Correo", labelTextEn: "Email", hintText: "ana@ejemplo.com", hintTextEn: "ana@example.com", required: true, pattern: "^[^@\\s]+@[^@\\s]+\\.[A-Za-z]{2,}$", errorText: "Revisa el correo", errorTextEn: "Check the email" },
          { type: "TextField", key: "about", labelText: "Sobre ti", labelTextEn: "About you", multiline: true, maxLength: 300 },
          { type: "DropdownButton", key: "language", labelText: "Idioma", labelTextEn: "Language", options, required: true, errorText: "Elige un idioma", errorTextEn: "Pick a language" },
          { type: "RadioGroup", key: "plan", labelText: "Plan", labelTextEn: "Plan", value: "free", options: [{ value: "free", label: "Gratis", labelEn: "Free" }, { value: "family", label: "Familiar", labelEn: "Family" }] },
          { type: "Chips", key: "topics", labelText: "Temas (1 a 2)", labelTextEn: "Topics (1 to 2)", multiple: true, required: true, minLength: 1, maxLength: 2, options: [{ value: "drama", label: "Drama" }, { value: "comedy", label: "Comedia", labelEn: "Comedy" }, { value: "docs", label: "Documentales", labelEn: "Documentaries" }] },
          { type: "NumberStepper", key: "seats", labelText: "Asientos", labelTextEn: "Seats", value: 2, min: 1, max: 8, editable: true },
          { type: "NumberStepper", key: "price", labelText: "Precio", labelTextEn: "Price", value: 2.5, min: 0, max: 10, step: 0.25, decimals: 2 },
          { type: "Slider", key: "volume", labelText: "Volumen", labelTextEn: "Volume", min: 0, max: 10, step: 1, value: 5 },
          { type: "Switch", key: "news", labelText: "Recibir novedades", labelTextEn: "Get news" },
          { type: "Checkbox", key: "terms", labelText: "Acepto las condiciones", labelTextEn: "I accept the terms", required: true, errorText: "Hace falta aceptarlas", errorTextEn: "You need to accept them" },
          { type: "ElevatedButton", key: "submitSignup", labelText: "Enviar", labelTextEn: "Send", submit: true },
        ],
      },
    ]),
    section("validation", "Tu propio veredicto", "Your own verdict", "forceErrorText", [
      caption("Escribe 1234 y comprueba: otro código muestra tu error bajo el campo hasta que lo edites.", "Type 1234 and check: another code shows your error under the field until you edit it."),
      { type: "TextField", key: "codeDemo", kind: "number", labelText: "Código", labelTextEn: "Code", maxLength: 8,
        ...(s.codeError ? { forceErrorText: "Ese código no es válido", forceErrorTextEn: "That code is not valid" } : {}) },
      { type: "Button", key: "checkCode", variant: "secondary", labelText: "Comprobar", labelTextEn: "Check", onPressed: "checkCode" },
    ]),
    section("inputs", "Campos sueltos", "Inputs on their own", "TextField · Switch · Slider (onChanged, outside a form)", [
      { type: "TextField", key: "search", kind: "search", labelText: "Buscar", labelTextEn: "Search", hintText: "Escribe y pulsa Enter", hintTextEn: "Type and press Enter", onSubmitted: "searched",
        trailingIcon: "search", trailingLabel: "Buscar ahora", trailingLabelEn: "Search now", onTrailingTap: "searched" },
      { type: "Switch", key: "darkDemo", labelText: "Un interruptor", labelTextEn: "A switch", onChanged: "changed" },
      { type: "Slider", key: "level", labelText: "Nivel", labelTextEn: "Level", min: 0, max: 100, step: 10, value: 30, onChanged: "changed" },
    ]),
    section("settings", "Ajustes del plugin", "The plugin's settings", "settings · bind · config", [
      caption("El nodo settings dibuja el formulario de Ajustes de Kino:", "The settings node draws Kino's own settings form:"),
      { type: "settings", keys: ["density"] },
      caption("Con autoSave el interruptor se guarda solo, sin Guardar:", "With autoSave the switch saves by itself, no Save button:"),
      { type: "settings", keys: ["tips"], autoSave: true },
      caption("Campos con bind: guardan el ajuste solos.", "Fields with bind: they store the setting by themselves."),
      { type: "TextField", key: "boundGreeting", bind: "greeting", labelText: "Saludo (bind)", labelTextEn: "Greeting (bind)" },
      { type: "Switch", key: "boundTips", bind: "tips", labelText: "Mostrar consejos (bind)", labelTextEn: "Show tips (bind)" },
      { type: "Button", key: "writeConfig", variant: "secondary", labelText: "Escribir «Hola» con config", labelTextEn: "Write \"Hello\" with config", onPressed: "writeConfig" },
    ]),
  ];
}

function overlaysTab() {
  return [
    section("dialog", "Diálogo", "Dialog", "answer.dialog · AlertDialog", [
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "Button", key: "answerDialog", variant: "secondary", labelText: "Diálogo de una respuesta", labelTextEn: "A dialog from an answer", onPressed: "dialog" },
          { type: "Button", key: "openDeclaredDialog", variant: "secondary", labelText: "Abrir un AlertDialog", labelTextEn: "Open an AlertDialog", onPressed: { event: "story", arg: "bunny" } },
        ],
      },
    ]),
    section("sheet", "Hoja", "Sheet", "answer.sheet · BottomSheet", [
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "Button", key: "answerSheet", variant: "secondary", labelText: "Hoja de una respuesta", labelTextEn: "A sheet from an answer", onPressed: "sheet" },
          { type: "Button", key: "openDeclaredSheet", variant: "secondary", labelText: "Abrir un BottomSheet con formulario", labelTextEn: "Open a BottomSheet with a form", onPressed: { ui: [{ open: "declaredSheet" }] } },
        ],
      },
    ]),
    section("menu", "Menú", "Menu", "answer.menu · PopupMenuButton", [
      {
        type: "Row", wrap: true, gap: 8,
        children: [
          { type: "Button", key: "answerMenu", variant: "secondary", labelText: "Menú de una respuesta", labelTextEn: "A menu from an answer", onPressed: "menu" },
          { type: "Button", key: "openDeclaredMenu", variant: "secondary", labelText: "Abrir un PopupMenuButton", labelTextEn: "Open a PopupMenuButton", onPressed: { ui: [{ open: "declaredMenu" }] } },
        ],
      },
    ]),
    section("popup", "Ventanas declaradas y onClose", "Declared pop-ups and onClose", "popup kind · ui open / close · onClose", [
      para("Cierra el AlertDialog con Atrás o con la X de Kino: su onClose manda un evento y aparece un aviso.", "Close the AlertDialog with Back or Kino's close: its onClose sends an event and a toast shows."),
    ]),
  ];
}

function navigationTab() {
  return [
    section("go-url", "Abrir un enlace", "Open a link", "go: { url }", [
      { type: "ElevatedButton", key: "goUrl", icon: "language", labelText: "Abrir la guía de plugins", labelTextEn: "Open the plugin guide", onPressed: { go: { url: { href: DOCS, title: "Guía de plugins de Kino" } } } },
    ]),
    section("go-title-by-ids", "Título por identificadores", "Title by ids", "go: { titleByIds }", [
      { type: "ElevatedButton", key: "goTitleByIds", icon: "movie", labelText: "Big Buck Bunny en Kino", labelTextEn: "Big Buck Bunny in Kino", onPressed: { go: { titleByIds: { tmdb: TMDB_ID, kind: "movie", title: "Big Buck Bunny", year: 2008 } } } },
    ]),
    section("go-screen", "Esta pantalla en otra ruta", "This screen at a route", "go: { screen: { route, args } }", [
      { type: "Button", key: "goScreen", variant: "secondary", labelText: "Abrir en la pestaña Datos", labelTextEn: "Open at the Data tab", onPressed: { go: { screen: { route: "gallery", args: { tab: "data" } } } } },
    ]),
    section("route", "Una ruta propia", "A route of your own", "answer.route: { push } · { pop: true }", [
      { type: "Button", key: "pushRoute", variant: "secondary", labelText: "Ir al detalle", labelTextEn: "Go to the detail", onPressed: "push" },
    ]),
    section("go-close", "Cerrar la pantalla", "Close the screen", "go: { close: true }", [
      { type: "TextButton", key: "goClose", labelText: "Cerrar la galería", labelTextEn: "Close the gallery", confirm: "¿Cerrar la galería?", confirmEn: "Close the gallery?", onPressed: { go: { close: true } } },
    ]),
    section("navigation", "Hacia el catálogo del plugin", "Into the plugin's catalog", "go: title · play · search · browse · section · categories", [
      para("Estos destinos abren el contenido de un plugin con catálogo (home, search, browse, section). Esta galería no tiene catálogo, así que no los ofrece; la referencia muestra cada forma.", "These open the content of a plugin with a catalog (home, search, browse, section). This gallery has none, so it does not offer them; the reference shows each shape."),
    ]),
  ];
}

function dataTab(s) {
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

const TABS = { layout: layoutTab, content: contentTab, actions: actionsTab, forms: formsTab, overlays: overlaysTab, navigation: navigationTab, data: dataTab };

/** The section keys ("sec-<anchor>") each tab draws, in order. */
export function sectionsOf(tab) {
  return (TABS[tab] || TABS.layout)(initial()).map((n) => n.key.slice(4));
}

/** The pop-ups declared in the tree: hidden until a ui `open` names them. */
function popups(s) {
  const story = s.story === "sintel"
    ? t("Sintel busca a su dragón por un mundo frío.", "Sintel looks for her dragon across a cold world.")
    : t("Un conejo grande y tranquilo, hasta que lo molestan.", "A big, calm rabbit, until someone bothers him.");
  return [
    {
      type: "AlertDialog", key: "declaredDialog", ...titleOf("Una historia", "A story"), onClose: "dialogClosed",
      children: [{ type: "Image", url: PICTURE, aspect: "16:9", alt: "Big Buck Bunny" }, { type: "Text", ...story }],
      buttons: [{ label: "Otra", labelEn: "Another", event: "story", arg: s.story === "sintel" ? "bunny" : "sintel" }, { label: "Cerrar", labelEn: "Close" }],
    },
    {
      type: "BottomSheet", key: "declaredSheet", ...titleOf("Agregar un término", "Add a term"),
      children: [{
        type: "Form", key: "termForm", onSubmitted: "term", gap: 8,
        children: [
          { type: "TextField", key: "term", labelText: "Término", labelTextEn: "Term", required: true, maxLength: 40, pattern: "^[A-Za-z0-9 ]+$", errorText: "Solo letras, números y espacios", errorTextEn: "Only letters, digits and spaces" },
          { type: "ElevatedButton", key: "saveTerm", labelText: "Guardar", labelTextEn: "Save", submit: true },
        ],
      }],
    },
    {
      type: "PopupMenuButton", key: "declaredMenu", ...titleOf("Ordenar por", "Sort by"),
      items: [
        { label: "Más reciente", labelEn: "Newest", icon: "star", onTap: { event: "sort", arg: "new" } },
        { label: "Título", labelEn: "Title", icon: "list", onTap: { event: "sort", arg: "title" } },
        { label: "Favoritos", labelEn: "Favourites", icon: "heart", onTap: { event: "sort", arg: "fav" } },
      ],
    },
  ];
}

/** the gallery as a Scaffold (its own route): app bar with tabs, a lazy body, a floating button, a bottom bar. */
export function scaffoldView(s) {
  const pane = ["a", "b", "c"].includes(s.inner) ? s.inner : "a";
  return {
    type: "Scaffold", key: "scaffoldDemo",
    appBar: {
      type: "AppBar", key: "demoBar", ...titleOf("Galería", "Gallery"), elevation: 2,
      leading: { type: "IconButton", key: "barBack", icon: "arrow_back", labelText: "Atrás", labelTextEn: "Back", onPressed: "pop" },
      actions: [{ type: "IconButton", key: "barShare", icon: "share", labelText: "Compartir", labelTextEn: "Share", onPressed: { event: "pressed", arg: "share" }, badge: "dot" }],
      bottom: { type: "TabBar", key: "barTabs", value: pane, onChanged: "inner", tabs: [{ value: "a", label: "Uno", labelEn: "One" }, { value: "b", label: "Dos", labelEn: "Two" }, { value: "c", label: "Tres", labelEn: "Three" }] },
    },
    body: {
      type: "ListView", key: "scaffoldRows",
      items: Array.from({ length: 12 }, (_, i) => ({ type: "ListTile", key: "row" + i, title: "Fila " + (i + 1) + " · " + pane, titleEn: "Row " + (i + 1) + " · " + pane, onTap: "pressed", arg: "row" + i })),
    },
    floatingActionButton: { type: "FloatingActionButton", key: "scaffoldFab", icon: "add", labelText: "Nuevo", labelTextEn: "New", onPressed: { event: "pressed", arg: "fab" } },
    bottomNavigationBar: {
      type: "NavigationBar", key: "scaffoldNav", value: pane, onChanged: "inner",
      items: [{ key: "a", icon: "home", label: "Uno", labelEn: "One" }, { key: "b", icon: "list", label: "Dos", labelEn: "Two", badge: { text: "3" } }, { key: "c", icon: "person", label: "Tres", labelEn: "Three" }],
    },
  };
}

/** The tree for [state] at [route]: a pure function of them. */
export function view(state, route) {
  const s = sanitize(state);
  if (route && route.name === "scaffold") return scaffoldView(s);
  if (route && route.name === "detail") {
    return {
      type: "Column", padding: { compact: 16, expanded: 32 }, gap: 16,
      children: [
        { type: "Text", ...t("Una ruta propia", "A route of your own"), style: "h2" },
        para("Atrás vuelve a la galería antes de cerrar la pantalla.", "Back returns to the gallery before it closes the screen."),
        { type: "ElevatedButton", key: "popRoute", labelText: "Volver", labelTextEn: "Back", onPressed: "pop" },
      ],
    };
  }
  const root = {
    type: "Column", key: "gallery", fill: true,
    children: [
      { type: "TabBar", key: "group", value: s.tab, onChanged: "tab", tabs: GROUPS.map(([value, label, labelEn]) => ({ value, label, labelEn })) },
      {
        type: "SingleChildScrollView", key: "body", flex: 1,
        children: [{ type: "Column", key: "page", padding: { compact: 16, medium: 24, expanded: 32 }, gap: { compact: 24, expanded: 32 }, children: TABS[s.tab](s) }],
      },
      ...popups(s),
    ],
  };
  if (s.timer) root.every = { ms: 2000, event: "tick" };
  return root;
}

// ---------- the exports ----------

export async function screen({ state, route }) {
  return view(state, route);
}

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
