const app = getApp()
var config = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeShow: false,
    noticeTitle: '旅顺一期今日检查水电',
    noticeContent: '旅顺一期今日检查水电，，旅顺一期今日检查水电，，旅顺一期今日检查水电，，旅顺一期今日检查水电，，旅顺一期今日检查水电，',
    noticeDate: '2019-10-10',
    iconList: [{
      icon: 'repair',
      color: 'red',
      badge: 0,
      name: '故障报修'
    }, {
      icon: 'search',
      color: 'orange',
      badge: 0,
      name: '进度查询'
    }, {
      icon: 'appreciate',
      color: 'green',
      badge: 0,
      name: '维修评价'
    }, {
      icon: 'phone',
      color: 'blue',
      badge: 0,
      name: '维修电话',
      id: 3
    }],
    gridCol: 3,
  },
  /**
   * 拨打电话
   */
  bindPhone(e) {
    if (e.currentTarget.dataset.id == 0) {
      wx.makePhoneCall({
        phoneNumber: '041186223765' // 旅顺1
      })
    } else if (e.currentTarget.dataset.id == 1) {
      wx.makePhoneCall({
        phoneNumber: '041186223769' //旅顺2
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.makePhoneCall({
        phoneNumber: '041184108410' //沙河口
      })
    }
  },
  /**
   * 点击九宫格
   */
  showModalGrid(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    // 查询通知
    wx.request({
      url: config.logisticsNoticeUrl,
      data: {
        // sessionId: app.sessionId,
      },
      success: res => {
        if (res.data.meta.status == 200) {
          // if (res.data.data.content != '') {
          that.setData({
            noticeShow: true,
            // noticeTitle: res.data.data.title,
            // noticeContent: res.data.data.content,
            // noticeDate: res.data.data.date
          })
          // }
        } else if (res.data.meta.status == 400) {
          wx.showToast({
            title: '查询通知失败',
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