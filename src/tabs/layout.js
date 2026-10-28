import { ICONS, LIST_MAX, PICTURE } from "../constants.js";
import { caption, cell, para, section, t, titleOf } from "../helpers.js";

export function layoutTab(s) {
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
