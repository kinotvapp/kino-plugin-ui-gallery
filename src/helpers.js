export const t = (es, en) => ({ text: es, textEn: en === undefined ? es : en });

export const caption = (es, en) => ({ type: "Text", ...t(es, en), style: "caption", color: "muted" });

export const para = (es, en) => ({ type: "Text", ...t(es, en) });

/**
 * One component's section: its name, the type names it is written with (Flutter-style first) and the demo. The key
 * "sec-<anchor>" is the section's anchor in ui.md.
 */
export function section(anchor, es, en, names, children) {
  return {
    type: "Column", key: "sec-" + anchor, gap: 8, fill: true,
    children: [{ type: "Text", ...t(es, en), style: "h3" }, caption(names, names), ...children],
  };
}

/** A small framed box for layout demos, so the space it takes shows. */
export const cell = (es, en, extra = {}) => ({ type: "Card", variant: "outlined", padding: 8, ...extra, children: [{ type: "Text", ...t(es, en), style: "label" }] });

export const titleOf = (es, en) => ({ title: es, titleEn: en });
