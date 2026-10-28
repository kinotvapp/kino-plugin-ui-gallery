import { para, section } from "../helpers.js";

export function overlaysTab() {
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
