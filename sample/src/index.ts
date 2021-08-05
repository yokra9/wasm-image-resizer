import type * as WASM from "wasm-image-resizer"

type Wasm = typeof WASM;
type Window = {
  resizeImageLegacy: Function,
  resizeImageWasm: Function,
  resizeImageCV: Function,
  cv: any,
}
declare var window: Window;

const url = `./img/${location.href.split('/').pop()}.jpg`;
const resp = await fetch(url);

const b = await resp.blob();

/* -- Canvas API でリサイズ -- */
window.resizeImageLegacy = async () => {

  console.time("##### resizeImageLegacy #####");
  const blob1 = await resizeImageLegacy(b, 512, 512);
  console.timeEnd("##### resizeImageLegacy #####");

  // 画面上に処理結果を表示する
  describeImageFromBlob(blob1, "sample1");
};

/* -- WASM でリサイズ -- */
window.resizeImageWasm = async () => {
  // WASMのShimを動的インポートする
  const js = import("wasm-image-resizer");
  js.then(async wasm => {

    console.time("##### WebAssembly #####");
    const blob2 = await resizeImageWasm(b, 512, 512, wasm);
    console.timeEnd("##### WebAssembly #####");

    // 画面上に処理結果を表示する
    describeImageFromBlob(blob2, "sample2");
  });
};

/* -- OpenCV.js でリサイズ -- */
const cvVer = "master";
const script = document.createElement("script");
script.src = `https://docs.opencv.org/${cvVer}/opencv.js`;
script.onload = async () => {
  window.resizeImageCV = async () => {
    console.time("##### OpenCV.js #####");
    const blob3 = await resizeImageCV(b, 512, 512, window.cv);
    console.timeEnd("##### OpenCV.js #####");

    // 画面上に処理結果を表示する
    describeImageFromBlob(blob3, "sample3");
  }
};
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

/**
 * resize image(WASM)
 * @param {Blob} file image
 * @param {number} width width
 * @param {number} height height
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
 * resize image(OpenCV)
 * @param {Blob} file image
 * @param {number} width width
 * @param {number} height height
 * @param {any} cv OpenCV.js 
 * @returns {Promise<Blob>} image
 */
function resizeImageCV(file: Blob, width: number, height: number, cv: any): Promise<Blob> {
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

      console.time("create dense array");
      let src = cv.imread(image);
      let dst = new cv.Mat();
      console.timeEnd("create dense array");

      console.time("cv::resize()");
      let dsize = new cv.Size(width, height);
      cv.resize(src, dst, dsize, 0, 0, cv.INTER_LINEAR_EXACT);
      console.timeEnd("cv::resize()");

      console.time("cv::imshow()");
      cv.imshow(canvas, dst);
      console.timeEnd("cv::imshow()");

      console.time("delete dense array");
      src.delete();
      dst.delete();
      console.timeEnd("delete dense array");

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
