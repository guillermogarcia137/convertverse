# ConvertVerse

Conversor web de Guillermo García, basado en [VERT](https://github.com/VERT-sh/VERT), con 42 temas permanentes de PanelVerse y estilo inicial navy.

- Web: https://guillermogarcia137.github.io/convertverse/
- Código: https://github.com/guillermogarcia137/convertverse
- PanelVerse: https://guillermogarcia137.github.io/panelverse/

## Funciones

Imágenes (incluido PNG ↔ ICO), audio, documentos y vídeo compatible con los motores del navegador. Selector de salida por archivo, conversión por lotes y descarga de resultados. Galería con miniaturas, búsqueda y filtros para 42 temas: Nothing, Apple, GitHub, Omarchy y Navy. La elección se guarda en este navegador.

Se añade DOCX → PDF mediante Pandoc y pdfmake. El PDF conserva texto seleccionable, listas, tablas e imágenes PNG/JPEG/GIF compatibles. El contenido se recompone: no se garantiza la maquetación exacta de Word en documentos complejos. Los antiguos archivos .doc deben guardarse como .docx primero. No se ofrece PDF → Word.

El rendimiento y los formatos efectivos dependen del navegador, sus códecs y los recursos del dispositivo. El catálogo describe entradas y salidas; no todas sus combinaciones son válidas. Los formatos disponibles para cada archivo se muestran en el selector.

Hay ejemplos sintéticos integrados de DOCX, PNG, ICO y WAV para probar el flujo sin documentos personales. Consulta la [guía de uso](docs/GETTING_STARTED.md).

## Privacidad

Los archivos se procesan en el navegador. Esta versión desactiva vertd, analítica y pagos: no sube archivos a servidores de conversión. Los motores se descargan como recursos de la web. Preferencias, almacenamiento temporal y caché tienen nombres propios de ConvertVerse, independientes de PanelVerse aunque compartan dominio.

## Desarrollo

Node.js 24 y Bun 1.4.4.

```sh
bun install --frozen-lockfile
```

Copiar `.env.example` a `.env`. Solo contiene configuración pública, sin claves ni servicios externos. Después:

```sh
bun run check
bun run test
bun run dev -- --host 127.0.0.1 --port 4177
```

Abrir http://localhost:4177/convertverse/ . Para comprobar la publicación estática:

```sh
bun run build
bun run preview -- --host 127.0.0.1 --port 4178
```

`BASE_PATH=/convertverse` se usa en desarrollo y GitHub Pages. El service worker se registra únicamente en esa ruta y permite los motores que necesitan aislamiento entre orígenes. La primera visita puede recargarse una vez al preparar ese entorno.

## Publicación

Cada push a main instala con el lockfile, comprueba tipos y pruebas, compila y publica `build/` en GitHub Pages. No necesita servidores locales, claves de conversión ni cuentas de los visitantes.

## Créditos y licencia

Adaptación de VERT, bajo GNU AGPL-3.0. Se conservan [LICENSE](LICENSE), [UPSTREAM.md](UPSTREAM.md) y los créditos incluidos en el código. Los cambios y el código completo de esta adaptación están disponibles en este repositorio. Los motores conservan sus licencias respectivas. La galería de temas adapta el catálogo de PanelVerse; las referencias visuales no implican afiliación con las marcas.