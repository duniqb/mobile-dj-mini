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
    pageSize: 10,
    totalPage: 0,
    currPage: 1,
    feedList: []
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
   * 生命周期函数--监听页面加载
   * 第一次启动时，读取缓存。请求加载最新，并缓存
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // 读取缓存
    try {
      var value = wx.getStorageSync('feedList')
      if (value) {
        console.log('本地 feedList 获取成功：')
        this.feedList = value
        console.log(value)
      }
    } catch (e) {
      console.log('本地 feedList 获取失败')
    }
    var that = this;
    wx.request({
      url: feedListUrl,
      data: {
        sessionId: app.sessionId,
        // page: that.data.page,
        // size: that.data.size
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          console.log("本次请求：", res)
          // 修改时间显示
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(Date.parse(res.data.page.list[i].time))
            // 新数据中的时间要大于已缓存的数据的最顶部数据的时间
            // if (that.data.feedList.length > 0 && res.data.data.titleList[i]._id <= that.data.feedList[0]._id) {
            //   break;
            // }
          }

          // 将页面原有的 list 和查询返回的 list 拼接，然后新内容在前面显示
          // var feedList = res.data.data.titleList;
          // var newFeedList = that.data.feedList;

          // that.setData({
          //   feedList: newFeedList.concat(feedList),
          //   page: res.data.data.page,
          //   totalPage: res.data.data.total
          // });

          // 缓存
          wx.setStorage({
            key: "feedList",
            data: that.data.feedList
          })
          that.setData({
            feedList: res.data.page.list
          })
          console.log("已赋值feed列表：", that.data.feedList)
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