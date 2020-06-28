const app = getApp()
import {
  libraryLikeBookUrl,
  libraryLikeUrl,
  libraryShowUrl,
} from "../../../config.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCount: 0,
    pageSize: 10,
    totalPage: 0,
    currPage: 0,
    likeBookList: [],
    currId: '',
    defaultText: ''
  },
  showDialogModal(e) {
    console.log(e.target.dataset.id)
    var that = this;
    that.setData({ 
      modalName: e.currentTarget.dataset.target,
      currId: e.target.dataset.id
    })
  },
  /**
   * 取消收藏图书
   */
  likeBook() {
    // console.log(e.target.dataset.target)
    var that = this;
    var sessionId = app.sessionId;
    var book = {
      "bookId": that.data.currId
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
          that.getList();
          that.setData({
            modalName: null
          })
        }
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
        id: e.currentTarget.dataset.id
      },
      timeout: 5000,
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            bookDetail: res.data.data
          })
          that.setData({
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
     * 请求新数据
     */
  getList() {
    var that = this;
    wx.request({
      url: libraryLikeBookUrl + '/' + app.sessionId,
      data: {
      },
      success(res) {
        if (res.data.code == 0) {
          if (res.data.page.list.length == 0) {
            that.setData({
              defaultText: '空空如也，快去收藏吧！'
            })
          }
          console.log("本次请求：", res)
          // 修改时间显示
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(new Date(res.data.page.list[i].time))
            // res.data.page.list[i].time = new String(res.data.page.list[i].time).slice(11, 16)
          }
          that.setData({
            likeBookList: res.data.page.list,
            totalCount: res.data.page.totalCount,
            pageSize: res.data.page.pageSize,
            totalPage: res.data.page.totalPage,
            currPage: res.data.page.currPage,
          })
          console.log("已赋值 seek 列表：", that.data.seekList)
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
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
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu();
    that.getList();
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
    var that = this;
    if (that.data.currPage === that.data.totalPage) {
      wx.showToast({
        title: '没有更多',
        icon: 'none',
      })
      return;
    }

    console.log("当前页：", that.data.currPage)
    wx.showLoading({
      title: '正在加载',
    })
    var page = that.data.currPage + 1;
    wx.request({
      url: libraryLikeBookUrl + '/' + app.sessionId,
      data: {
        page: page,
        limit: that.data.pageSize
      },
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          console.log("本次请求：", res)
          // 修改时间显示
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(new Date(res.data.page.list[i].time))
          }
          // 将页面原有的 list 和查询返回的 list 拼接，然后新内容在前面显示
          var likeBookList = res.data.page.list;
          var newlikeBookList = that.data.likeBookList;

          that.setData({
            likeBookList: newlikeBookList.concat(likeBookList),
            currPage: res.data.page.currPage,
            totalPage: res.data.page.totalPage
          });
          console.log("连接后的likeBookList：", that.data.likeBookList)
          console.log("已赋值like列表：", that.data.likeBookList)
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})