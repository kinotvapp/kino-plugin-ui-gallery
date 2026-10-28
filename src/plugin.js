// Screen gallery: every component of Kino's screen kit in one plugin screen, grouped like the User interface reference
// (docs/plugins/ui.md), with interactive demos (apiVersion 14).
//
// One tab per group (Layout, Content, Actions, Forms, Overlays, Navigation, Data). Each component sits in a section whose
// key is "sec-<anchor>", the same anchor its section has in ui.md, so screenshot-map.json can say where to find it and the
// tests can prove every documented component is on screen. No network: the two pictures are public https files Kino loads
// itself (an image needs no host declaration), and every `go` aims at a harmless target (the docs site, a public-domain
// film's TMDB page, this very screen).

export { screen } from "./view.js";
export { screenEvent } from "./events.js";
