const app = getApp()
import { jwNoticeListUrl, jwIsLoginUrl } from '../../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jwIsLogin: true,
    name: '',
    noticeList: [],
    page: 1,
    totalPage: 1
  },
  clickUndo() {
    wx.showToast({
      title: '未完成的功能',
      icon: 'none'
    })
  },
  loginBtn() {
    wx.navigateTo({
      url: './login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    // 检查是否已登录教务
    this.checkLogin();
    // 加载通知
    wx.request({
      url: jwNoticeListUrl,
      data: {
        // sessionId: app.sessionId
        page: 1
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(res)
          wx.hideLoading();
          that.setData({
            noticeList: res.data.data.list,
            page: res.data.data.page
          })
        } else if (res.data.code == 400) {
          wx.hideLoading();
        }
      }
    })
  },
  /**
   * 检查是否已登录教务
   */
  checkLogin: function () {
    wx.showLoading({
      title: '正在查询',
    })
    var that = this;
    wx.request({
      url: jwIsLoginUrl,
      data: {
        sessionId: app.sessionId
      },
      success: res => {
        if (res.data.code == 0) {
          wx.hideLoading();
          that.setData({
            jwIsLogin: true,
          })
        } else if (res.data.code == 400) {
          wx.hideLoading();
          var stuNo = wx.getStorageSync('stuNo');
          var password = wx.getStorageSync('password');
          that.setData({
            jwIsLogin: false,
            stuNo: stuNo,
            password: password
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
    // 检查是否已登录教务
    this.checkLogin();
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
    var currentPage = that.data.page;
    var page = parseInt(currentPage) + 1;

    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: jwNoticeListUrl,
      data: {
        // sessionId: app.sessionId
        page: page
      },
      success: res => {
        if (res.data.code == 0) {
          wx.hideLoading();
          var noticeList = res.data.data.list;
          var newList = that.data.noticeList;
          that.setData({
            noticeList: newList.concat(noticeList),
            page: res.data.data.page,
          })
        } else if (res.data.code == 400) {
          wx.hideLoading();
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