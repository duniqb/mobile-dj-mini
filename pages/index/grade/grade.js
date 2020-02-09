const app = getApp()
var config = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isExist: true,
    gradeList: []
  },
  loginBtn() {
    wx.navigateTo({
      url: '../../mine/bind/bind',
    })
  },
  /**
   * 点击跳转到绑定页
   */
  toBind() {
    wx.navigateTo({
      url: '../../mine/bind/bind',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 检查是否已存在该学生信息
    wx.request({
      url: config.infoUrl,
      data: {
        sessionId: app.sessionId
      },
      success: res => {
        if (res.data.meta.status === 200) {
          that.setData({
            isExist: true
          })
          // 获取等级考试信息
          wx.request({
            url: config.gradeUrl,
            data: {
              sessionId: app.sessionId,
            },
            success: res => {
              if (res.data.meta.status === 200) {
                that.setData({
                  gradeList: res.data.data,
                })
              } else if (res.data.meta.status === 400) {
                wx.showToast({
                  title: '没有记录',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.data.meta.status === 400) {}
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
    var that = this;
    // 检查是否已存在该学生信息
    if (!that.data.isExist) {
      wx.request({
        url: config.infoUrl,
        data: {
          sessionId: app.sessionId
        },
        success: res => {
          if (res.data.meta.status === 200) {
            that.setData({
              isExist: true
            })
            // 获取等级考试信息
            wx.request({
              url: config.gradeUrl,
              data: {
                sessionId: app.sessionId,
              },
              success: res => {
                if (res.data.meta.status === 200) {
                  that.setData({
                    gradeList: res.data.data,
                  })
                } else if (res.data.meta.status === 400) {
                  wx.showToast({
                    title: '没有记录',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          } else if (res.data.meta.status === 400) {}
        }
      })
    }
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
  onShareAppMessage: function(ops) {

  }
})