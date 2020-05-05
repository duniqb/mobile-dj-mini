const app = getApp()
import {
  feedDetailUrl
} from '../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    time: '',
    id: '',
    images: []
  },
  /**
   * 显示图片
   * @param {*} event 
   */
  showImg(event) {
    var that = this;
    wx.previewImage({
      current: event.target.id, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.images // 需要预览的图片http链接列表
    })
  },
  /**
   * 处理时间
   * @param {*} timestamp 
   */
  timeFormat(timestamp) {
    var date = timestamp;
    var month = date.getMonth() + 1;
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return date.getFullYear() + '年' + month + '月' + date.getDate() + "日 " + hour + ':' + minute;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    wx.request({
      url: feedDetailUrl + '/' + params.id,
      data: {
        // sessionId: app.sessionId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(res)
          this.setData({
            article: res.data.article,
            time: this.timeFormat(new Date(res.data.article.time)),
            id: params.id,
            // images: res.data.data.images
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
    return {
      title: "【校友圈】" + this.data.info.nickname + "发布了新动态",
      path: '/pages/feed/detail/detail?id=' + this.data.id, // 路径，传递参数到指定页面。
      success: function (res) {},
      fail: function (res) {}
    }
  }
})