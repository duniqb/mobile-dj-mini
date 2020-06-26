const app = getApp()
import {
  libraryQueryUrl,
  libraryShowUrl,
  libraryLikeUrl,
  libraryIsLikeUrl
} from '../../../../config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLike: false,
    list: [],
    bookDetail: null,
    name: ''
  },
  /**
     * 收藏或取消收藏图书
     */
  likeBook() {
    var that = this;
    var sessionId = app.sessionId;
    var book = {
      "author": this.data.bookDetail.author,
      "bookId": this.data.bookDetail.id,
      "bookName": this.data.bookDetail.bookName
    }
    wx.request({
      url: libraryLikeUrl + '?sessionId=' + sessionId,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(book),
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            isLike: res.data.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    wx.showLoading({
      title: '正在搜索',
    })
    wx.request({
      url: libraryQueryUrl,
      data: {
        // sessionId: app.sessionId,
        name: params.name
      },
      timeout: 5000,
      success: res => {
        console.log(res)
        if (res.data.code == 0) {
          wx.hideLoading();
          that.setData({
            list: res.data.data,
            name: params.name
          })
        } else if (res.data.code == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '没有结果',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '加载失败',
          showCancel: false,
          content: '请检查学校图书馆能否访问\n http://wxlib.djtu.edu.cn'
        })
      }
    })
  },
  /**
   * 显示图书详情的模态框
   */
  showModal(e) {
    var that = this;
    wx.request({
      url: libraryShowUrl,
      data: {
        // sessionId: app.sessionId,
        id: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            bookDetail: res.data.data
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
    // 是否收藏图书
    wx.request({
      url: libraryIsLikeUrl + "/" + app.sessionId,
      data: {
        id: e.currentTarget.dataset.id
      },
      timeout: 5000,
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            isLike: res.data.data
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
    return {
      title: '【图书馆】馆藏查询',
      path: 'pages/index/library/search/search?name=' + this.data.name, // 路径，传递参数到指定页面。
      success: function (res) { },
      fail: function (res) { }
    }
  }
})