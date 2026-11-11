declare module 'html-to-pdfmake' {const convert:(html:string,options?:Record<string,unknown>)=>any;export default convert;}
declare module 'pdfmake/build/pdfmake' {const pdfMake:{addVirtualFileSystem(fonts:unknown):void;createPdf(definition:unknown):{getBuffer():Promise<Uint8Array>}};export default pdfMake;}
declare module 'pdfmake/build/vfs_fonts' {const fonts:unknown;export default fonts;}
