import test from 'node:test';
import assert from 'node:assert/strict';
import {scopedStorage} from '../src/lib/util/storage.ts';
import {themes,palette,contrast} from '../src/lib/themes/catalog.js';
import {sanitizeForPdf} from '../src/lib/converters/pandoc/pdf.ts';
function memory(){const data=new Map();return {get length(){return data.size;},key:i=>[...data.keys()][i]??null,getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key),clear:()=>data.clear()};}
test('limpiar ConvertVerse conserva la biblioteca, autenticación y temas de PanelVerse',()=>{
  const storage=memory();storage.setItem('panelverse.library.v1','original');storage.setItem('panelverse.auth.v1','session');storage.setItem('panelverse.theme.v1','navy-sans');storage.setItem('other-project','keep');
  const scoped=scopedStorage(()=>storage);scoped.setItem('settings','mine');scoped.setItem('convertverse.theme.v1','apple-light');
  assert.equal(scoped.length,2);assert.equal(scoped.getItem('settings'),'mine');assert.equal(storage.getItem('convertverse.settings'),'mine');
  scoped.clear();assert.equal(scoped.length,0);assert.equal(storage.getItem('panelverse.library.v1'),'original');assert.equal(storage.getItem('panelverse.auth.v1'),'session');assert.equal(storage.getItem('other-project'),'keep');
});
test('el catálogo conserva los 42 temas y su texto es legible',()=>{
  assert.equal(themes.length,42);assert.equal(new Set(themes.map(t=>t.id)).size,42);
  for(const item of themes){const p=palette(item);assert.ok(contrast(p.text,p.bg)>=4.5,p.label);assert.ok(contrast(p.link,p.surface)>=4.5,p.label);assert.ok(contrast(p.ink,p.accent)>=4.5,p.label);}
});
test('el HTML de documentos no conserva scripts ni imágenes que llamen a servidores',()=>{
  const html=sanitizeForPdf('<h1>Título</h1><p onclick="alert(1)">Texto</p><script>alert(1)</script><img src="https://example.com/tracker.png"><img src="file:///private.png"><iframe src="https://example.com"></iframe><a href="javascript:alert(1)">enlace</a>');
  assert.ok(html.includes('Título'));assert.ok(html.includes('Texto'));assert.doesNotMatch(html,/script|onclick|iframe|tracker|file:\/\/|javascript:/i);
});
test('las imágenes incorporadas se incrustan en PDF sin resolver rutas externas',()=>{
  const embedded='data:image/png;base64,iVBORw0KGgo=';
  const html=sanitizeForPdf('<p>Antes</p><img src="media/image1.png"><p>Después</p>',new Map([['media/image1.png',embedded]]));
  assert.ok(html.includes(embedded));assert.ok(html.includes('Después'));assert.doesNotMatch(html,/src="media/);
});
