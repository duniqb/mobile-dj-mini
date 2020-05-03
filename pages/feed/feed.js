const app = getApp()
import { feedLikeTitleUrl, feedListUrl } from '../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 5,
    feedList: []
  },
  /**
   * 点赞文章或取消
   * @param {*} event 
   */
  likeTitle: function (event) {
    console.log(event.target.id)
    var that = this;
    wx.request({
      url: feedLikeTitleUrl,
      data: {
        sessionId: app.sessionId,
        titleId: event.target.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'PUT',
      success(res) {
        console.log(res.data)
        if (res.data.meta.status == 200) {
          console.log(res.data.meta.msg)

        }
        // 重复点赞
        else if (res.data.meta.status == 401) {
          console.log(res.data.meta.msg)

        }
        // 点赞失败
        else if (res.data.meta.status == 400) {
          console.log(res.data.meta.msg)
          wx.showToast({
            title: '点赞失败',
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
        page: that.data.page,
        size: that.data.size
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.meta.status == 200) {
          console.log("本次请求：")
          console.log(res.data.data)
          // 修改时间显示
          for (var i = 0; i < res.data.data.titleList.length; i++) {
            res.data.data.titleList[i].time = that.timeFormat(Date.parse(res.data.data.titleList[i].time))
            // 新数据中的时间要大于已缓存的数据的最顶部数据的时间
            if (that.data.feedList.length > 0 && res.data.data.titleList[i]._id <= that.data.feedList[0]._id) {
              break;
            }
          }

          // 将页面原有的 list 和查询返回的 list 拼接，然后新内容在前面显示
          var feedList = res.data.data.titleList;
          var newFeedList = that.data.feedList;

          that.setData({
            feedList: newFeedList.concat(feedList),
            page: res.data.data.page,
            totalPage: res.data.data.total
          });

          // 缓存
          wx.setStorage({
            key: "feedList",
            data: that.data.feedList
          })
          that.setData({
            feedList: res.data.data.titleList
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