//app.js
var config = require("./config.js")
App({
  onLaunch: function() {
    // 在 app 启动时尝试获取本地 sessionId
    try {
      var value = wx.getStorageSync('sessionId')
      if (value) {
        console.log('sessionId 获取成功')
        this.sessionId = value
        console.log(value)
      }
    } catch (e) {
      console.log('sessionId 获取失败')
    }
    // 在 app 启动时检查登录状态，如果登录不存在就立刻登录
    wx.request({
      url: config.sessionUrl,
      data: {
        sessionId: this.sessionId
      },
      success: res => {
        if (res.data.meta.status === 200) {
          console.log("登录状态1：" + res.data.meta.msg)
        } else if (res.data.meta.status === 400) {
          console.log("登录状态1：" + res.data.meta.msg)
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
        console.log(res)
        wx.request({
          url: config.loginUrl,
          data: {
            code: res.code
          },
          success: res => {
            console.log('sessionId是：' + res.data.data)
            this.sessionId = res.data.data
            // 存储 sessionId
            wx.setStorage({
              key: "sessionId",
              data: res.data.data
            })

            wx.request({
              url: config.sessionUrl,
              data: {
                sessionId: this.sessionId
              },
              success: res => {
                if (res.data.meta.status === 200) {
                  console.log("登录状态2：" + res.data.meta.msg)
                } else if (res.data.meta.status === 400) {
                  console.log("登录状态2：" + res.data.meta.msg)
                }
              }
            })
          }
        })
      }
    })
  },

  // 测试解密
  decryt: function() {
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
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    sessionId: '',
    iv: '',
    encryptData: ''
  }
})