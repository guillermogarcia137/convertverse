# Validación de ConvertVerse

Comprobaciones realizadas con Brave en Windows, sobre el sitio estático servido con la ruta `/convertverse/`:

- DOCX → PDF: conversión y descarga reales. El PDF tiene una página con texto seleccionable, acentos, eñe, encabezado y contenido de la tabla de ejemplo, verificados mediante un lector PDF independiente.
- PNG → ICO: conversión y descarga reales; cabecera de icono válida.
- ICO → PNG: conversión y descarga reales; PNG de 64 × 64 dentro del ZIP producido por el motor original. ConvertVerse incorpora una mejora para entregar directamente las colecciones de una sola imagen; las colecciones con varias imágenes mantienen su ZIP.
- WAV → MP3: conversión y descarga reales del audio sintético de un segundo.
- Galería: 42 temas, búsqueda Apple, cambio a Apple Light y persistencia tras recargar.
- Móvil: comprobación a 390 × 844; navegación móvil visible y sin elementos que sobrepasen el ancho de la ventana.
- `bun run check`: 0 errores y 0 advertencias de Svelte.
- `bun run test`: cuatro pruebas aprobadas sobre aislamiento del almacenamiento, contraste de los 42 temas y saneado de HTML para PDF.
- Compilación estática correcta. Los motores generan advertencias heredadas de sus dependencias; no impiden publicar.

Los ejemplos no contienen datos personales y se regeneran con `node test/generate-fixtures.mjs static/examples`.

No se ha comprobado individualmente cada combinación del catálogo ni todos los códecs. El PDF recompone el documento, por lo que no garantiza la maquetación exacta de Word. La publicación ejecuta de nuevo tipos, pruebas y compilación en GitHub Actions.
