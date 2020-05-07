// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let msgR = {
    errCode: 0,
    errMsg: ''
  };
  let imgR = {
    errCode: 0,
    errMsg: ''
  };
  try {
    //  检查文本内容是否违规
    if (event.msg) {
      msgR = await cloud.openapi.security.msgSecCheck({
        content: event.msg
      })
    }
    //  检查图像内容是否违规
    if (event.img) {
      imgR = await cloud.openapi.security.imgSecCheck({
        media: {
          header: {
            'Content-Type': 'application/octet-stream'
          },
          contentType: 'image/png',
          value: Buffer.from(event.img)
        }
      })
    }
    return {
      msgR,
      imgR
    };
  } catch (e) {
    return e
  }
}