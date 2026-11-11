<script lang="ts">
  import {onMount} from 'svelte';
  import {PaletteIcon,SearchIcon,XIcon,CheckIcon} from '@lucide/svelte';
  import {themes,palette} from '#lib/themes/catalog.js';
  import {applyTheme,readTheme} from '#lib/themes/theme';
  import {theme} from '#lib/store/index.svelte';
  let dialog:HTMLDialogElement;
  let selected=$state('navy-sans'),query=$state(''),filter=$state('all');
  const filters=[['all','Todos'],['featured','Destacados'],['dark','Oscuros'],['light','Claros'],['Omarchy','Omarchy']];
  let choices=$derived(themes.filter(t=>(filter==='all'||filter==='featured'&&t.featured||t.mode===filter||t.group===filter)&&(t.label+' '+t.group).toLowerCase().includes(query.toLowerCase())));
  let active=$derived(themes.find(t=>t.id===selected)||themes[1]);
  function choose(id:string){const next=applyTheme(id);selected=next.id;theme.set(next.mode as 'light'|'dark');}
  onMount(()=>{selected=readTheme();const update=(event:Event)=>{selected=(event as CustomEvent).detail.id;};window.addEventListener('convertverse:theme',update);return()=>window.removeEventListener('convertverse:theme',update);});
</script>
<button type="button" class="cv-theme-trigger" onclick={()=>dialog.showModal()} aria-label="Elegir tema y estilo" aria-haspopup="dialog"><PaletteIcon size={30}/><span>Temas<small>{active.label}</small></span></button>
<dialog bind:this={dialog} class="cv-gallery" aria-labelledby="cv-gallery-title" onclick={event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}}>
  <div class="cv-gallery-head"><div><p class="cv-eyebrow">TU ESPACIO, TU ESTILO</p><h2 id="cv-gallery-title">Encuentra tu ambiente<span>.</span></h2><p>Los 42 temas de PanelVerse, también aquí.</p></div><button class="cv-icon-button" onclick={()=>dialog.close()} aria-label="Cerrar temas"><XIcon/></button></div>
  <div class="cv-gallery-tools"><label><SearchIcon size={17}/><input bind:value={query} placeholder="Nothing, Apple, Tokyo…" aria-label="Buscar temas"/></label><div class="cv-theme-filters">{#each filters as [id,label]}<button class:active={filter===id} aria-pressed={filter===id} onclick={()=>filter=id}>{label}</button>{/each}</div></div>
  <div class="cv-theme-grid">{#each choices as t}{@const p=palette(t)}<button class="cv-theme-card" class:selected={selected===t.id} aria-pressed={selected===t.id} aria-label={'Aplicar tema '+t.label} onclick={()=>choose(t.id)}><div class="cv-theme-preview" style={`--p-bg:${p.bg};--p-surface:${p.surface};--p-side:${p.sidebar};--p-text:${p.text};--p-accent:${p.accent};--p-line:${p.border}`}><i></i><div><b>ConvertVerse<span>↗</span></b><em></em><em></em><strong><span></span><span></span><span></span></strong></div>{#if selected===t.id}<span class="cv-theme-check"><CheckIcon size={14}/></span>{/if}</div><span class="cv-theme-name">{t.label}<small>{t.group==='PanelVerse'?'ConvertVerse':t.group} · {t.mode==='light'?'Claro':'Oscuro'}</small></span></button>{/each}</div>
  <div class="cv-gallery-footer"><p>Activo: <strong>{active.label}</strong><small>{choices.length} temas · Tu elección se recuerda en este navegador.</small></p><button class="cv-primary" onclick={()=>dialog.close()}>Listo</button></div>
</dialog>
