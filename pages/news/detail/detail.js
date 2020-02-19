const app = getApp()
import {
  detailUrl
} from "../../../config.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    time: '',
    from: '',
    browse: '',
    content: [],
    image: [],
    type: '',
    id: ''
  },
  /**
   * 显示图片
   * @param {*} event 
   */
  showImg(event) {
    var that = this;
    wx.previewImage({
      current: event.target.dataset.images, // 当前显示图片的http链接
      urls: that.data.image // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: detailUrl,
      data: {
        // sessionId: app.sessionId,
        type: params.type,
        id: params.id
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          this.setData({
            title: res.data.data.title,
            time: res.data.data.time,
            from: res.data.data.from,
            browse: res.data.data.browse + '浏览',
            content: res.data.data.content,
            image: res.data.data.image,
            type: params.type,
            id: params.id
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          duration: 2000
        })
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
  onShareAppMessage: function (ops) {
    // 1：交大要闻 2：综合报道 ，3：通知公告
    if (this.data.type == 1) {
      var desc = "【交大要闻】";
    } else if (this.data.type == 2) {
      var desc = "【综合报道】";
    } else if (this.data.type == 3) {
      var desc = "【通知公告】";
    }
    return {
      title: desc + this.data.title,
      path: '/pages/news/detail/detail?id=' + this.data.id + "&type=" + this.data.type, // 路径，传递参数到指定页面。
      success: function (res) {},
      fail: function (res) {}
    }
  }
})