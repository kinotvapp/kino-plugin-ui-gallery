// The gallery run with Kino's Node kit (sdk/): the same sandbox as the app, its trees and answers read by the kit's screen
// validator (the app's rules). No network, no clock.
//
// The plugin Kino reads is the bundled plugin.js; src/ is how it is written. The first test proves the two agree: a fresh
// build of src/ is byte for byte the committed plugin.js (so what you read in src/ is what ships and what is signed).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { createKino } from "../sdk/kino-shim.mjs";
import { loadPlugin } from "../sdk/sandbox.mjs";
import { validate } from "../sdk/validate.mjs";
import { contract, requiredExports, validateManifest } from "../sdk/contract.mjs";
import { checkScreenAnswer, checkScreenTree, childNodes, countNodes, fakeScreenContext, resolveResponsive } from "../sdk/screen.mjs";
import { GROUPS, ICONS } from "../src/constants.js";
import { sectionsOf } from "../src/view.js";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_TEXT = readFileSync(join(DIR, "kino-plugin.json"), "utf8");
const MANIFEST = JSON.parse(MANIFEST_TEXT);
const S = contract.manifest.screen;
const OPTS = { allowSeries: false, settings: MANIFEST.settings };
const quiet = { log() {}, info() {}, warn() {}, error() {} };
const plain = (v) => JSON.parse(JSON.stringify(v));
const TABS = GROUPS.map(([v]) => v);

const { kino } = createKino(MANIFEST, { lang: "es-CO" });
const { plugin: P } = await loadPlugin(join(DIR, "plugin.js"), kino, { console: quiet });

const all = (n) => [n, ...childNodes(n).flatMap(all)];
/** Every node of a resolved tree, a declared pop-up's body and an image's fallback included. */
const everything = (n) => {
  const out = [];
  const walk = (x) => {
    if (!x || typeof x !== "object") return;
    if (typeof x.type === "string") out.push(x);
    for (const v of Object.values(x)) if (v && typeof v === "object") walk(v);
  };
  walk(n);
  return out;
};

async function tree(state, over = {}) {
  const ctx = fakeScreenContext({ ...over, state: { ...fakeScreenContext().state, ...state } });
  const raw = await P.screen(ctx);
  const r = checkScreenTree(raw, ctx.lang, undefined, OPTS);
  assert.deepEqual(r.dropped, [], `nothing dropped (${JSON.stringify(state)} ${JSON.stringify(over)})`);
  assert.ok(r.tree, "a valid root");
  return { tree: r.tree, raw, every: r.every };
}

async function answer(name, { arg, value, state = {}, route, lang = "es", timer = false, dismiss = false } = {}) {
  const raw = await P.screenEvent({ name, arg, value, state: { ...fakeScreenContext().state, ...state }, route: route || { name: "main", params: {} }, device: "phone", lang });
  const r = checkScreenAnswer(raw, lang, { ...OPTS, timer, dismiss });
  assert.deepEqual(r.dropped, [], `nothing dropped from the answer to ${name}`);
  return { raw, answer: r.answer };
}

test("plugin.js is exactly what building src/ produces (run `npm run build` after editing src/)", async () => {
  const out = await build({ entryPoints: [join(DIR, "src", "plugin.js")], bundle: true, format: "esm", target: "es2020", write: false, outfile: join(DIR, "plugin.js") });
  const fresh = out.outputFiles[0].text.replace(/\r\n/g, "\n");
  const shipped = readFileSync(join(DIR, "plugin.js"), "utf8").replace(/\r\n/g, "\n");
  assert.equal(shipped, fresh);
});

test("manifest: a screen plugin, apiVersion 14, not listed in Kino's search, signed, and the kit accepts it", async () => {
  const m = validateManifest(MANIFEST_TEXT);
  assert.equal(m.ok, true, m.message);
  assert.equal(MANIFEST.apiVersion, 14);
  assert.equal(MANIFEST.discoverable, false);
  assert.deepEqual(MANIFEST.capabilities, ["screen"]);
  assert.ok(MANIFEST.signature, "signed (npm run sign)");
  assert.deepEqual(requiredExports(m.manifest.capabilities, m.manifest.settings, m.manifest), ["screen", "screenEvent"]);
  const v = await validate(DIR, { repo: "kinotvapp/kino-plugin-ui-gallery" });
  assert.equal(v.ok, true, JSON.stringify(v));
});

test("every tab is valid with nothing dropped: both languages, phone and TV, every size class, timer on and off", async () => {
  for (const tab of TABS) {
    for (const lang of ["es", "en"]) {
      for (const device of ["phone", "tv"]) {
        for (const timer of [false, true]) {
          const { tree: t, every } = await tree({ tab, timer }, { lang, device });
          assert.ok(countNodes(t) <= S.limits.maxNodes, `${tab}: ${countNodes(t)} nodes`);
          assert.deepEqual(every, timer ? [{ ms: 2000, event: "tick" }] : [], tab);
          for (const w of S.sizeClasses) assert.ok(resolveResponsive(t, device, w), `${tab} ${w}`);
        }
      }
    }
  }
  const { tree: detail } = await tree({}, { route: { name: "detail", params: { from: "gallery" } } });
  assert.ok(all(detail).some((n) => n.key === "popRoute"));
});

test("every widget of the contract, and the table's rows and cells, is drawn somewhere in the gallery", async () => {
  const types = new Set();
  for (const tab of TABS) {
    const { tree: t, raw } = await tree({ tab });
    for (const n of everything(t)) types.add(n.type);
    // A table's rows and cells are read into the table itself: count them by the names the plugin wrote.
    for (const n of everything(plain(raw))) types.add(S.aliases.types[n.type] ?? n.type);
  }
  // The Scaffold, its AppBar and NavigationBar are a route's root (a Scaffold is only ever a root).
  const { tree: sc } = await tree({}, { route: { name: "scaffold", params: { from: "gallery" } } });
  for (const n of everything(sc)) types.add(n.type);
  const missing = [...S.widgets, ...S.tableParts].filter((w) => !types.has(w));
  assert.deepEqual(missing, []);
});

test("the icon grid draws every icon of the contract, each with its name", async () => {
  assert.deepEqual(plain(ICONS), contract.manifest.panel.icons);
  const { tree: t } = await tree({ tab: "content" });
  const grid = all(t).find((n) => n.key === "iconGrid");
  assert.ok(grid, "the icon grid is drawn");
  const drawn = all(grid).filter((n) => n.type === "icon").map((n) => n.name);
  assert.deepEqual(drawn, contract.manifest.panel.icons);
});

test("every tab has sections, and each one is drawn under its tab", async () => {
  for (const tab of TABS) {
    const secs = plain(sectionsOf(tab));
    assert.ok(secs.length > 0, tab);
    const { tree: t } = await tree({ tab });
    for (const s of secs) assert.ok(all(t).some((n) => n.key === "sec-" + s), `sec-${s} drawn in ${tab}`);
  }
});

test("every event a screen can send is answered with nothing dropped, in both languages", async () => {
  const names = new Set();
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === "object") {
      for (const [k, v] of Object.entries(n)) {
        if (/^on[A-Z]/.test(k) || k === "event") {
          if (typeof v === "string") names.add(v);
          else if (v && typeof v.event === "string") names.add(v.event);
        }
        walk(v);
      }
    }
  };
  for (const tab of TABS) walk((await tree({ tab })).raw);
  assert.ok(names.size >= 20, `found ${names.size} event names`);
  for (const name of names) for (const lang of ["es", "en"]) await answer(name, { lang });
});
