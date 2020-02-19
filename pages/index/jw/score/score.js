const app = getApp()
var config = require('../../../../config.js')

const select = {
  '学年': ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '全部'],
  '学期': ['春', '秋', '全部']
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    columns: [{
        values: select['学年'],
        className: 'column1',
        defaultIndex: 5
      },
      {
        values: select['学期'],
        className: 'column2',
        defaultIndex: 0
      }
    ],
    year: 2019,
    term: 0,
    scoreList: []
  },
  /**
   * 发起查询
   */
  onConfirm() {
    var that = this;
    if (that.data.year == -1 && that.data.term == 0) {
      wx.showToast({
        title: '请选择学年',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (that.data.year == -1 && that.data.term == 1) {
      wx.showToast({
        title: '请选择学年',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '正在查询',
    })
    // 按照学号 + 学年 + 学期查询成绩
    if (that.data.year != -1 && that.data.term != -1) {
      wx.request({
        url: config.studentScoreUrl,
        data: {
          sessionId: app.sessionId,
          year: that.data.year,
          term: that.data.term
        },
        success: res => {
          if (res.data.meta.status == 200) {
            wx.hideLoading();
            that.setData({
              scoreList: res.data.data
            })
          } else if (res.data.meta.status == 400) {
            wx.hideLoading();
            wx.showToast({
              title: '没有记录',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
    // 按照学号 + 学年查询成绩
    else if (that.data.year != -1 && that.data.term == -1) {
      wx.request({
        url: config.studentScoreUrl,
        data: {
          sessionId: app.sessionId,
          year: that.data.year
        },
        success: res => {
          if (res.data.meta.status == 200) {
            wx.hideLoading();
            that.setData({
              scoreList: res.data.data
            })
          } else if (res.data.meta.status == 400) {
            wx.hideLoading();
            wx.showToast({
              title: '没有记录',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
    // 按照学号查询全部成绩
    else if (that.data.year == -1 && that.data.term == -1) {
      wx.request({
        url: config.studentScoreUrl,
        data: {
          sessionId: app.sessionId
        },
        success: res => {
          if (res.data.meta.status == 200) {
            wx.hideLoading();
            that.setData({
              scoreList: res.data.data
            })
          } else if (res.data.meta.status == 400) {
            wx.hideLoading();
            wx.showToast({
              title: '没有记录',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
  onChange(event) {
    var that = this;
    if (event.detail.value[0] == '全部') {
      var year = -1;
    } else {
      var year = event.detail.value[0];
    }

    if (event.detail.value[1] == '春') {
      var term = 0;
    } else if (event.detail.value[1] == '秋') {
      var term = 1;
    } else if (event.detail.value[1] == '全部') {
      var term = -1;
    }

    that.setData({
      year: year,
      term: term
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})