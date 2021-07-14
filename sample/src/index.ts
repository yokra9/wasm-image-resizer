const js = import("../node_modules/wasm-image-resizer/wasm_image_resizer");
js.then(js => {
  js.greet("WebAssembly");
});