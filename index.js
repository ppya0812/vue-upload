export default const upload = (imgSrc, type) => {
  let img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = imgSrc
  img.onload = () => {
    // 默认按比例压缩
    let w = img.width || 128
    let h = img.height || 96
    let quality = 0.5  // 默认图片质量为0.5
    //生成canvas
    let canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    // 图像质量 quality
    // quality值越小，所绘制出的图像越模糊
    let base64Img = canvas.toDataURL('image/jpeg', quality)
    // 回调函数返回base64的值
    if (type === 'formData') {
      // 二进制流文件
      let picFile = convertBase64UrlToBlob(base64Code)
      return formDataUpload（picFile）
    } else {
      return fileUpload(picFile)
    }
  }
}

export const convertBase64UrlToBlob = (base64Code) => {
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
  return new window.Blob([ab], { type: picType })
}

function formDataUpload(picFile) {
  // type formData
  let formData = new window.FormData()
  formData.append('file', picFile)
      // formData为传给后端的文件流
  return {
    options: {},
    params: picFile
  }
}

function fileUpload(picFile) {
  // filereader
  let reader = new FileReader()
  reader.readAsBinaryString(picFile)
  reader.onloadend = () => {
    console.log('reader.result', reader.result)
    if (reader.error) { 
      console.log(reader.error)
      return
    }
    const params = {
      file: reader.result
    }
    // 手动拼接reques payload
    let boundary = '----------' + Date.now().toString(16)
    let fileData = "--" + boundary
                  + "\r\nContent-Disposition: form-data; name=\"file\"; filename=\"1.jpeg\""
                  + "\r\nContent-Type: image/jpeg"
                  + "\r\n\r\n" + params.file + "\r\n"

    fileData += "--" + boundary + "--\r\n"
    let nBytes = fileData.length
    let ui8Data = new Uint8Array(nBytes)
    for (var i = 0; i < nBytes; i++) {
      ui8Data[i] = fileData.charCodeAt(i) & 0xff
    }
      
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: ui8Data
    }
    return {
      options: options,
      params: ui8Data
    }
  }
}

