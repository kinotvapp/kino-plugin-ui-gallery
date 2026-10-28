# Galería de UI de Kino

[English](README.md)

Un plugin cuyo único trabajo es enseñar cómo puede verse la pantalla de un plugin de Kino. Cada componente del kit de
pantallas tiene su propia sección con un ejemplo vivo e interactivo, en teléfono y en TV: diseño, textos e imágenes, botones
y formularios, listas, ventanas y hojas, pestañas y navegación, animaciones y más.

Es un ejemplo para quienes crean plugins, **y también un ejemplo práctico de cómo construir un plugin a partir de muchos
archivos**: lees y editas el código pequeño y ordenado de [`src/`](src), y un comando lo empaqueta en el único
[`plugin.js`](plugin.js) que Kino carga. No reproduce nada y **no aparece en la búsqueda ni en las recomendaciones de
plugins de Kino** (`"discoverable": false`): se instala por su dirección.

## Cómo está construido

Kino carga exactamente un archivo (el `entry` del manifiesto) y no tiene resolutor de módulos, así que el archivo que lee no
puede hacer `import` de otro. Eso no obliga a escribir el plugin en un solo archivo: se escribe en módulos y luego se empaqueta.

```
src/ ──  npm run build  ──▶  plugin.js  ──  npm run sign  ──▶  kino-plugin.json (firma)
(cómo se escribe)            (lo que lee Kino)
```

El resultado, `plugin.js`, se genera: no se edita a mano. Edita `src/`, ejecuta la compilación y sube los dos.

### Los archivos

```
kino-plugin-ui-gallery/
├── src/                        el código fuente, escrito en módulos
│   ├── plugin.js               el punto de entrada: exporta lo que Kino llama, screen() y screenEvent()
│   ├── constants.js            la lista de pestañas, los nombres de iconos y las imágenes y direcciones públicas de los ejemplos
│   ├── helpers.js              constructores pequeños que usan todas las pestañas: t() (español + inglés), caption(), para(), section()
│   ├── demo-items.js           tres elementos de muestra para los ejemplos de las tarjetas propias de Kino
│   ├── state.js                el estado inicial de la pantalla, y leer de vuelta lo que Kino guardó
│   ├── view.js                 dibuja la pantalla: la barra de pestañas, las ventanas declaradas, la ruta Scaffold; llama a las pestañas
│   ├── events.js               responde a cada evento (un toque, un cambio, un tic del temporizador) con un estado nuevo
│   └── tabs/                   un archivo por pestaña: cada sección es un componente con un ejemplo vivo
│       ├── layout.js           Column, Row, Stack y hijos posicionados, Spacer, Divider, Scroll, GridView, Card,
│       │                       ExpansionTile, TabBar, ListView, ListTile, PageView, una pantalla Scaffold
│       ├── content.js          Text y roles de color, Image, Icon (todos los iconos), Badge, CircleAvatar, banner, Skeleton,
│       │                       QrImage, DataTable, progreso, estados vacío y de error, las tarjetas propias de Kino
│       ├── actions.js          botones, pulsaciones lentas, cuenta atrás para reenviar, botón flotante, pistas, chips, avisos
│       ├── forms.js            Form con validación, tu propio veredicto, campos sueltos, los ajustes del plugin
│       ├── overlays.js         diálogos, hojas, menús, ventanas declaradas
│       ├── navigation.js       abrir un enlace, título por ids, esta pantalla en una ruta, una ruta propia, cerrar
│       └── data.js             estado, eventos, temporizador, valores por tamaño, cajas y textos, animaciones, estilos
├── plugin.js                   GENERADO por `npm run build`: el único archivo que lee Kino (y que se firma)
├── kino-plugin.json            el manifiesto: id, apiVersion 14, la entrada de pantalla, la firma
├── package.json               los comandos de abajo, y esbuild (la única dependencia de desarrollo)
├── scripts/sign.mjs            firma plugin.js con la llave de quien mantiene el plugin (no hace falta para leer ni compilar)
├── sdk/                        el kit de plugins de Kino: validador, ejecutor y ayudas de prueba
├── contract.json, kino.d.ts    el contrato de plugins contra el que comprueba el kit, y sus tipos
├── test/gallery.test.mjs       las pruebas
└── LICENSE                     MIT
```

### Los comandos

```bash
npm install          # una vez: instala esbuild
npm run build        # src/ -> plugin.js (el archivo que lee Kino)
npm test             # las pruebas, incluida "plugin.js es exactamente lo que produce compilar src/"
npm run validate     # compilar + el validador de Kino: "Kino would accept this plugin"
npm run sign         # compilar + firmar, para quien mantiene el plugin (necesita la llave de autor; nunca se sube)
```

La compilación es un solo comando de esbuild, en `package.json`:

```bash
esbuild src/plugin.js --bundle --format=esm --target=es2020 --outfile=plugin.js
```

`plugin.js` conserva un comentario `// src/…` sobre cada módulo, así que hasta el archivo empaquetado dice de dónde viene cada
parte. La guía explica la idea en ["Splitting your code across files"](https://kinotvapp.github.io/kino-plugins/).

## Requisitos

- Kino **0.9.74 o posterior** (el plugin usa `apiVersion` 14, el kit de pantallas). Un Kino anterior avisa de que necesita
  una versión más nueva.

## Instalación

1. En Kino abre **Plugins ▸ Agregar plugin**.
2. Escribe `kinotvapp/kino-plugin-ui-gallery` y confirma.
3. Abre **Galería UI** desde el menú, o desde la página del plugin en Plugins ▸ Instalados ▸ Gestionar.

## Más información

- La guía de plugins y la referencia de pantallas (cada componente, propiedad y evento): <https://kinotvapp.github.io/kino-plugins/>
- Prueba tus propias pantallas con el kit: `node sdk/validate.mjs .` y `node sdk/run.mjs . screen`.

## Licencia

MIT. Ver [LICENSE](LICENSE).
