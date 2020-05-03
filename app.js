//app.js
import {
  host,
  miniSessionUrl,
  miniLoginUrl,
  miniDecryptUrl
} from "./config.js";
App({
  serverUrl: host,
  userInfo: null,
  // 将 user 全局保存在本地缓存，下次打开不用登陆
  setGlobalUserInfo: function (userInfo) {
    wx.setStorageSync("userInfo", userInfo);
  },
  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  },

  globalData: {
    userInfo: null,
    sessionId: '',
    iv: '',
    encryptData: ''
  },
  onLaunch() {
    // 在 app 启动时尝试获取本地 sessionId
    try {
      var value = wx.getStorageSync('sessionId')
      if (value) {
        console.log('本地 sessionId 获取成功', value)
        this.sessionId = value
      }
    } catch (e) {
      console.log('本地 sessionId 获取失败')
    }
    // 检查登录状态，如果登录不存在就立刻登录
    wx.request({
      url: miniSessionUrl,
      data: {
        sessionId: this.sessionId
      },
      success: res => {
        if (res.data.code === 0) {
          console.log("登录态1：" + res.data.msg)
        } else if (res.data.code === 400) {
          console.log("登录态1：" + res.data.msg)
          // 发起登录
          console.log("开始登陆...")
          this.login();
        }
      }
    })
  },

  // 登录
  login() {
    // 官方登录接口
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: miniLoginUrl,
          data: {
            code: res.code
          },
          success: res => {
            if (res.data.code == 0) {
              console.log('sessionId是：' + res.data.data)
              this.sessionId = res.data.data
              // 存储 sessionId
              wx.setStorage({
                key: "sessionId",
                data: res.data.data
              })
              // 再次检查登录态
              wx.request({
                url: miniSessionUrl,
                data: {
                  sessionId: this.sessionId
                },
                success: res => {
                  if (res.data.code === 0) {
                    console.log("登录态2：" + res.data.msg)
                  } else if (res.data.code === 400) {
                    console.log("登录态2：" + res.data.msg)
                    // 发起登录
                    this.login();
                  }
                }
              })
            } else if (res.data.code === 400) {
              console.log("登录成功的返回：", res)
              console.log("获取 sessionId 失败" + res.data.msg)
            }
          }
        })
      }
    })
  },

  // 测试解密
  decryt(sessionId, iv, encryptData) {
    wx.getUserInfo({
      success: res => {
        this.iv = res.iv
        this.encryptData = res.encryptedData
        wx.request({
          url: miniDecryptUrl,
          method: 'post',
          data: {
            sessionId: this.sessionId,
            iv: this.iv,
            encryptData: this.encryptData
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            console.log('解密后：')
            console.log(res)
            return res;
          }
        })
      }
    })
  }
})