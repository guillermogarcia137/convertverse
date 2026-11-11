<script lang="ts">
  import {page} from '$app/state';
  import {resolve} from '$app/paths';
  import {files} from '#lib/store/index.svelte';
  import {ArrowUpRightIcon,ArrowLeftRightIcon,FolderOpenIcon,SettingsIcon,InfoIcon,ShieldCheckIcon} from '@lucide/svelte';
  import ThemeGallery from './ThemeGallery.svelte';
  let {children}=$props();
  const links=[{url:resolve('/'),title:'Convertir archivos',icon:FolderOpenIcon},{url:resolve('/convert'),title:'Mis conversiones',icon:ArrowLeftRightIcon},{url:resolve('/settings'),title:'Preferencias',icon:SettingsIcon},{url:resolve('/about'),title:'Acerca del proyecto',icon:InfoIcon}];
</script>
<a class="cv-skip" href="#cv-main">Saltar al contenido</a>
<aside class="cv-sidebar">
  <a class="cv-brand" href={resolve('/')}><span class="cv-brand-mark">CV<span></span></span><strong>ConvertVerse<small>TUS ARCHIVOS. TU ESTILO.</small></strong></a>
  <p class="cv-eyebrow cv-nav-caption">TU ESPACIO</p>
  <nav aria-label="Navegación principal">{#each links as item,i}{@const Icon=item.icon}<a href={item.url} class:active={page.url.pathname===item.url||page.url.pathname===item.url+'/'}><span class="cv-nav-number">0{i+1}</span><Icon size={18}/><span>{item.title}</span>{#if item.url===resolve('/convert')}<small>{files.files.length}</small>{/if}</a>{/each}</nav>
  <div class="cv-project-links"><a href="https://guillermogarcia137.github.io/panelverse/" target="_blank" rel="noopener noreferrer">PanelVerse <ArrowUpRightIcon size={15}/></a><a href="https://github.com/guillermogarcia137/convertverse" target="_blank" rel="noopener noreferrer">Repositorio <ArrowUpRightIcon size={15}/></a></div>
  <div class="cv-sidebar-bottom"><ShieldCheckIcon size={19}/><strong>Tus archivos se quedan contigo.</strong><p>Conversión en el navegador.<br>Sin cuenta. Sin subir archivos.</p><a href={resolve('/privacy')}>Privacidad ↗</a></div>
</aside>
<div class="cv-workspace"><header class="cv-topbar"><a href={resolve('/')} class="cv-mobile-brand">CV<span>ConvertVerse</span></a><span class="cv-eyebrow cv-desktop-label">/ CONVERTIR, SIN COMPLICACIONES</span><div class="cv-top-actions"><a class="cv-source-link" href="https://github.com/guillermogarcia137/convertverse" target="_blank" rel="noopener noreferrer">Código abierto <ArrowUpRightIcon size={14}/></a><ThemeGallery/></div></header>
<nav class="cv-mobile-nav" aria-label="Navegación móvil">{#each links.slice(0,3) as item}{@const Icon=item.icon}<a href={item.url} class:active={page.url.pathname===item.url||page.url.pathname===item.url+'/'}><Icon size={16}/>{item.title}</a>{/each}</nav>
<main id="cv-main">{@render children()}</main>
<footer class="cv-footer"><span>ConvertVerse <small>01 / Tus archivos, a tu manera.</small></span><div><a href={resolve('/privacy')}>Privacidad</a><a href={resolve('/about')}>Basado en VERT · AGPL-3.0</a><a href="https://github.com/guillermogarcia137/convertverse" target="_blank" rel="noopener noreferrer">Código fuente ↗</a></div></footer></div>
