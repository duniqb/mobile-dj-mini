// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //  检查图像内容是否违规
    // 多张图片
    if (Array.isArray(event.img) && event.img.length > 1) {
      console.log('鉴定图片数组：', event.img)
      let imgR;
      for (let i = 0; i < event.img.length; i++) {
        imgR = await cloud.openapi.security.imgSecCheck({
          media: {
            header: {
              'Content-Type': 'application/octet-stream'
            },
            contentType: 'image/png',
            value: Buffer.from(event.img[i])
          }
        })
        if (imgR.errCode == 0) {
          console.log('图片云函数，通过结果：', imgR)
          continue;
        } else if (imgR.errCode == 87014) {
          console.log('图片云函数，违规结果：', imgR)
          break;
        }
      }
      return imgR;
    }
    // 一张图片
    else if (Array.isArray(event.img) && event.img.length == 1) {
      console.log('鉴定单个图片：', event.img)
      return await cloud.openapi.security.imgSecCheck({
        media: {
          header: {
            'Content-Type': 'application/octet-stream'
          },
          contentType: 'image/png',
          value: Buffer.from(event.img)
        }
      })
    }
  } catch (e) {
    return e
  }
}