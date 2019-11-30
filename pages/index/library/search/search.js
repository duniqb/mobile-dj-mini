const app = getApp()
var config = require('../../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    bookDetail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    var that = this;
    wx.showLoading({
      title: '正在搜索',
    })
    wx.request({
      url: config.queryUrl,
      data: {
        // sessionId: app.sessionId,
        name: params.name
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          that.setData({
            list: res.data.data
          })
          console.log(that.data.list)
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '搜索失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 显示图书详情的模态框
   */
  showModal(e) {
    var that = this;
    wx.request({
      url: config.showUrl,
      data: {
        // sessionId: app.sessionId,
        id: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.meta.status == 200) {
          that.setData({
            bookDetail: res.data.data
          })
          that.setData({
            // modalName: e.currentTarget.dataset.target
            modalName: e.currentTarget.dataset.target,
          })
        } else if (res.data.meta.status == 400) {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
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