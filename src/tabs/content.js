import { DOCS, ICONS, MISSING, PICTURE, SQUARE } from "../constants.js";
import { demoItems } from "../demo-items.js";
import { caption, section, t, titleOf } from "../helpers.js";

export function contentTab() {
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
