const app = getApp()
var config = require('../../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    browser: '',
    companyName: '',
    companyProperties: '',
    companyRegion: '',
    competentDepartment: '',
    content: [],
    date: '',
    from: '',
    place: '',
    releaseDate: '',
    time: '',
    title: '',
    zipCode: '',
    companyInfo: false,
    id: ''
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
      url: config.jobRecruitUrl,
      data: {
        // sessionId: app.sessionId,
        id: params.id
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(res.data)
          wx.hideLoading();
          this.setData({
            address: res.data.data.address,
            browser: res.data.data.browser + '浏览',
            companyName: res.data.data.companyName,
            companyProperties: res.data.data.companyProperties,
            companyRegion: res.data.data.companyRegion,
            competentDepartment: res.data.data.competentDepartment,
            content: res.data.data.content,
            date: res.data.data.date,
            from: res.data.data.from,
            place: res.data.data.place,
            releaseDate: res.data.data.releaseDate,
            time: res.data.data.time,
            title: res.data.data.title,
            zipCode: res.data.data.zipCode,
            companyInfo: res.data.data.companyInfo,
            id: params.id
          })
        } else if (res.data.code == 400) {
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
  onShareAppMessage: function () {
    return {
      title: "【招聘会】" + this.data.title,
      path: '/pages/index/job/recruit/recruit?id=' + this.data.id, // 路径，传递参数到指定页面。
      success: function (res) { },
      fail: function (res) { }
    }
  }
}) 