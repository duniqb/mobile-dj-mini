import {
  seekListUrl,
  seekDetailUrl
} from '../../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCount: 0,
    pageSize: 10,
    totalPage: 0,
    currPage: 0,
    seekList: [],
    seek: {}
  },
  /**
   * 人性化时间处理 传入时间戳
   * @param {*} timestamp 
   */
  timeFormat(timestamp, format) {
    var t = new Date(timestamp);
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      }
    })
  },
  /**
   * 显示详情的模态框
   */
  showModal(e) {
    var that = this;
    wx.request({
      url: seekDetailUrl + '/' + e.currentTarget.dataset.id,
      data: {
        // sessionId: app.sessionId,
      },
      success: res => {
        if (res.data.code == 0) {
          // 格式化时间
          res.data.seek.time = that.timeFormat(Date.parse(res.data.seek.time), 'yyyy-MM-dd HH:mm')

          that.setData({
            seek: res.data.seek
          })
          that.setData({
            // modalName: e.currentTarget.dataset.target
            modalName: e.currentTarget.dataset.target,
          })
        } else if (res.data.code == 400) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: seekListUrl,
      data: {
        // sessionId: app.sessionId,
        type: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = new String(res.data.page.list[i].time).slice(11, 16)
            res.data.page.list[i].date = new String(res.data.page.list[i].date).slice(5)
          }
          that.setData({
            seekList: res.data.page.list,
            totalCount: res.data.page.totalCount,
            pageSize: res.data.page.pageSize,
            totalPage: res.data.page.totalPage,
            currPage: res.data.page.currPage,
          })
        } else if (res.data.code == 400) {
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