const app = getApp()
import {
  feedLikeTitleUrl,
  feedListUrl
} from '../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCount: 0,
    pageSize: 4,
    totalPage: 0,
    currPage: 1,
    feedList: []
  },
  /**
   * 请求新数据
   */
  getList() {
    var that = this;
    wx.request({
      url: feedListUrl,
      data: {
        sessionId: app.sessionId,
        page: that.data.currPage,
        limit: that.data.pageSize
      },
      success(res) {
        if (res.data.code == 0) {
          console.log("本次请求：", res)
          // 修改时间显示
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(Date.parse(res.data.page.list[i].time))
          }
          that.setData({
            currPage: res.data.page.currPage,
            totalPage: res.data.page.totalPage,
            feedList: res.data.page.list
          });
          console.log("已赋值feed列表：", that.data.feedList)
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 第一次启动时，读取缓存。请求加载最新，并缓存
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    if (this.data.feedList.length == 0) {
      this.getList();
    }
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
      url: feedListUrl,
      data: {
        sessionId: app.sessionId,
        page: page,
        limit: that.data.pageSize
      },
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          console.log("本次请求：", res)
          // 修改时间显示
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(Date.parse(res.data.page.list[i].time))
          }
          // 将页面原有的 list 和查询返回的 list 拼接，然后新内容在前面显示
          var feedList = res.data.page.list;
          var newFeedList = that.data.feedList;

          that.setData({
            feedList: newFeedList.concat(feedList),
            currPage: res.data.page.currPage,
            totalPage: res.data.page.totalPage
          });
          console.log("连接后的feedList：", that.data.feedList)
          console.log("已赋值feed列表：", that.data.feedList)
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading({
      complete: (res) => {},
    })
    var that = this;
    wx.request({
      url: feedListUrl,
      data: {
        sessionId: app.sessionId,
        page: 1,
        limit: that.data.pageSize
      },
      success(res) {
        if (res.data.code == 0) {
          wx.hideNavigationBarLoading({
            complete: (res) => {},
          })
          console.log("本次请求的结果：", res)
          // 修改时间显示
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(Date.parse(res.data.page.list[i].time))
            // 新数据中的时间要大于已缓存的数据的最顶部数据的时间
            if (res.data.page.list[i].timestamp > that.data.feedList[0].timestamp) {
              res.data.page.list = res.data.page.list.slice(0, i - 1);
              break;
            }
          }

          // 将页面原有的 list 和查询返回的 list 拼接，然后新内容在前面显示
          var feedList = res.data.page.list;
          var newFeedList = that.data.feedList;
          that.setData({
            feedList: feedList.concat(newFeedList)
          });
          console.log("已赋值feed列表：", that.data.feedList)
        }
      }
    })
  },
  publish() {
    wx.navigateTo({
      url: './publish/publish',
    })
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
          var newFeedList = that.data.feedList;
          // 修改该文章的点赞红心状态和数字
          for (var i = 0; i < that.data.feedList.length; i++) {
            if (that.data.feedList[i].id == event.target.id) {
              newFeedList[i].likeCount = res.data.likeCount;
              if (res.data.code == 0) {
                newFeedList[i].isLike = true;
              } else if (res.data.code == 1) {
                newFeedList[i].isLike = false;
              }
            }
          }
          that.setData({
            feedList: newFeedList
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
  }
})