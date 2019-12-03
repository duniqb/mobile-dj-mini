const app = getApp()
var config = require('../../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentList: [],
    value: '',
    showRecent: true,
    repairList: [],
    showRepair: false,
  },
  /**
   * 点击评价按钮，去评价页
   */
  bindButton(e) {
    var that = this;
    var listNumber = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../evaluate/evaluate?phone=' + that.data.value + '&listNumber=' + listNumber,
    })
  },
  /**
   * 点击维修单，将电话也传过去，以便可能提交评价需要
   */
  clickItem(e) {
    var that = this;
    wx.navigateTo({
      url: './detail/detail?listNumber=' + e.currentTarget.dataset.id + '&phone=' + that.data.value
    })
  },
  /**
   * 查询进度
   */
  onSearch(e) {
    var that = this;
    if (this.data.value === '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      });
      return;
    }
    // 开始查询，将最新维修隐藏
    if (this.data.value) {
      that.setData({
        showRecent: false
      })
      wx.showLoading({
        title: '正在查询',
      })
      wx.request({
        url: config.logisticsListUrl,
        data: {
          // sessionId: app.sessionId,
          phone: this.data.value
        },
        success: res => {
          if (res.data.meta.status == 200) {
            wx.hideLoading();
            that.setData({
              repairList: res.data.data,
              showRecent: false,
              showRepair: true,
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
    }
  },
  /**
   * 监听查询框改变
   */
  onChange(e) {
    this.setData({
      value: e.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    // 查询最新维修数量
    wx.request({
      url: config.logisticsRecentUrl,
      data: {
        // sessionId: app.sessionId,
      },
      success: res => {
        if (res.data.meta.status == 200) {
          that.setData({
            recentList: res.data.data
          })
        } else if (res.data.meta.status == 400) {
          wx.showToast({
            title: '最新维修数量查询失败',
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