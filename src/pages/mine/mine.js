const app = getApp()
import {
  miniRegisterUrl,
  miniQueryUrl,
  miniAddUrl
} from "../../config.js";

Page({
  data: {
    avatarUrl: null,
    nickName: '',
    isRegister: false,
    waveUrl: 'https://mobile-dj.oss-cn-beijing.aliyuncs.com/static/wave.gif',
    backImgUrl: 'https://mobile-dj.oss-cn-beijing.aliyuncs.com/static/back.png'
  },
  onLoad: function () {
    this.userInfo = app.getGlobalUserInfo();
    // 检查是否已注册
    this.checkRegister();
  },

  // 检查是否已注册
  checkRegister() {
    var that = this;
    wx.request({
      url: miniRegisterUrl,
      data: {
        sessionId: app.sessionId
      },
      success: res => {
        if (res.data.code == 0) {
          console.log("是否已注册1：" + res.data.msg)
          // 获取用户数据
          wx.request({
            url: miniQueryUrl,
            data: {
              sessionId: app.sessionId,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: res => {
              that.setData({
                nickName: res.data.data.nickname,
                avatarUrl: res.data.data.avatarUrl
              })
            }
          })
          that.setData({
            isRegister: true
          })
        } else if (res.data.code === 400) {
          console.log("是否已注册2：" + res.data.msg)
        }
      }
    })
  },

  onShow() {
    this.getTabBar().init();
  },
  menuCard: function (e) {
    this.setData({
      menuCard: e.detail.value
    });
  },
  // 获取用户信息事件
  onGotUserInfo: function (e) {
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      return;
    }
    var that = this;
    wx.showLoading({
      title: '正在登录',
    })
    var that = this;
    // 成功获取 userInfo 后给此页面赋值
    this.userInfo = e.detail.userInfo;
    that.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName
    })
    // 保存用户
    wx.request({
      url: miniAddUrl,
      method: 'post',
      data: {
        sessionId: app.sessionId,
        avatarUrl: e.detail.userInfo.avatarUrl,
        city: e.detail.userInfo.city,
        country: e.detail.userInfo.country,
        gender: e.detail.userInfo.gender,
        language: e.detail.userInfo.language,
        nickName: e.detail.userInfo.nickName,
        province: e.detail.userInfo.province
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.code == 0) {
          wx.hideLoading();
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          console.log("保存用户：" + res.data.msg)
          that.setData({
            isRegister: true,
          })
        } else if (res.data.code === 400) {
          wx.hideLoading();
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
          console.log("登录失败：" + res.data.msg)
        }
      }
    })
  }
})