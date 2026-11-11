// Project-scoped storage: both apps share the github.io origin.
export function scopedStorage(getStorage:()=>Storage,prefix='convertverse.'){
  const full=(key:string)=>key.startsWith(prefix)?key:prefix+key;
  const keys=()=>{const storage=getStorage();return Array.from({length:storage.length},(_,i)=>storage.key(i)).filter((key):key is string=>Boolean(key?.startsWith(prefix)));};
  return {
    getItem(key:string){return getStorage().getItem(full(key));},
    setItem(key:string,value:string){getStorage().setItem(full(key),value);},
    removeItem(key:string){getStorage().removeItem(full(key));},
    clear(){for(const key of keys())getStorage().removeItem(key);},
    key(index:number){return keys()[index]?.slice(prefix.length)??null;},
    get length(){return keys().length;},
  };
}
export const cvLocalStorage=scopedStorage(()=>globalThis.localStorage);
export const cvSessionStorage=scopedStorage(()=>globalThis.sessionStorage);
