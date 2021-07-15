extern crate base64;
extern crate console_error_panic_hook;
extern crate wasm_bindgen;
extern crate web_sys;

use image::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

// WASMインスタンスのアクセスするメモリへのハンドルを返す
#[wasm_bindgen]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}

// 指定された長さのバッファを確保してポインタを返す
#[wasm_bindgen]
pub fn alloc(len: usize) -> *mut u8 {
    let mut buf = Vec::with_capacity(len);
    let ptr = buf.as_mut_ptr();
    std::mem::forget(buf);
    ptr
}

// 画像を指定の縦横幅にリサイズしてbase64で返す
#[wasm_bindgen]
pub fn resize_image_to_base64(
    ptr: *mut u8,
    len: usize,
    width: usize,
    height: usize,
    fmt: &str,
) -> String {
    // バッファから画像を読み込む
    let img = load_from_buffer(ptr, len);

    // 指定サイズに画像をリサイズする
    let resized = img.resize(width as u32, height as u32, imageops::FilterType::Triangle);
    // バッファに画像を書き出す
    let result = save_to_buffer(resized, fmt);

    // バッファ上の画像をbase64に変換
    let base64 = base64::encode(&result);
    base64
}

// バッファから画像を読み込む
fn load_from_buffer(ptr: *mut u8, len: usize) -> DynamicImage {
    console_error_panic_hook::set_once();
    // 指定されたポインタとバイト長からバッファを取得
    let src = unsafe { Vec::from_raw_parts(ptr, len, len) };
    let img = load_from_memory(&src).expect("Error occurs at load image from buffer.");

    img
}

// バッファに画像を書き出す
fn save_to_buffer(img: DynamicImage, fmt_str: &str) -> Vec<u8> {
    console_error_panic_hook::set_once();

    let fmt = match fmt_str {
        "png" => ImageOutputFormat::Png,
        "gif" => ImageOutputFormat::Gif,
        "bmp" => ImageOutputFormat::Bmp,
        "tga" => ImageOutputFormat::Tga,
        "jpg" => ImageOutputFormat::Jpeg(80),
        unsupport => ImageOutputFormat::Unsupported(String::from(unsupport)),
    };

    // バッファを確保して画像を書き出す
    let mut result: Vec<u8> = Vec::new();
    img.write_to(&mut result, fmt)
        .expect("Error occurs at save image from buffer.");

    log(&format!("result {}", result.len()));

    result
}
