# Galería de UI de Kino

[English](README.md)

Un plugin cuyo único trabajo es enseñar cómo puede verse la pantalla de un plugin de Kino. Cada componente del kit de
pantallas tiene su propia sección con un ejemplo vivo e interactivo, en teléfono y en TV: diseño, textos e imágenes, botones
y formularios, listas, ventanas y hojas, pestañas y navegación, animaciones y más. Copia lo que te guste de
[`plugin.js`](plugin.js) a tu propio plugin.

Es un ejemplo para quienes crean plugins. No reproduce nada y **no aparece en la búsqueda ni en las recomendaciones de
plugins de Kino** (`"discoverable": false`): se instala por su dirección.

## Requisitos

- Kino **0.9.74 o posterior** (el plugin usa `apiVersion` 14, el kit de pantallas). Un Kino anterior avisa de que necesita
  una versión más nueva.

## Instalación

1. En Kino abre **Plugins ▸ Agregar plugin**.
2. Escribe `kinotvapp/kino-plugin-ui-gallery` y confirma.
3. Abre **Galería UI** desde el menú, o desde la página del plugin en Plugins ▸ Instalados ▸ Gestionar.

## Más información

- La guía de plugins y la referencia de pantallas (cada componente, propiedad y evento): <https://kinotvapp.github.io/kino-plugins/>
- Prueba tus propias pantallas con el kit de plugins (`node sdk/validate.mjs .`, `node sdk/run.mjs . screen`).

## Licencia

MIT. Ver [LICENSE](LICENSE).
