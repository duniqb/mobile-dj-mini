const app = getApp()
import {
  feedDetailUrl,
  feedLikeTitleUrl
} from '../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: {},
    time: '',
    id: ''
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
   * 点赞文章或取消
   * @param {*} event 
   */
  likeTitle: function (event) {
    var that = this;
    wx.request({
      url: feedLikeTitleUrl,
      data: {
        sessionId: app.sessionId,
        articleId: event.target.id
      },
      success(res) {
        if (res.data.code == 0 || res.data.code == 1) {
          console.log('点赞结果', res.data)
          // 修改该文章的点赞红心状态和数字
          var articleNew = that.data.article;
          articleNew.likeCount = res.data.likeCount;
          if (res.data.code == 0) {
            articleNew.isLike = true;
          } else if (res.data.code == 1) {
            articleNew.isLike = false;
          }
          that.setData({
            article: articleNew
          })
        }
        // 点赞失败
        else if (res.data.code == 400) {
          console.log(res.data.msg)
          wx.showToast({
            title: '操作失败',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    wx.request({
      url: feedDetailUrl,
      data: {
        sessionId: app.sessionId,
        id: params.id
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(res)
          this.setData({
            article: res.data.article,
            time: this.timeFormat(new Date(res.data.article.time)),
            id: params.id
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
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: feedDetailUrl,
      data: {
        sessionId: app.sessionId,
        id: that.data.article.id
      },
      success: res => {
        if (res.data.code == 0) {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
          console.log(res)
          this.setData({
            article: res.data.article
          })
        } else if (res.data.meta.status == 400) {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: '刷新失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
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