const app = getApp()
var config = require('../../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.jwNoticeUrl,
      data: {
        // sessionId: app.sessionId
        id: params.id
      },
      success: res => {
        if (res.data.meta.status === 200) {
          wx.hideLoading();
          that.setData({
            notice: res.data.data
          })
        } else if (res.data.meta.status === 400) {
          wx.hideLoading();
          wx.showToast({
            title: '没有记录',
            icon: 'none',
            duration: 2000
          })
        }
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