<script lang="ts">
import {cvLocalStorage,cvSessionStorage} from '#lib/util/storage';

  import {onMount} from 'svelte';
  import {goto} from '$app/navigation';
  import {resolve} from '$app/paths';
  import {files,isMobile,effects,theme,dropping,locale,updateLocale} from '#lib/store/index.svelte';
  import {Settings} from '#lib/sections/settings/index.svelte';
  import {initStores} from '#lib/util/animation';
  import {installConsoleCapture} from '#lib/util/logger.svelte';
  import {applyTheme,readTheme} from '#lib/themes/theme';
  import Shell from '#lib/components/convertverse/Shell.svelte';
  import * as Layout from '#lib/components/layout';
  import '#lib/css/app.scss';
  import '#lib/css/convertverse.css';
  import '#lib/themes/extra.css';
  const base=resolve('/').replace(/\/$/,'');
  let {children}=$props();
  async function drop(event:DragEvent){event.preventDefault();dropping.set(false);const count=files.files.length;await files.addAsync(event.dataTransfer?.files);if(files.files.length!==count)await goto(resolve('/convert'));}
  function drag(event:DragEvent,value:boolean){event.preventDefault();dropping.set(value);}
  onMount(()=>{
    installConsoleCapture();initStores();Settings.instance.load();
    const resize=()=>isMobile.set(innerWidth<=768);resize();window.addEventListener('resize',resize);
    effects.set(cvLocalStorage.getItem('effects')==='true');
    updateLocale(cvLocalStorage.getItem('locale')||'es');
    const selected=applyTheme(readTheme());theme.set(selected.mode as 'light'|'dark');
    const paste=async(event:ClipboardEvent)=>{if(!event.clipboardData?.files.length)return;event.preventDefault();const count=files.files.length;await files.addAsync(event.clipboardData.files);if(files.files.length!==count)await goto(resolve('/convert'));};
    window.addEventListener('paste',paste);
    return()=>{window.removeEventListener('resize',resize);window.removeEventListener('paste',paste);};
  });
</script>
<svelte:head><title>ConvertVerse</title><meta name="theme-color" content="#080f20"/><meta name="description" content="Convierte documentos, imágenes, audio y vídeo desde tu navegador. DOCX a PDF, PNG a ICO y más. Con 42 temas, sin cuenta y sin subir tus archivos."/><link rel="manifest" href={base+'/manifest.json'}/><link rel="canonical" href="https://guillermogarcia137.github.io/convertverse/"/></svelte:head>
<div ondrop={drop} ondragenter={event=>drag(event,true)} ondragover={event=>drag(event,true)} ondragleave={event=>drag(event,false)} role="region" aria-label="Conversor de archivos">
  <Layout.UploadRegion/>
  {#key $locale}<Shell {children}/>{/key}
  <Layout.Toasts/><Layout.Dialogs/>
</div>
