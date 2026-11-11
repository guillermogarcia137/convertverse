import {unzipSync} from 'fflate';
import sanitizeHtml from 'sanitize-html';

const toDataUrl=(bytes:Uint8Array,type:string)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(new Blob([new Uint8Array(bytes).buffer],{type}));});

/** Reflows Pandoc HTML into a searchable PDF; uploaded HTML is never mounted in the page. */
export async function htmlToPdf(file:File,zipped=false):Promise<Uint8Array>{
  let html:string;
  const media=new Map<string,string>();
  if(zipped){
    const entries=unzipSync(new Uint8Array(await file.arrayBuffer()));
    const document=Object.entries(entries).find(([name])=>/\.html?$/i.test(name));
    if(!document)throw new Error('No se ha encontrado el documento HTML intermedio.');
    html=new TextDecoder().decode(document[1]);
    for(const [path,bytes] of Object.entries(entries)){
      const ext=path.split('.').pop()?.toLowerCase(),type=({png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif'})[ext||''];
      if(type)media.set(path.replace(/^\.\//,''),await toDataUrl(bytes,type));
    }
  }else html=await file.text();
  const safe=sanitizeForPdf(html,media);
  const [{default:pdfMake},{default:fonts},{default:convert}]=await Promise.all([import('pdfmake/build/pdfmake'),import('pdfmake/build/vfs_fonts'),import('html-to-pdfmake')]);
  pdfMake.addVirtualFileSystem(fonts);
  const content=convert(safe,{window,tableAutoSize:true});
  async function constrain(nodes:any):Promise<void>{
    if(!nodes||typeof nodes!=='object')return;
    if(Array.isArray(nodes)){await Promise.all(nodes.map(constrain));return;}
    if(nodes.image&&typeof nodes.image==='string'&&nodes.image.startsWith('data:')){
      const image=new Image();image.src=nodes.image;await image.decode();
      nodes.fit=[Math.min(515,Number(nodes.width)||image.naturalWidth),Math.min(720,Number(nodes.height)||image.naturalHeight)];
      delete nodes.width;delete nodes.height;
    }
    await Promise.all(Object.values(nodes).map(constrain));
  }
  await constrain(content);
  const buffer=await pdfMake.createPdf({pageSize:'A4',pageMargins:[40,42,40,42],defaultStyle:{font:'Roboto',fontSize:10.5,lineHeight:1.2},content:content.length?content:[{text:' '}],info:{title:file.name.replace(/\.[^.]+$/,''),creator:'ConvertVerse · Pandoc / pdfmake'}}).getBuffer();
  return new Uint8Array(buffer);
}

export function sanitizeForPdf(html:string,media=new Map<string,string>()){
  return sanitizeHtml(html,{
    allowedTags:[...sanitizeHtml.defaults.allowedTags,'img'],
    allowedAttributes:{'*':['style'],a:['href','name'],img:['src','width','height','alt'],td:['colspan','rowspan'],th:['colspan','rowspan']},
    allowedSchemes:['https','http','mailto'],allowedSchemesByTag:{img:['data']},
    allowedStyles:{'*':{'color':[/^#[0-9a-f]+$/i,/^rgb\(/],'background-color':[/^#[0-9a-f]+$/i],'text-align':[/^(left|right|center|justify)$/],'font-weight':[/^(bold|normal|[1-9]00)$/],'font-style':[/^(italic|normal)$/],'text-decoration':[/^(underline|line-through)$/]}},
    transformTags:{img:(_tag,attrs)=>{
      let src=attrs.src||'';try{src=decodeURIComponent(src);}catch{}
      const path=src.replace(/^\.\//,''),embedded=media.get(path)||[...media.entries()].find(([name])=>name.endsWith('/'+path))?.[1];
      if(embedded)src=embedded;
      if(!/^data:image\/(png|jpe?g|gif);base64,/i.test(src))return {tagName:'span',attribs:{}};
      return {tagName:'img',attribs:{...attrs,src}};
    }},
  });
}
