<script lang="ts">
  import {resolve} from '$app/paths';
  import {files} from '#lib/store/index.svelte';
  import type {VertFile} from '#lib/types';
  import {categories} from '#lib/converters';
  import FormatDropdown from '#lib/components/functional/FormatDropdown.svelte';
  import SettingsModal from '#lib/components/functional/popups/SettingsModal.svelte';
  import {formatBytes} from '#lib/util/file';
  import {unsupportedMessage} from '#lib/util/conversion-feedback';
  import {UploadIcon,ArrowRightIcon,DownloadIcon,CheckIcon,XIcon,SettingsIcon,FileIcon,LoaderCircleIcon,RotateCwIcon} from '@lucide/svelte';
  let picker:HTMLInputElement;
  let importError=$state(''),adding=$state(false),settingsFile=$state<VertFile>();
  const finished=$derived(files.files.filter(file=>file.result));
  const pending=$derived(files.files.filter(file=>!file.result&&!file.processing&&engines(file).length));
  const busy=$derived(files.files.some(file=>file.processing));

  function engines(file:VertFile){
    return file.isZip()?file.converters:file.findConverters([file.from,file.to]);
  }
  function loading(file:VertFile){return engines(file).some(engine=>engine.status==='downloading'||engine.status==='initializing');}
  function failedLoad(file:VertFile){return file.converters.some(engine=>engine.status==='error');}
  async function add(){
    adding=true;importError='';
    try{await files.addAsync(picker.files);}catch(error){importError=error instanceof Error?error.message:'No se han podido añadir los archivos.';}
    finally{picker.value='';adding=false;}
  }
  async function changeTarget(file:VertFile){
    const previous=file.result;file.result=null;file.conversionError='';file.preferredTarget=file.to;
    files.preloadConverters(file);await previous?.dispose();
  }
  async function retryLoad(file:VertFile){
    file.conversionError='';
    await Promise.all(file.converters.filter(engine=>engine.status==='error').map(engine=>engine.init()));
    files.preloadConverters(file);
  }
</script>

<svelte:head><title>Mis conversiones · ConvertVerse</title></svelte:head>
<section class="cv-conversions">
  <header class="cv-conversion-heading">
    <div><p class="cv-eyebrow">ELIGE. CONVIERTE. DESCARGA.</p><h1>Mis conversiones<span>.</span></h1><p>Elige un formato de salida. Al terminar, descarga tu archivo.</p></div>
    <input bind:this={picker} type="file" multiple onchange={add} class="hidden" aria-label="Añadir archivos para convertir"/>
    <button class="cv-secondary" onclick={()=>picker.click()} disabled={adding}><UploadIcon size={18}/>{adding?'Añadiendo…':'Añadir archivos'}</button>
  </header>
  {#if importError}<p class="cv-inline-error" role="alert">{importError}</p>{/if}
  {#if files.files.length}
    <div class="cv-batch-bar">
      <p aria-live="polite"><strong>{files.files.length}</strong> {files.files.length===1?'archivo':'archivos'}<span>·</span><strong>{finished.length}</strong> {finished.length===1?'listo para descargar':'listos para descargar'}</p>
      <div><button class="cv-primary" onclick={()=>files.convertAll()} disabled={!pending.length||busy}><RotateCwIcon size={17}/>Convertir pendientes{pending.length?' ('+pending.length+')':''}</button><button class="cv-secondary" onclick={()=>files.downloadAll()} disabled={!finished.length||busy}><DownloadIcon size={17}/>Descargar ZIP ({finished.length})</button></div>
    </div>
    <div class="cv-file-list">
      {#each files.files as file (file.id)}
        {@const supported=engines(file).length>0}
        {@const preparing=loading(file)}
        <article class="cv-file-row" class:cv-file-done={!!file.result} aria-label={file.name}>
          <div class="cv-file-info"><div class="cv-file-thumb">{#if file.blobUrl}<img src={file.blobUrl} alt=""/>{:else}<FileIcon size={26}/>{/if}</div><div><h2 title={file.name}>{file.name}</h2><p>{file.from.slice(1).toUpperCase()} <span>·</span> {formatBytes(file.size)}</p></div></div>
          <div class="cv-file-output"><span>Formato de salida</span>{#if supported}<FormatDropdown {categories} from={file.from} bind:selected={file.to} onselect={()=>changeTarget(file)} {file} disabled={file.processing}/>{:else}<span class="cv-unavailable">No disponible</span>{/if}</div>
          <div class="cv-file-actions">
            {#if file.processing}<button class="cv-secondary" onclick={()=>file.cancel()}>Cancelar</button>{:else if file.result}<button class="cv-primary cv-download" onclick={()=>file.download()}><DownloadIcon size={18}/>Descargar {file.result.to.toUpperCase()}</button>{:else if !supported&&failedLoad(file)}<button class="cv-secondary" onclick={()=>retryLoad(file)}><RotateCwIcon size={17}/>Reintentar carga</button>{:else}<button class="cv-primary" onclick={()=>file.convert()} disabled={!supported}><ArrowRightIcon size={18}/>{file.conversionError?'Reintentar':'Convertir'}</button>{/if}
            {#if supported}<button class="cv-icon-button" onclick={()=>settingsFile=file} aria-label={'Opciones de '+file.name} disabled={file.processing}><SettingsIcon size={17}/></button>{/if}
            <button class="cv-icon-button" onclick={()=>files.remove(file)} aria-label={'Quitar '+file.name}><XIcon size={18}/></button>
          </div>
          <div class="cv-file-status" class:cv-status-error={!!file.conversionError||!supported} role="status" aria-live="polite">
            {#if file.result}<CheckIcon size={16}/><span>Conversión terminada. Tu archivo está listo para descargar · {formatBytes(file.result.file.size)}{#if file.result.to==='.zip'} · Incluye varias imágenes o archivos.{/if}</span>
            {:else if file.processing}<LoaderCircleIcon size={16} class="cv-spin"/><span>{preparing?'Preparando el conversor… La primera carga puede tardar.':'Convirtiendo… Mantén esta pestaña abierta.'}</span>
            {:else if file.conversionError}<span>{file.conversionError}</span>
            {:else if !supported}<span>{failedLoad(file)?'No se ha podido cargar el conversor. Revisa la conexión y reinténtalo.':unsupportedMessage(file.from)}</span>
            {:else if preparing}<LoaderCircleIcon size={16} class="cv-spin"/><span>Preparando conversor. Puedes pulsar Convertir para empezar al terminar la carga.</span>
            {:else}<span>Listo para convertir a {file.to.toUpperCase()}.</span>{/if}
          </div>
          {#if file.processing}<progress class="cv-file-progress" aria-label={'Progreso de '+file.name} max="100" value={file.progress>0?file.progress:undefined}></progress>{/if}
        </article>
      {/each}
    </div>
    <p class="cv-session-note">Descarga los resultados antes de cerrar o recargar esta pestaña. Los originales no se modifican.</p>
  {:else}
    <div class="cv-conversion-empty"><div class="cv-empty-icon"><UploadIcon size={32}/></div><h2>Tu próximo archivo empieza aquí.</h2><p>Arrástralo a esta página o elige uno desde tu dispositivo.</p><button class="cv-primary" onclick={()=>picker.click()}>Elegir archivos <ArrowRightIcon size={18}/></button><a href={resolve('/')}>Volver al inicio y probar un ejemplo ↗</a></div>
  {/if}
</section>
{#if settingsFile}<SettingsModal file={settingsFile} onclose={()=>settingsFile=undefined}/>{/if}
