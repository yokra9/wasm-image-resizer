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
  const url = 'https://raw.githubusercontent.com/rustwasm/wasm-pack/master/demo.gif'
  const resp = await fetch(url);
  const { ptr, len } = await loadImageToMemory(await resp.blob(), wasm);

  // WASM側でメモリから画像を読み込んでリサイズ処理を行う
  const format = "png";
  const result = wasm.resize_image(ptr, len, 100, 200, format) as BufferValue;

  // WASMインスタンスのメモリから画像を取得する
  const blob = loadImageFromMemory(result.ptr, result.len, wasm);

  // 画面上に処理結果を表示する
  describeImageFromBlob(blob);
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
function describeImageFromBlob(blob: Blob) {
  const e = document.getElementById("sample");
  e.setAttribute("src", URL.createObjectURL(blob));
}