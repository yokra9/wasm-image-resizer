(()=>{"use strict";var e,t,n,o,r,a,i,s={},c={};function l(e){var t=c[e];if(void 0!==t)return t.exports;var n=c[e]={id:e,loaded:!1,exports:{}};return s[e](n,n.exports,l),n.loaded=!0,n.exports}l.m=s,e="function"==typeof Symbol?Symbol("webpack then"):"__webpack_then__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n=e=>{e&&(e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},o=e=>!--e.r&&e(),r=(e,t)=>e?e.push(t):o(t),l.a=(a,i,s)=>{var c,l,m,d=s&&[],u=a.exports,p=!0,b=!1,f=(t,n,o)=>{b||(b=!0,n.r+=t.length,t.map(((t,r)=>t[e](n,o))),b=!1)},g=new Promise(((e,t)=>{m=t,l=()=>(e(u),n(d),d=0)}));g[t]=u,g[e]=(e,t)=>{if(p)return o(e);c&&f(c,e,t),r(d,e),g.catch(t)},a.exports=g,i((a=>{if(!a)return l();var i,s;c=(a=>a.map((a=>{if(null!==a&&"object"==typeof a){if(a[e])return a;if(a.then){var i=[];a.then((e=>{s[t]=e,n(i),i=0}));var s={};return s[e]=(e,t)=>(r(i,e),a.catch(t)),s}}var c={};return c[e]=e=>o(e),c[t]=a,c})))(a);var m=new Promise(((e,n)=>{(i=()=>e(s=c.map((e=>e[t])))).r=0,f(c,i,n)}));return i.r?m:s})).then(l,m),p=!1},l.d=(e,t)=>{for(var n in t)l.o(t,n)&&!l.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},l.f={},l.e=e=>Promise.all(Object.keys(l.f).reduce(((t,n)=>(l.f[n](e,t),t)),[])),l.u=e=>e+".bundle.js",l.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),l.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a={},i="sample:",l.l=(e,t,n,o)=>{if(a[e])a[e].push(t);else{var r,s;if(void 0!==n)for(var c=document.getElementsByTagName("script"),m=0;m<c.length;m++){var d=c[m];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==i+n){r=d;break}}r||(s=!0,(r=document.createElement("script")).charset="utf-8",r.timeout=120,l.nc&&r.setAttribute("nonce",l.nc),r.setAttribute("data-webpack",i+n),r.src=e),a[e]=[t];var u=(t,n)=>{r.onerror=r.onload=null,clearTimeout(p);var o=a[e];if(delete a[e],r.parentNode&&r.parentNode.removeChild(r),o&&o.forEach((e=>e(n))),t)return t(n)},p=setTimeout(u.bind(null,void 0,{type:"timeout",target:r}),12e4);r.onerror=u.bind(null,r.onerror),r.onload=u.bind(null,r.onload),s&&document.head.appendChild(r)}},l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;l.g.importScripts&&(e=l.g.location+"");var t=l.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),l.p=e})(),(()=>{var e={179:0};l.f.j=(t,n)=>{var o=l.o(e,t)?e[t]:void 0;if(0!==o)if(o)n.push(o[2]);else{var r=new Promise(((n,r)=>o=e[t]=[n,r]));n.push(o[2]=r);var a=l.p+l.u(t),i=new Error;l.l(a,(n=>{if(l.o(e,t)&&(0!==(o=e[t])&&(e[t]=void 0),o)){var r=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src;i.message="Loading chunk "+t+" failed.\n("+r+": "+a+")",i.name="ChunkLoadError",i.type=r,i.request=a,o[1](i)}}),"chunk-"+t,t)}};var t=(t,n)=>{var o,r,[a,i,s]=n,c=0;for(o in i)l.o(i,o)&&(l.m[o]=i[o]);for(s&&s(l),t&&t(n);c<a.length;c++)r=a[c],l.o(e,r)&&e[r]&&e[r][0](),e[a[c]]=0},n=self.webpackChunksample=self.webpackChunksample||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),l.v=(e,t,n,o)=>{var r=fetch(l.p+""+n+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(r,o).then((t=>Object.assign(e,t.instance.exports))):r.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,o))).then((t=>Object.assign(e,t.instance.exports)))};var m=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function i(e){try{c(o.next(e))}catch(e){a(e)}}function s(e){try{c(o.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,s)}c((o=o.apply(e,t||[])).next())}))};function d(e,t){document.getElementById(t).setAttribute("src",URL.createObjectURL(e))}l.e(30).then(l.bind(l,30)).then((e=>m(void 0,void 0,void 0,(function*(){const t=`./img/${location.href.split("/").pop()}.jpg`,n=yield fetch(t),o=yield n.blob(),r=new Blob([o]);console.time("##### WebAssembly #####");const a=yield function(e,t,n,o){return m(this,void 0,void 0,(function*(){console.log(`Original: ${e.size} Bytes`),console.time("Blob to Uint8Array");const t=new Uint8Array(yield e.arrayBuffer());console.timeEnd("Blob to Uint8Array"),console.time("wasm.resize_image()");const n=o.resize_image(t,512,512,"jpg");console.timeEnd("wasm.resize_image()"),console.time("Uint8Array to Blob");const r=new Blob([n]);return console.log(`Resized: ${r.size} Bytes`),console.timeEnd("Uint8Array to Blob"),r}))}(o,0,0,e);console.timeEnd("##### WebAssembly #####"),d(a,"sample1"),console.time("##### resizeImageLegacy #####");const i=yield(s=r,512,512,new Promise(((e,t)=>{console.time("create object");const n=new Image;console.log(`Original: ${s.size} Bytes`),console.timeEnd("create object"),console.time("URL.createObjectURL()");const o=URL.createObjectURL(s);console.timeEnd("URL.createObjectURL()"),n.onload=()=>{console.timeEnd("load image from ObjectURL"),console.time("Document.createElement()");const o=document.createElement("canvas");o.width=512,o.height=512,console.timeEnd("Document.createElement()"),console.time("HTMLCanvasElement.getContext()");const r=o.getContext("2d");null!=r?(console.timeEnd("HTMLCanvasElement.getContext()"),console.time("CanvasRenderingContext2D.drawImage()"),r.drawImage(n,0,0,n.naturalWidth,n.naturalHeight,0,0,o.width,o.height),console.timeEnd("CanvasRenderingContext2D.drawImage()"),console.time("HTMLCanvasElement.toBlob()"),o.toBlob((n=>{null!=n?(console.log(`Resized: ${n.size} Bytes`),console.timeEnd("HTMLCanvasElement.toBlob()"),e(n)):t("cannot convert canvas to blob.")}),"image/jpeg",.8)):t("cannot get context.")},console.time("load image from ObjectURL"),n.src=o})));var s;console.timeEnd("##### resizeImageLegacy #####"),d(i,"sample2")}))))})();