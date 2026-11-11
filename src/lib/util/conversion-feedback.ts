export function unsupportedMessage(extension:string):string {
  switch(extension.toLowerCase()) {
    case '.doc': return 'Los archivos Word antiguos (.doc) no son compatibles. Ábrelo en Word y guárdalo como .docx para convertirlo a PDF.';
    case '.pdf': return 'PDF se admite como formato de salida. Esta versión no convierte PDF a Word ni a imágenes.';
    default: return `No hay una conversión disponible para ${extension.toUpperCase() || 'este tipo de archivo'} en este navegador. Prueba con otro formato de origen.`;
  }
}
