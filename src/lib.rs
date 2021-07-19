extern crate console_error_panic_hook;
extern crate serde;
extern crate wasm_bindgen;
extern crate web_sys;

use image::*;
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
pub struct BufferValue {
    ptr: usize,
    len: usize,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn time(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn timeEnd(s: &str);

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

// 画像を指定の縦横幅にリサイズして、ポインタとデータ長を返却する
#[wasm_bindgen]
pub fn resize_image(ptr: *mut u8, len: usize, width: usize, height: usize, fmt: &str) -> JsValue {
    console_error_panic_hook::set_once();

    
    time("load_from_buffer");
    // バッファから画像を読み込む
    let img = load_from_buffer(ptr, len);
    timeEnd("load_from_buffer");
    
    // 指定サイズに画像をリサイズする
    time("thumbnail");
    let resized = img.thumbnail(width as u32, height as u32);
    // バッファに画像を書き出す
    let mut result = save_to_buffer(resized, fmt);
    timeEnd("thumbnail");
    
    time("BufferValue");
    // バッファのポインタとデータ長をJSに返却する
    let location = BufferValue {
        ptr: result.as_mut_ptr() as usize,
        len: result.len(),
    };
    timeEnd("BufferValue");
    JsValue::from_serde(&location).expect("Error occurs at JSON serialization.")
}

// バッファから画像を読み込む
fn load_from_buffer(ptr: *mut u8, len: usize) -> DynamicImage {
    console_error_panic_hook::set_once();
    // 指定されたポインタとデータ長からバッファを取得

    
    time("from_raw_parts");
    let src = unsafe { Vec::from_raw_parts(ptr, len, len) };    
    timeEnd("from_raw_parts");
    
    time("load_from_memory");
    let img = load_from_memory(&src).expect("Error occurs at load image from buffer.");
    timeEnd("load_from_memory");

    img
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
