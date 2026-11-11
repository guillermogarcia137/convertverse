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

## Revisión del flujo tras incidencias

Se sustituyen las tarjetas heredadas por filas con controles de texto y mensajes persistentes: Convertir, Cancelar, Reintentar y Descargar. La preparación inicial termina antes de permitir elegir o arrastrar archivos; la inicialización del service worker comparte una única promesa.

Comprobación manual sobre la compilación estática en un origen nuevo (`127.0.0.1:4179`), sin caché previa:

1. Añadir el DOCX de ejemplo y después el PNG. Convertir únicamente el segundo a ICO.
2. Descargar ZIP con el DOCX todavía pendiente. Un lector ZIP independiente confirma una sola entrada `convertverse-prueba.ico` con cabecera de icono válida. Esto cubre el fallo de índices en lotes parciales.
3. Convertir el DOCX a PDF. Ambos archivos muestran «Conversión terminada» y sus botones de descarga.
4. Comprobar la pantalla a 390 × 844: navegación móvil, controles de descarga de al menos 44 px y ausencia de elementos que desborden el ancho disponible.

La primera revisión de tipos y las cuatro pruebas existentes pasan. La publicación vuelve a verificar tipos, pruebas y compilación sobre el commit final.
