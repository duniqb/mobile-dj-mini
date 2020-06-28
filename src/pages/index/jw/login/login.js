const app = getApp()
import { jwLoginUrl, jwVerifyUrl } from '../../../../config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    verifyUrl: '',
    stuNo: '',
    password: '',
    verify: ''
  },
  /**
   * 登录教务
   */
  loginJW() {
    var that = this;
    if (this.data.stuNo == '' || this.data.password == '') {
      wx.showToast({
        title: '请填写登录信息',
        icon: 'none'
      })
      return;
    }
    // 发起登录
    wx.showLoading({
      title: '正在登录',
    })
    // 取出Cookie
    let cookie = wx.getStorageSync('cookieKey');
    let header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: jwLoginUrl,
      data: {
        sessionId: app.sessionId,
        stuNo: that.data.stuNo,
        password: that.data.password,
        verifyCode: that.data.verify,
      },
      header,
      success: res => {
        if (res.data.code == 0) {
          console.log(res.data)
          wx.hideLoading();
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000
          })
          wx.navigateBack({
            complete: (res) => { },
          })
          wx.setStorageSync('stuNo', that.data.stuNo);
          wx.setStorageSync('password', that.data.password);
        } else if (res.data.code == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '登录失败，请检查后重新登录',
            icon: 'none',
            duration: 2000
          })
          that.changeVerify();
        }
      }
    })
  },
  /**
   * 监听输入框改变
   */
  onStuNoChange(event) {
    console.log(event.detail.value)
    this.setData({
      stuNo: event.detail.value,
    })
  },
  onPasswordChange(event) {
    this.setData({
      password: event.detail.value,
    })
  },
  onVerifyChange(event) {
    this.setData({
      verify: event.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var stuNo = wx.getStorageSync('stuNo')
      if (stuNo) {
        this.setData({
          stuNo: stuNo,
        })
      }
    } catch (e) {
    }
    try {
      var password = wx.getStorageSync('password')
      if (password) {
        this.setData({
          password: password,
        })
      }
    } catch (e) {
    }
    this.changeVerify();
  },
  /**
   * 退出教务登录
   */
  exitJwBtn: function () {
    var that = this;
    wx.showModal({
      title: '退出登录',
      content: '即将退出登录，这将删除所有的登录信息，确认继续？',
      success(res) {
        if (res.confirm) {
          that.exitJw();
        } else if (res.cancel) { }
      }
    })
  },
  /**
   * 改变验证码
   */
  changeVerify() {
    var that = this;
    wx.request({
      url: jwVerifyUrl,
      data: {
        sessionId: app.sessionId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.code === 0) {
          console.log(res)
          // 保存 Cookie 到 Storage
          if (res && res.header && res.header['Set-Cookie']) {
            wx.setStorageSync('cookieKey', res.header['Set-Cookie']);
          }
          that.setData({
            verifyUrl: res.data.url
          })
        } else if (res.data.code === 400) { }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})