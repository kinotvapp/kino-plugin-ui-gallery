import { GROUP_IDS, LIST_MAX } from "./constants.js";

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
