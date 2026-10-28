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

export const GROUP_IDS = GROUPS.map(([v]) => v);

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
