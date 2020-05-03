const app = getApp()
import { repairEvaluateUrl, repairDetailUrl } from '../../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    description: '',
    id: '',
    room: '',
    title: '',
    phone: '',
    listNumber: '',
    message: '',
    value: 3,
    showEvaluate: true
  },
  /**
   * 提交评价
   */
  submitEvaluate() {
    var that = this;
    if (that.data.message) {
      wx.showLoading({
        title: '正在提交',
      })
      wx.request({
        url: repairEvaluateUrl,
        data: {
          // sessionId: app.sessionId,
          phone: this.data.phone,
          listNumber: this.data.listNumber,
          listWord: this.data.message,
          listScore: this.data.value
        },
        success: res => {
          if (res.data.meta.status == 200) {
            wx.hideLoading();
            that.setData({
              showEvaluate: false
            })
            wx.navigateBack({
              delta: 1
            })
          } else if (res.data.meta.status == 400) {
            wx.hideLoading();
            wx.showToast({
              title: '评价失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
  /**
   * 点击评价按钮
   */
  bindButton() {
    var that = this;
    if (this.data.message === '') {
      wx.showToast({
        title: '请输入评价',
        icon: 'none'
      });
      return;
    }
    wx.showModal({
      title: '提交评价',
      content: '即将提交评价，确认继续？',
      success(res) {
        if (res.confirm) {
          that.submitEvaluate();
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 监听评分改变
   */
  onRateChange(event) {
    this.setData({
      value: event.detail
    });
  },
  /**
   * 监听输入框改变
   */
  onMessageChange(event) {
    this.setData({
      message: event.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      phone: params.phone,
      listNumber: params.listNumber
    })
    var that = this;
    wx.showLoading({
      title: '正在查询',
    })
    wx.request({
      url: repairDetailUrl,
      data: {
        // sessionId: app.sessionId,
        listNumber: params.listNumber
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          that.setData({
            date: res.data.data.date,
            description: res.data.data.description,
            id: res.data.data.id,
            room: res.data.data.room,
            title: res.data.data.title,
            showEvaluate: res.data.data.showEvaluate
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
    return {
      title: '我发现一个很有用的校园小程序，推荐给你~',
      path: 'pages/index/index', // 路径，传递参数到指定页面。
      success: function(res) {},
      fail: function(res) {}
    }
  }
})