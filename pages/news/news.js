const app = getApp()
var config = require("../../config.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    focusPage: 1,
    focusTotalPage: 1,
    multiplePage: 1,
    multipleTotalPage: 1,
    noticePage: 1,
    noticeTotalPage: 1,
    // 交大要闻
    focusList: [],
    // 综合报道
    multipleList: [],
    // 通知公告
    noticeList: [],
  },
  // tab 切换事件
  tabSelect(e) {
    var that = this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    // 判断当前页已经加载过了，就不再首次加载了
    if (e.currentTarget.dataset.id + 1 == 1 && this.data.focusList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id + 1 == 2 && this.data.multipleList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id + 1 == 3 && this.data.noticeList.length != 0) {
      return;
    }
    // 请求标签所在的新闻
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.newsUrl,
      data: {
        // sessionId: app.sessionId,
        type: e.currentTarget.dataset.id + 1
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          if (e.currentTarget.dataset.id + 1 == 1) {
            that.setData({
              focusList: res.data.data.list,
              focusPage: res.data.data.page,
              focusTotalPage: res.data.data.totalPage
            })
          } else if (e.currentTarget.dataset.id + 1 == 2) {
            that.setData({
              multipleList: res.data.data.list,
              multiplePage: res.data.data.page,
              multipleTotalPage: res.data.data.totalPage
            })
          } else if (e.currentTarget.dataset.id + 1 == 3) {
            that.setData({
              noticeList: res.data.data.list,
              noticePage: res.data.data.page,
              noticeTotalPage: res.data.data.totalPage
            })
          }
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.showLoading({
      title: '正在加载',
    })
    // 页面加载，请求交大要闻
    wx.request({
      url: config.newsUrl,
      data: {
        // sessionId: app.sessionId,
        type: 1
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          this.setData({
            focusList: res.data.data.list,
            focusPage: res.data.data.page,
            focusTotalPage: res.data.data.totalPage
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTabBar().init();
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
    var that = this;
    // 获取原先的当前页面和总页面，如果相等就提示没有更多
    if (parseInt(that.data.TabCur) == 0) {
      var currentPage = that.data.focusPage;
      var totalPage = that.data.focusTotalPage;
    } else if (parseInt(that.data.TabCur) == 1) {
      var currentPage = that.data.multiplePage;
      var totalPage = that.data.multipleTotalPage;

    } else if (parseInt(that.data.TabCur) == 2) {
      var currentPage = that.data.noticePage;
      var totalPage = that.data.noticeTotalPage;
    }
    if (currentPage === totalPage) {
      wx.showToast({
        title: '没有更多',
        icon: 'none',
      })
      return;
    }

    var page = parseInt(currentPage) + 1;
    // 请求标签所在的新闻
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.newsUrl,
      data: {
        // sessionId: app.sessionId,
        type: parseInt(that.data.TabCur) + 1,
        page: page
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          // 将页面原有的 list 和查询返回的 list 拼接，然后新内容在前面显示
          if (that.data.TabCur + 1 == 1) {
            var focusList = res.data.data.list;
            var newList = that.data.focusList;
            that.setData({
              focusList: newList.concat(focusList),
              focusPage: res.data.data.page,
              focusTotalPage: res.data.data.totalPage
            })
          } else if (that.data.TabCur + 1 == 2) {
            var multipleList = res.data.data.list;
            var newList = that.data.multipleList;
            that.setData({
              multipleList: newList.concat(multipleList),
              multiplePage: res.data.data.page,
              multipleTotalPage: res.data.data.totalPage
            })
          } else if (that.data.TabCur + 1 == 3) {
            var noticeList = res.data.data.list;
            var newList = that.data.noticeList;
            that.setData({
              noticeList: newList.concat(noticeList),
              noticePage: res.data.data.page,
              noticeTotalPage: res.data.data.totalPage
            })
          }
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    return {
      title: '我发现一个很有用的校园小程序，推荐给你~',
      path: 'pages/index/index', // 路径，传递参数到指定页面。
      success: function(res) {},
      fail: function(res) {}
    }
  }
})