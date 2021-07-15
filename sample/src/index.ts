import type * as WASM from "wasm-image-resizer"
type Wasm = typeof WASM;

// WASMのShimを動的インポートする
const js = import("wasm-image-resizer/wasm_image_resizer");
js.then(async wasm => {
  // 画像をWASMインスタンスのメモリ上に格納する
  const { ptr, len } = await loadImageToMemory('https://raw.githubusercontent.com/rustwasm/wasm-pack/master/demo.gif', wasm);

  const format = "jpg";

  // WASM側でメモリから画像を読み込んでリサイズ処理を行う
  const base64 = wasm.resize_image_to_base64(ptr, len, 100, 200, format);

  // base64画像を読み込み
  const e = document.getElementById("sample");
  //e.setAttribute("src", `data:image/${format};base64,${base64}`);

  const blob = await base64ToBlob(base64, `image/${format}`);
  e.setAttribute("src", URL.createObjectURL(blob));

});

async function base64ToBlob(base64: string, mime: string) {
  const resp = await fetch(`data:${mime};base64,${base64}`);
  return await resp.blob();
}

async function loadImageToMemory(img: string, { alloc, wasm_memory }: Wasm) {

  // URLから画像を取得してバッファに入れる
  const resp = await fetch(img);
  const buf = await resp.arrayBuffer();

  // バッファの長さを確認する
  const len = buf.byteLength;
  console.log("len", len);

  // WASMインスタンス側で同サイズのバッファを確保してポインタを取得する
  const ptr = alloc(len);

  // WASMインスタンスのメモリ上のバイト配列を表示する型付き配列ビューを作成する
  const memory = wasm_memory() as WebAssembly.Memory;
  const imgArray = new Uint8Array(memory.buffer, ptr, len);

  // バッファから型付き配列を作成し、WASMインスタンスのメモリ上に格納する
  imgArray.set(new Uint8Array(buf));

  return { ptr, len };
}
