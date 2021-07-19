import type * as WASM from "wasm-image-resizer"

type Wasm = typeof WASM;
type BufferValue = {
  ptr: number,
  len: number,
}

// WASMのShimを動的インポートする
const js = import("wasm-image-resizer");
js.then(async wasm => {
  // 画像をWASMインスタンスのメモリ上に格納する
  const url = './screenshot.png'
  const resp = await fetch(url);

  const b = await resp.blob()
  const b2 = new Blob([b])

  console.time("loadImageToMemory");
  const { ptr, len } = await loadImageToMemory(b, wasm);
  console.timeEnd("loadImageToMemory");

  // WASM側でメモリから画像を読み込んでリサイズ処理を行う
  console.time("resize_image");
  const format = "png";
  const result = wasm.resize_image(ptr, len, 1024, 1024, format) as BufferValue;
  console.timeEnd("resize_image");

  // WASMインスタンスのメモリから画像を取得する
  console.time("loadImageFromMemory");
  const blob = loadImageFromMemory(result.ptr, result.len, wasm);
  console.timeEnd("loadImageFromMemory");

  // 画面上に処理結果を表示する
  describeImageFromBlob(blob, "sample");

  console.time("resizeImageLegacy");
  const blob2 = await resizeImageLegacy(b2, 1024, 1024)
  console.timeEnd("resizeImageLegacy");

  describeImageFromBlob(blob, "sample2");
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

function resizeImageLegacy(file: Blob, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx == null) {
        reject('cannot get context.');
        return;
      }

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

      canvas.toBlob((blob) => {
        if (blob == null) {
          reject('cannot convert canvas to blob.');
          return;
        }
        console.log(`Resized: ${blob.size} Bytes`);
        resolve(blob);
      });
    };

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result == 'string') image.src = reader.result;
    };

    console.log(`Original: ${file.size} Bytes`);
    reader.readAsDataURL(file);
  });
}
