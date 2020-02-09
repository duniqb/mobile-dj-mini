const app = getApp()
var config = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    time: ''
  },
  /**
   * 处理时间
   * @param {*} timestamp 
   */
  timeFormat(timestamp) {
    var date = timestamp;
    var month = date.getMonth() + 1;
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return date.getFullYear() + '年' + month + '月' + date.getDate() + "日 " + hour + ':' + minute;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    console.log(params.id)
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.feedDetailUrl,
      data: {
        // sessionId: app.sessionId,
        id: params.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          console.log(res.data.data)
          this.setData({
            info: res.data.data,
            time: this.timeFormat(new Date(res.data.data.time))
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
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