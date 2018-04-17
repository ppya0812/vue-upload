import ajax from './ajax'
import upload from '../index'

// file
function uploadPic (imgSrc) {
  const data = upload(imgSrc)
  return new Promise((resolve, reject) => {
    ajax(data.options).post(`${APIHOST}/newretail/common/uploadpicture`, data.params)
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      reject && reject(err)
    })
  })
}
