const app = getApp()
var config = require("../../../config.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    time: '',
    from: '',
    browse: 0,
    content: [],
    image: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.detailUrl,
      data: {
        // sessionId: app.sessionId,
        type: params.type,
        id: params.id
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          this.setData({
            title: res.data.data.title,
            time: res.data.data.time,
            from: res.data.data.from,
            browse: res.data.data.browse,
            content: res.data.data.content,
            image: res.data.data.image
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