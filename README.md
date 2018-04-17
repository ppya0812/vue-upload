##
```
convertBase64UrlToBlob(base64Code) {
  /**
    * 将以base64的图片url数据转换为Blob
    * @param urlData
    *        用url方式表示的base64图片数据
    */
  // 去掉url的头，并转换为byte
  let [picHeader, picBody] = base64Code.split(',')
  let picType= picHeader.match(/:(.*?);/)[1]
  let bytes = window.atob(picBody)

  // 处理异常, 将 ascii 码小于 0 的转换为大于 0
  let ab = new ArrayBuffer(bytes.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  <!-- return new window.Blob([ab], { type: picType }) -->
  return this.ArrayBufferToString(ab) // 等同于fileReader
},
ArrayBufferToString(buffer) {
  return this.BinaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
},
BinaryToString(binary) {
  var error;
  try {
      return decodeURIComponent(escape(binary));
  } catch (_error) {
      error = _error;
      if (error instanceof URIError) {
          return binary;
      } else {
          throw error;
      }
  }
}

```
