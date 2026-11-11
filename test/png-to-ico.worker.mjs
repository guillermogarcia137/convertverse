import {readFile} from 'node:fs/promises';
import {deflateSync} from 'node:zlib';
import assert from 'node:assert/strict';
function crc32(data){let crc=0xffffffff;for(const b of data){crc^=b;for(let n=0;n<8;n++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function chunk(name,data){const type=Buffer.from(name),length=Buffer.alloc(4),crc=Buffer.alloc(4);length.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([type,data])));return Buffer.concat([length,type,data,crc]);}
function png(width,height){const header=Buffer.alloc(13);header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;const pixels=Buffer.alloc(height*(1+width*4));for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=y*(1+width*4)+1+x*4;pixels[i]=35;pixels[i+1]=90;pixels[i+2]=210;pixels[i+3]=(x+y)%3?255:0;}return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);}
let response;globalThis.self=globalThis;globalThis.postMessage=value=>response=value;globalThis.onmessage=null;
await import('../src/lib/workers/magick.ts');
const wasm=await readFile(new URL('../node_modules/@imagemagick/magick-wasm/dist/x86/magick.wasm',import.meta.url));
await globalThis.onmessage({data:{type:'load',id:'test-load',wasm:new Uint8Array(wasm).buffer}});
assert.equal(response.type,'loaded',response.error);
for(const [width,height] of [[64,64],[1024,1024],[1920,1080],[400,800],[1,4096]]){
 const bytes=png(width,height);const file=new File([bytes],`synthetic-${width}x${height}.png`,{type:'image/png'});
 await globalThis.onmessage({data:{type:'convert',id:`${width}x${height}`,input:{file,name:file.name,from:'.png',to:'.ico'},to:'.ico',conversionSettings:JSON.stringify({singleSize:false,quality:90,transparency:true,metadata:true})}});
 assert.equal(response.type,'finished',response.error);
 const ico=Buffer.from(response.output);assert.equal(ico.readUInt16LE(0),0);assert.equal(ico.readUInt16LE(2),1);const count=ico.readUInt16LE(4);assert.ok(count>0);
 for(let i=0;i<count;i++){const at=6+i*16,w=ico[at]||256,h=ico[at+1]||256,length=ico.readUInt32LE(at+8),offset=ico.readUInt32LE(at+12);assert.ok(w>0&&w<=256&&h>0&&h<=256);assert.ok(offset+length<=ico.length);}
 console.log(`PASS PNG ${width}x${height} → ICO: ${count} imágenes, ${ico.length} bytes.`);
}

process.exit(0);
