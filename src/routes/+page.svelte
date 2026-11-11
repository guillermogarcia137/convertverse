<script lang="ts">
  import {goto} from '$app/navigation';
  import {resolve} from '$app/paths';
  import {files} from '#lib/store/index.svelte';
  import {converters,converterCategories} from '#lib/converters';
  import {UploadIcon,ArrowRightIcon,ImageIcon,FileTextIcon,AudioLinesIcon,FilmIcon,ShieldCheckIcon,ChevronDownIcon} from '@lucide/svelte';
  let picker:HTMLInputElement,target=$state(''),expanded=$state(''),loadingSample=$state(false),sampleError=$state('');
  const groups=[{id:'image',name:'Imágenes',icon:ImageIcon,desc:'Iconos, fotos y gráficos. PNG, ICO, JPG, SVG, WebP…'},{id:'doc',name:'Documentos',icon:FileTextIcon,desc:'DOCX a PDF, Markdown, HTML, EPUB, ODT y más.'},{id:'audio',name:'Audio',icon:AudioLinesIcon,desc:'MP3, WAV, FLAC, OGG, AAC y otros formatos.'},{id:'video',name:'Vídeo',icon:FilmIcon,desc:'MP4, WebM, MOV y más, según códec y navegador.'}];
  const quick=[{from:'DOCX',to:'PDF'},{from:'PNG',to:'ICO'},{from:'ICO',to:'PNG'},{from:'JPG',to:'WEBP'},{from:'WAV',to:'MP3'}];
  function formats(group:string){return [...new Set(converters.filter(c=>(converterCategories as Record<string,string[]>)[group]?.includes(c.name)).flatMap(c=>c.supportedFormats.map(f=>f.name)))].sort();}
  function select(from='',to=''){target=to?'.'+to.toLowerCase():'';picker.accept=from?'.'+from.toLowerCase():'';picker.click();}
  async function add(){const old=new Set(files.files.map(f=>f.id));await files.addAsync(picker.files);for(const file of files.files)if(!old.has(file.id)&&target){file.to=target;file.preferredTarget=target;}picker.value='';if(files.files.some(f=>!old.has(f.id)))await goto(resolve('/convert'));}
  async function example(from:string,to:string){
    loadingSample=true;sampleError='';
    try{
      const name='convertverse-prueba.'+from,response=await fetch(resolve('/')+'examples/'+name);
      if(!response.ok)throw new Error('No se ha podido cargar el ejemplo.');
      const previous=new Set(files.files.map(file=>file.id));
      await files.addAsync([new File([await response.blob()],name)]);
      for(const file of files.files)if(!previous.has(file.id)){file.to='.'+to;file.preferredTarget='.'+to;}
      await goto(resolve('/convert'));
    }catch(error){sampleError=error instanceof Error?error.message:'No se ha podido preparar el ejemplo.';}
    finally{loadingSample=false;}
  }
</script>
<svelte:head><title>ConvertVerse · Tus archivos, a tu manera</title></svelte:head>
<div class="cv-home"><section class="cv-hero"><div><p class="cv-eyebrow">DE UN FORMATO A OTRA POSIBILIDAD / VOL. 01</p><h1>El formato cambia.<br>Tus ideas siguen<span>.</span></h1><p>Documentos, imágenes, audio y vídeo.<br>Un lugar para transformar tus archivos, con tu propio estilo.</p></div><div class="cv-hero-art" aria-hidden="true"><div class="cv-file-stack"><span>.DOCX</span><span>.PDF ↗</span></div><small>OTRO FORMATO. LA MISMA IDEA.</small></div></section>
<input bind:this={picker} type="file" multiple onchange={add} class="hidden" aria-label="Elegir archivos para convertir"/>
<button class="cv-upload" onclick={()=>select()} aria-label="Elegir archivos"><span class="cv-upload-icon"><UploadIcon size={27}/></span><strong>Arrastra tus archivos aquí<span>o elige desde tu dispositivo</span></strong><span class="cv-upload-action">Elegir archivos <ArrowRightIcon size={17}/></span><small>Sin cuenta · Conversión en el navegador · Descarga directa</small></button>
<div class="cv-quick"><span>DIRECTO A</span>{#each quick as pair}<button onclick={()=>select(pair.from,pair.to)}>{pair.from}<ArrowRightIcon size={12}/>{pair.to}</button>{/each}</div>
<details class="cv-samples"><summary>Probar con un archivo de ejemplo</summary><p>Archivos sintéticos pequeños, sin datos personales.</p><div>{#each [['docx','pdf'],['png','ico'],['ico','png'],['wav','mp3']] as [from,to]}<button disabled={loadingSample} onclick={()=>example(from,to)}>Ejemplo {from.toUpperCase()} → {to.toUpperCase()}</button>{/each}</div>{#if sampleError}<p role="alert">{sampleError}</p>{/if}</details>
<div class="cv-section-title"><div><p class="cv-eyebrow">UN CONVERSOR, MUCHAS POSIBILIDADES</p><h2>¿Qué transformamos hoy?</h2></div><span>EL MOTOR ADECUADO PARA CADA ARCHIVO</span></div>
<div class="cv-categories">{#each groups as group}{@const Icon=group.icon}<article class="cv-category"><Icon size={25}/><h3>{group.name}</h3><p>{group.desc}</p><button class="cv-format-toggle" onclick={()=>expanded=expanded===group.id?'':group.id} aria-expanded={expanded===group.id}>{formats(group.id).length} formatos <ChevronDownIcon size={13}/></button></article>{/each}</div>
{#if expanded}<section class="cv-formats" aria-label="Formatos compatibles"><h3>{groups.find(g=>g.id===expanded)?.name}</h3><p>Los formatos de entrada y salida varían según el motor. El selector ofrece las opciones disponibles para cada archivo.</p><div>{#each formats(expanded) as format}<span>{format}</span>{/each}</div></section>{/if}
<div class="cv-note"><ShieldCheckIcon size={22}/><div><strong>Los archivos no viajan. Las posibilidades, sí.</strong><br>Se procesan en esta pestaña y no se envían a servicios de conversión. El rendimiento depende del dispositivo y del tamaño del archivo.</div></div>
<p class="cv-pdf-note">DOCX → PDF conserva el contenido, tablas, listas e imágenes compatibles. La paginación y los diseños complejos pueden variar. Los antiguos archivos .doc deben guardarse primero como .docx.</p>
</div>
