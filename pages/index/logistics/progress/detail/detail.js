const app = getApp()
var config = require('../../../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    description: '',
    id: '',
    room: '',
    showEvaluate: false,
    state: '',
    timeLineList: [],
    title: '',
    phone: '',
    listNumber: ''
  },
  /**
   * 点击评价按钮，去评价页
   */
  bindButton() {
    var that = this;
    wx.navigateTo({
      url: '../../evaluate/evaluate?phone=' + that.data.phone + '&listNumber=' + this.data.listNumber,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    this.setData({
      phone: params.phone
    })
    var that = this;
    wx.showLoading({
      title: '正在查询',
    })
    wx.request({
      url: config.logisticsDetailUrl,
      data: {
        // sessionId: app.sessionId,
        listNumber: params.listNumber
        // listNumber: '00A400B000C000D0_1575347277489'
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          that.setData({
            date: res.data.data.date,
            description: res.data.data.description,
            id: res.data.data.id,
            room: res.data.data.room,
            showEvaluate: res.data.data.showEvaluate,
            state: res.data.data.state,
            timeLineList: res.data.data.timeLineList,
            title: res.data.data.title,
            listNumber: res.data.data.listNumber
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '查询失败',
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