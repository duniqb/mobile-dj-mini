const app = getApp()
import { cardLoginUrl, cardVerifyUrl } from '../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuNo: '',
    password: '',
    verifyCode: '',
    cardLogin: false,
    cardInfo: null
  },
  /**
   * 登录按钮
   */
  loginBtn() {
    var that = this;
    if (this.data.stuNo == '' || this.data.password == '') {
      wx.showToast({
        title: '请填写登录信息',
        icon: 'none'
      })
      return;
    }
    wx.showModal({
      title: '登录一卡通',
      content: '确认登录？',
      success(res) {
        if (res.confirm) {
          that.loginCard();
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 登录
   */
  loginCard() {
    var that = this;
    // 发起登录
    wx.showLoading({
      title: '正在登录',
    })
    // 取出Cookie
    let cookie = wx.getStorageSync('cardCookieKey');
    let header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: cardLoginUrl,
      data: {
        stuNo: that.data.stuNo,
        password: that.data.password,
        verifyCode: that.data.verifyCode,
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

          that.setData({
            cardLogin: true,
            cardInfo: res.data.data
          })
          wx.setStorageSync('stuNo', that.data.stuNo);
          wx.setStorageSync('passwordCard', that.data.password);
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
      verifyCode: event.detail.value,
    })
  },
  /**
   * 改变验证码
   */
  changeVerify() {
    var that = this;
    wx.request({
      url: cardVerifyUrl,
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
            wx.setStorageSync('cardCookieKey', res.header['Set-Cookie']);
          }
          that.setData({
            verifyUrl: res.data.data
          })
        } else if (res.data.meta.status === 400) {}
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '验证码加载失败',
          showCancel: false,
          content: '请检查学校一卡通能否访问\n http://ykt.djtu.edu.cn'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var stuNo = wx.getStorageSync('stuNo');
    var password = wx.getStorageSync('passwordCard');
    this.setData({
      cardLogin: false,
      name: null,
      stuNo: stuNo,
      password: password
    })

    this.changeVerify();
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
  onShareAppMessage: function(ops) {}
})