// 云函数入口文件
import { init, getWXContext } from 'wx-server-sdk'

init()

// 云函数入口函数
export async function main(event, context) {
  const wxContext = getWXContext()

  return {
    sum: event.a + event.b
  }
}