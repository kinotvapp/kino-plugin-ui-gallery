import { GROUPS, PICTURE } from "./constants.js";
import { para, t, titleOf } from "./helpers.js";
import { initial, sanitize } from "./state.js";
import { actionsTab } from "./tabs/actions.js";
import { contentTab } from "./tabs/content.js";
import { dataTab } from "./tabs/data.js";
import { formsTab } from "./tabs/forms.js";
import { layoutTab } from "./tabs/layout.js";
import { navigationTab } from "./tabs/navigation.js";
import { overlaysTab } from "./tabs/overlays.js";

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
