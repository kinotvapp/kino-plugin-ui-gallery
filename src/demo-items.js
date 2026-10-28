import { PICTURE } from "./constants.js";

/** Three items of Kino's own cards: each opens this screen again at the Content tab (`open.screen`), never a title. */
export function demoItems() {
  return ["one", "two", "three"].map((id, i) => ({
    id: "demo-" + id, ref: "demo-" + id, title: ["Big Buck Bunny", "Sintel", "Tears of Steel"][i], kind: "movie",
    year: [2008, 2010, 2012][i], poster: PICTURE, open: { screen: { route: "gallery", args: { tab: "content" } } },
  }));
}

// ---------- the state ----------
