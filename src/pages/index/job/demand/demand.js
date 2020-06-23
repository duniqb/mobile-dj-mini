const app = getApp()
var config = require('../../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    releaseDate: '',
    from: '',
    browser: '',
    content: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.jobDemandUrl,
      data: {
        // sessionId: app.sessionId,
        id: params.id
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(res.data)
          wx.hideLoading();
          this.setData({
            title: res.data.data.title,
            releaseDate: res.data.data.releaseDate,
            from: res.data.data.from,
            browser: res.data.data.browser + '浏览',
            content: res.data.data.content,
          })
        } else if (res.data.code == 400) {
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
    return {
      title: '我发现一个很有用的校园小程序，推荐给你~',
      path: 'pages/index/index', // 路径，传递参数到指定页面。
      success: function(res) {},
      fail: function(res) {}
    }
  }
})