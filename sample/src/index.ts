import type * as WASM from "wasm-image-resizer"

type Wasm = typeof WASM;
type Window = {
  cv: any
}
declare var window: Window

const url = `./img/${location.href.split('/').pop()}.jpg`;
const resp = await fetch(url);

const b1 = await resp.blob();
const b2 = new Blob([b1]);

/* -- Canvas API でリサイズ -- */
console.time("##### resizeImageLegacy #####");
const blob1 = await resizeImageLegacy(b1, 512, 512);
console.timeEnd("##### resizeImageLegacy #####");

// 画面上に処理結果を表示する
describeImageFromBlob(blob1, "sample2");

/* -- WASM でリサイズ -- */
// WASMのShimを動的インポートする
const js = import("wasm-image-resizer");
js.then(async wasm => {

  console.time("##### WebAssembly #####");
  const blob2 = await resizeImageWasm(b2, 512, 512, wasm);
  console.timeEnd("##### WebAssembly #####");

  // 画面上に処理結果を表示する
  describeImageFromBlob(blob2, "sample1");
});

/* -- OpenCV.js でリサイズ -- */
const cvVer = "master";
const script = document.createElement("script");
script.src = `https://docs.opencv.org/${cvVer}/opencv.js`;
script.onload = () => { console.log("OpenCV => ", window.cv) }
document.head.appendChild(script);

/**
 * display blob image
 * @param blob 
 */
function describeImageFromBlob(blob: Blob, id: string) {
  const e = document.getElementById(id);
  e.setAttribute("src", URL.createObjectURL(blob));
}

/**
 * resize image(WASM)
 * @param {Blob} file image
 * @param {number} width width
 * @param {number} height height
 * @param {string} format format
 * @param {Wasm} wasm WASM 
 * @returns {Promise<Blob>} image
 */
async function resizeImageWasm(file: Blob, width: number, height: number, wasm: Wasm): Promise<Blob> {
  console.log(`Original: ${file.size} Bytes`);
  console.time("Blob to Uint8Array");
  const arr = new Uint8Array(await file.arrayBuffer());
  console.timeEnd("Blob to Uint8Array");

  console.time("wasm.resize_image()");
  const result = wasm.resize_image(arr, width, height, "jpg")
  console.timeEnd("wasm.resize_image()");

  console.time("Uint8Array to Blob");
  const blob = new Blob([result]);
  console.log(`Resized: ${blob.size} Bytes`);
  console.timeEnd("Uint8Array to Blob");

  return blob
}

/**
 * resize image(JS-native)
 * @param {Blob} file image
 * @param {number} width width
 * @param {number} height height
 * @returns {Promise<Blob>} image
 */
function resizeImageLegacy(file: Blob, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    console.time("create object");
    const image = new Image();
    console.log(`Original: ${file.size} Bytes`);
    console.timeEnd("create object");

    console.time("URL.createObjectURL()");
    const objectURL = URL.createObjectURL(file);
    console.timeEnd("URL.createObjectURL()");

    image.onload = () => {
      console.timeEnd("load image from ObjectURL");

      console.time("Document.createElement()");
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      console.timeEnd("Document.createElement()");

      console.time("HTMLCanvasElement.getContext()");
      const ctx = canvas.getContext('2d');
      if (ctx == null) {
        reject('cannot get context.');
        return;
      }
      console.timeEnd("HTMLCanvasElement.getContext()");

      console.time("CanvasRenderingContext2D.drawImage()");
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
      console.timeEnd("CanvasRenderingContext2D.drawImage()");

      console.time("HTMLCanvasElement.toBlob()");
      canvas.toBlob((blob) => {
        if (blob == null) {
          reject('cannot convert canvas to blob.');
          return;
        }
        console.log(`Resized: ${blob.size} Bytes`);
        console.timeEnd("HTMLCanvasElement.toBlob()");
        resolve(blob);
      }, "image/jpeg", 0.8);
    };

    console.time("load image from ObjectURL");
    image.src = objectURL;
  });
}
