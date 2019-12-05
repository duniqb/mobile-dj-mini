const app = getApp()
var config = require("../../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jwExist: false,
    name: null,
    verifyUrl: '',
    stuNo: '',
    password: '',
    verify: ''
  },
  /**
   * 登录按钮
   */
  loginBtn() {
    var that = this;
    if (this.data.stuNo == '' || this.data.password == '' || this.data.verify == '') {
      wx.showToast({
        title: '请填写登录信息',
        icon: 'none'
      })
      return;
    }
    wx.showModal({
      title: '登录教务',
      content: '确认登录？',
      success(res) {
        if (res.confirm) {
          that.loginJW();
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 登录教务
   */
  loginJW() {
    var that = this;
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
      url: config.jwLoginUrl,
      data: {
        sessionId: app.sessionId,
        stuNo: that.data.stuNo,
        password: that.data.password,
        verifyCode: that.data.verify,
      },
      header,
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000
          })
          wx.setStorageSync('stuNo', that.data.stuNo);
          wx.setStorageSync('password', that.data.password);
          this.checkLogin();
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '登录失败',
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
  onLoad: function(options) {
    // 检查是否已登录教务
    this.checkLogin();
  },
  /**
   * 退出教务登录
   */
  exitJwBtn: function() {
    var that = this;
    wx.showModal({
      title: '退出登录',
      content: '即将退出登录，这将删除所有的登录信息，确认继续？',
      success(res) {
        if (res.confirm) {
          that.exitJw();
        } else if (res.cancel) {}
      }
    })
  },
  exitJw: function() {
    var that = this;
    wx.showLoading({
      title: '正在退出',
    })
    wx.request({
      url: config.jwClearUrl,
      data: {
        sessionId: app.sessionId
      },
      success: res => {
        if (res.data.meta.status === 200) {
          wx.hideLoading();
          wx.showToast({
            title: '退出成功',
            icon: 'none',
            duration: 2000
          })
          var stuNo = wx.getStorageSync('stuNo');
          var password = wx.getStorageSync('password');
          that.setData({
            jwExist: false,
            name: null,
            stuNo: stuNo,
            password: password
          })

          this.changeVerify();
        } else if (res.data.meta.status === 400) {
          wx.hideLoading();
          wx.showToast({
            title: '退出失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 检查是否已登录教务
   */
  checkLogin: function() {
    wx.showLoading({
      title: '正在查询',
    })
    var that = this;
    wx.request({
      url: config.jwExistUrl,
      data: {
        sessionId: app.sessionId
      },
      success: res => {
        if (res.data.meta.status === 200) {
          wx.hideLoading();
          that.setData({
            jwExist: true,
            name: res.data.data
          })
        } else if (res.data.meta.status === 400) {
          wx.hideLoading();
          var stuNo = wx.getStorageSync('stuNo');
          var password = wx.getStorageSync('password');
          that.setData({
            jwExist: false,
            stuNo: stuNo,
            password: password
          })
          // 验证码
          that.changeVerify();
        }
      }
    })
  },
  /**
   * 改变验证码
   */
  changeVerify() {
    var that = this;
    wx.request({
      url: config.jwVerifyUrl,
      data: {
        // sessionId: app.sessionId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.meta.status === 200) {
          // 保存 Cookie 到 Storage
          if (res && res.header && res.header['Set-Cookie']) {
            wx.setStorageSync('cookieKey', res.header['Set-Cookie']);
          }
          that.setData({
            verifyUrl: res.data.data
          })
        } else if (res.data.meta.status === 400) {}
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})