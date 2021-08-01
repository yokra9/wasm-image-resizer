extern crate console_error_panic_hook;
extern crate wasm_bindgen;

use image::*;
use js_sys::*;
use opencv::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn time(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn timeEnd(s: &str);
}

#[wasm_bindgen]
pub fn resize_image(arr: Uint8Array, width: usize, height: usize, fmt: &str) -> Uint8Array {
    console_error_panic_hook::set_once();

    // Uint8Array から Vec にコピーする
    time("Uint8Array to Vec<u8>");
    let buffer = arr.to_vec();
    timeEnd("Uint8Array to Vec<u8>");

    // バッファから画像を読み込む
    time("image::load_from_memory()");
    let img = load_from_memory(&buffer).expect("Error occurs at load image from buffer.");
    timeEnd("image::load_from_memory()");

    // 指定サイズに画像をリサイズする
    time("image::resize_exact()");
    let resized = img.resize_exact(width as u32, height as u32, imageops::FilterType::Triangle);
    timeEnd("image::resize_exact()");

    // バッファに画像を書き出す
    time("save_to_buffer");
    let result = save_to_buffer(resized, fmt);
    timeEnd("save_to_buffer");

    // バッファから Uint8Array を作成
    time("Vec<u8> to Uint8Array");
    let resp = Uint8Array::new(&unsafe { Uint8Array::view(&result) }.into());
    timeEnd("Vec<u8> to Uint8Array");

    resp
}

// バッファに画像を書き出す
fn save_to_buffer(img: DynamicImage, fmt_str: &str) -> Vec<u8> {
    console_error_panic_hook::set_once();

    let fmt = match fmt_str {
        "png" => ImageOutputFormat::Png,
        "gif" => ImageOutputFormat::Gif,
        "bmp" => ImageOutputFormat::Bmp,
        "jpg" => ImageOutputFormat::Jpeg(80),
        unsupport => ImageOutputFormat::Unsupported(String::from(unsupport)),
    };

    // バッファを確保して画像を書き出す
    let mut result: Vec<u8> = Vec::new();
    img.write_to(&mut result, fmt)
        .expect("Error occurs at save image from buffer.");

    result
}

#[wasm_bindgen]
pub fn resize_image_with_opencv(
    arr: Uint8Array,
    width: usize,
    height: usize,
    fmt: &str,
)  {
    console_error_panic_hook::set_once();

    // Uint8Array から Vec にコピーする
    time("Uint8Array to Vec<u8>");
    let buffer = arr.to_vec();
    timeEnd("Uint8Array to Vec<u8>");
}
