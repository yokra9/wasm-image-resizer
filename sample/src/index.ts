import type * as WASM from "wasm-image-resizer"

type Wasm = typeof WASM;
type BufferValue = {
  ptr: number,
  len: number,
}

// WASMのShimを動的インポートする
const js = import("wasm-image-resizer");
js.then(async wasm => {
  const url = `./img/${location.href.split('/').pop()}.jpg`;
  const resp = await fetch(url);

  const b1 = await resp.blob();
  const b2 = new Blob([b1]);

  // WASMでリサイズ
  console.time("##### WebAssembly #####");

  // 画像をWASMインスタンスのメモリ上に格納する
  console.time("loadImageToMemory");
  const { ptr, len } = await loadImageToMemory(b1, wasm);
  console.timeEnd("loadImageToMemory");

  // WASM側でメモリから画像を読み込んでリサイズ処理を行う
  console.time("resize_image");
  const format = "jpg";
  const result = wasm.resize_image(ptr, len, 512, 512, format) as BufferValue;
  console.timeEnd("resize_image");

  // WASMインスタンスのメモリから画像を取得する
  console.time("loadImageFromMemory");
  const blob = loadImageFromMemory(result.ptr, result.len, wasm);
  console.timeEnd("loadImageFromMemory");
  console.timeEnd("##### WebAssembly #####");

  // 画面上に処理結果を表示する
  describeImageFromBlob(blob, "sample1");

  // 比較用: Canvasでリサイズ
  console.time("##### resizeImageLegacy #####");
  const blob2 = await resizeImageLegacy(b2, 512, 512)
  console.timeEnd("##### resizeImageLegacy #####");

  // 画面上に処理結果を表示する
  describeImageFromBlob(blob2, "sample2");

});

/**
 * load image to memory on WASM instance
 * @param {Blob} img image
 * @param {Wasm} wasm WASM instance
 * @returns {Promise<{ptr: number; len: number;}>} Pointer and Length
 */
async function loadImageToMemory(img: Blob, { alloc, wasm_memory }: Wasm) {

  // 画像Blobからバッファを取得する
  const buf = await img.arrayBuffer();

  // 画像のデータ長を確認する
  const len = buf.byteLength;
  console.log(`Original: ${len} Bytes`);

  // WASMインスタンス側で同サイズのバッファを確保してポインタを取得する
  const ptr = alloc(len);

  // WASMインスタンスのメモリ上のバイト配列を表示するビューを作成する
  const memory = wasm_memory() as WebAssembly.Memory;
  const view = new Uint8Array(memory.buffer, ptr, len);

  // バッファから型付き配列を作成し、WASMインスタンスのメモリ上に格納する
  view.set(new Uint8Array(buf));

  return { ptr, len };
}

/**
 * load image from memory on WASM instance
 * @param {number} ptr Pointer 
 * @param {number} len Length
 * @param {Wasm} wasm WASM instance
 * @returns {Blob} image
 */
function loadImageFromMemory(ptr: number, len: number, { wasm_memory }: Wasm) {
  // WASMインスタンスのメモリ上のバイト配列を表示するビューを作成する
  const memory = wasm_memory() as WebAssembly.Memory;
  const view = new Uint8Array(memory.buffer, ptr, len);

  // WASMインスタンスのメモリから画像Blobを取り出す
  const blob = new Blob([view]);
  console.log(`Resized: ${blob.size} Bytes`);

  return blob
}

/**
 * display blob image
 * @param blob 
 */
function describeImageFromBlob(blob: Blob, id: string) {
  const e = document.getElementById(id);
  e.setAttribute("src", URL.createObjectURL(blob));
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
