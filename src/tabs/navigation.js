import { DOCS, TMDB_ID } from "../constants.js";
import { para, section } from "../helpers.js";

export function navigationTab() {
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
