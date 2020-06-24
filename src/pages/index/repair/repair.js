const app = getApp()
import { repairNoticeUrl } from '../../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeTitle: '',
    noticeContent: '',
    noticeDate: '',
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
  onLoad: function (options) {
    var that = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    // 查询通知
    wx.request({
      url: repairNoticeUrl,
      data: {
        // sessionId: app.sessionId,
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(res)
          that.setData({
            noticeTitle: res.data.data.title,
            noticeContent: res.data.data.content,
            noticeDate: res.data.data.date
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