# Kino UI gallery

[Español](README.es.md)

A plugin whose only job is to show what a Kino plugin screen can look like. Every component of the screen kit has its own
section with a live, interactive example, on the phone and on the TV: layout, text and images, buttons and forms, lists,
dialogs and sheets, tabs and navigation, animations and more. Copy what you like from [`plugin.js`](plugin.js) into your own
plugin.

It is an example for plugin authors. It does not play anything and it is **not listed in Kino's plugin search or
recommendations** (`"discoverable": false`): you install it by its address.

## Requirements

- Kino **0.9.74 or later** (the plugin uses `apiVersion` 14, the screen kit). An older Kino says it needs a newer version.

## Install

1. In Kino open **Plugins ▸ Agregar plugin**.
2. Type `kinotvapp/kino-plugin-ui-gallery` and confirm.
3. Open **UI gallery** from the menu, or from the plugin's page in Plugins ▸ Installed ▸ Manage.

## Learn more

- The plugin guide and the screen reference (every component, property and event): <https://kinotvapp.github.io/kino-plugins/>
- Test your own screens with the plugin kit (`node sdk/validate.mjs .`, `node sdk/run.mjs . screen`).

## License

MIT. See [LICENSE](LICENSE).
