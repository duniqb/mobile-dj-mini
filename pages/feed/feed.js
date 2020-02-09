const app = getApp()
var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 10,
    feedList: []
  },
  /**
   * 到详情页
   * @param {*} event 
   */
  toDetail: function (event) {
    wx.navigateTo({
      url: './detail/detail?id=' + event.target.id
    })
  },
  /**
   * 显示图片
   * @param {*} event 
   */
  showImg(event) {
    wx.previewImage({
      current: event.target.id, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.images // 需要预览的图片http链接列表
    })
  },
  /**
   * 人性化时间处理 传入时间戳
   * @param {*} timestamp 
   */
  timeFormat(timestamp) {
    var result = '';
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp;
    if (diffValue < 0) {
      return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
      result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else if (minC < 1) {
      result = "刚刚";
    }
    return result;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.feedListUrl,
      data: {
        page: that.data.page,
        size: that.data.size
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.meta.status == 200) {
          console.log(res.data.data)
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].time = that.timeFormat(Date.parse(res.data.data[i].time))
          }
          that.setData({
            feedList: res.data.data
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
    this.getTabBar().init()
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