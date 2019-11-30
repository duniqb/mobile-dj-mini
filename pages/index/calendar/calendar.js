const app = getApp()
var config = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayOfTerm: null,
    endOfTermDay: null,
    endOfVacationDay: null,
    weekOfTerm: null,
    weekOfYear: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: config.calendarUrl,
      data: {
        // sessionId: app.sessionId,
      },
      success: res => {
        if (res.data.meta.status == 200) {
          that.setData({
            dayOfTerm: res.data.data.dayOfTerm,
            endOfTermDay: res.data.data.endOfTermDay,
            endOfVacationDay: res.data.data.endOfVacationDay,
            weekOfTerm: res.data.data.weekOfTerm,
            weekOfYear: res.data.data.weekOfYear
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