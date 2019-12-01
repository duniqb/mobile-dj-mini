const app = getApp()
var config = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    verifyCode: '',
    verifyUrl: '',
  },
  onClickIcon() {
    wx.showToast({
      icon: 'none',
      title: '新生密码为身份证号后6位（除X外）'
    });
  },
  onChange1(e) {
    console.log(e)
    this.setData({
      username: e.detail
    });
  },
  onChange2(e) {
    this.setData({
      password: e.detail
    });
  },
  onChange3(e) {
    this.setData({
      verifyCode: e.detail
    });
  },
  /**
   * 改变验证码
   */
  changeVerify() {
    var that = this;
    wx.request({
      url: config.cardVerifyUrl,
      data: {
        // sessionId: app.sessionId
      },
      success: res => {
        if (res.data.meta.status === 200) {
          that.setData({
            verifyUrl: res.data.data
          })
        } else if (res.data.meta.status === 400) {
          console.log("验证码失败 " + res.data.meta.msg)
        }
      }
    })
  },
  /**
   * 提交登录表单
   */
  post() {
    var that = this;
    wx.request({
      url: config.cardLoginUrl,
      data: {
        // sessionId: app.sessionId
        username: this.data.username,
        password: this.data.password,
        verifyCode: this.data.verifyCode
      },
      success: res => {
        if (res.data.meta.status === 200) {
          console.log(res.data)
          // that.setData({
          //   verifyUrl: res.data.data
          // })
        } else if (res.data.meta.status === 400) {
          console.log("验证码失败 " + res.data.meta.msg)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  onShareAppMessage: function() {

  }
})