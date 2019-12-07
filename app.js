//app.js
var config = require("./config.js")
App({
  serverUrl: "http://192.168.1.10:8080",
  userInfo: null,
  // 将 user 全局保存在本地缓存，下次打开不用登陆
  setGlobalUserInfo: function(userInfo) {
    wx.setStorageSync("userInfo", userInfo);
  },
  getGlobalUserInfo: function() {
    return wx.getStorageSync("userInfo");
  },

  globalData: {
    userInfo: null,
    sessionId: '',
    iv: '',
    encryptData: ''
  },
  onLaunch: function() {
    // 在 app 启动时尝试获取本地 sessionId
    try {
      var value = wx.getStorageSync('sessionId')
      if (value) {
        console.log('本地 sessionId 获取成功')
        this.sessionId = value
        console.log(value)
      }
    } catch (e) {
      console.log('本地 sessionId 获取失败')
    }
    // 检查登录状态，如果登录不存在就立刻登录
    wx.request({
      url: config.sessionUrl,
      data: {
        sessionId: this.sessionId
      },
      success: res => {
        if (res.data.meta.status === 200) {
          console.log("登录态1：" + res.data.meta.msg)
        } else if (res.data.meta.status === 400) {
          console.log("登录态1：" + res.data.meta.msg)
          // 发起登录
          this.login();
        }
      }
    })
  },

  // 登录
  login: function() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: config.loginUrl,
          data: {
            code: res.code
          },
          success: res => {
            if (res.data.meta.status === 200) {
              console.log('sessionId是：' + res.data.data)
              this.sessionId = res.data.data
              // 存储 sessionId
              wx.setStorage({
                key: "sessionId",
                data: res.data.data
              })
              // 再次检查登录态
              wx.request({
                url: config.sessionUrl,
                data: {
                  sessionId: this.sessionId
                },
                success: res => {
                  if (res.data.meta.status === 200) {
                    console.log("登录态2：" + res.data.meta.msg)
                  } else if (res.data.meta.status === 400) {
                    console.log("登录态2：" + res.data.meta.msg)
                    // 发起登录
                    this.login();
                  }
                }
              })
            } else if (res.data.meta.status === 400) {
              console.log("获取 sessionId 失败" + res.data.meta.msg)
            }
          }
        })
      }
    })
  },

  // 测试解密
  decryt: function(sessionId, iv, encryptData) {
    wx.getUserInfo({
      success: res => {
        console.log(res);
        this.iv = res.iv
        this.encryptData = res.encryptedData
        wx.request({
          url: config.decryptUrl,
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