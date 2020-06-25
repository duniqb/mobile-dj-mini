const app = getApp()
import { jobCalendarUrl, jobDemandListUrl, jobRecruitListUrl } from '../../../config.js'

Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    calendarList: [],
    demandList: [],
    recruitList: [],
    demandListPage: 1,
    demandListTotalPage: 1, 
    recruitListPage: 1,
    recruitListTotalPage: 1,
    // 时间选择
    currentDate: new Date().getTime(),
    minDate: new Date(2019, 8, 1).getTime(),
    // 三个月后
    maxDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).getTime(),
  },
  /**
   * 点击确定月份
   */
  onConfirm(e) {
    const year = this.getResult(this.data.currentDate).split("/")[0]
    const month = this.getResult(this.data.currentDate).split("/")[1]

    var that = this;
    wx.showLoading({
      title: '正在查询',
    })
    wx.request({
      url: jobCalendarUrl,
      data: {
        // sessionId: app.sessionId,
        year: year,
        month: month
      },
      success: res => {
        if (res.data.code == 0) {
          wx.hideLoading();
          that.setData({
            calendarList: res.data.data
          })
        } else if (res.data.code == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '没有记录',
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
          content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
        })
      }
    })
  },
  /**
   * 时间戳转为 年-月
   */
  getResult(time) {
    const date = new Date(time);
    return `${date.getFullYear()}/${date.getMonth() + 1}`;
  },
  /**
   * 监听时间选择
   */
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },
  /**
   * tab 切换事件
   */
  tabSelect(e) {
    var that = this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    // 判断当前页已经加载过了，就不再首次加载了
    if (e.currentTarget.dataset.id == 0 && this.data.calendarList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id == 1 && this.data.demandList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id == 2 && this.data.recruitList.length != 0) {
      return;
    }
    // 请求标签所在的新闻
    wx.showLoading({
      title: '正在加载',
    })
    const year = this.getResult(this.data.currentDate).split("/")[0]
    const month = this.getResult(this.data.currentDate).split("/")[1]
    if (e.currentTarget.dataset.id == 0) {
      wx.request({
        url: jobCalendarUrl,
        data: {
          // sessionId: app.sessionId,
          year: year,
          month: month
        },
        success: res => {
          if (res.data.code == 0) {
            wx.hideLoading();
            that.setData({
              calendarList: res.data.data
            })
          } else if (res.data.code == 400) {
            wx.hideLoading();
            wx.showModal({
              title: '加载失败',
              showCancel: false,
              content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: '加载失败',
            showCancel: false,
            content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
          })
        }
      })
    } else if (e.currentTarget.dataset.id == 1) {
      wx.request({
        url: jobDemandListUrl,
        data: {
          // sessionId: app.sessionId,
          page: 1
        },
        success: res => {
          if (res.data.code == 0) {
            wx.hideLoading();
            that.setData({
              demandList: res.data.data.list,
              demandListPage: res.data.data.page,
              demandListTotalPage: res.data.data.totalPage
            })
          } else if (res.data.code == 400) {
            wx.hideLoading();
            wx.showModal({
              title: '加载失败',
              showCancel: false,
              content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: '加载失败',
            showCancel: false,
            content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
          })
        }
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.request({
        url: jobRecruitListUrl,
        data: {
          // sessionId: app.sessionId,
          page: 1
        },
        success: res => {
          if (res.data.code == 0) {
            wx.hideLoading();
            that.setData({
              recruitList: res.data.data.list,
              recruitListPage: res.data.data.page,
              recruitListTotalPage: res.data.data.totalPage
            })
          } else if (res.data.code == 400) {
            wx.hideLoading();
            wx.showModal({
              title: '加载失败',
              showCancel: false,
              content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: '加载失败',
            showCancel: false,
            content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    const year = this.getResult(this.data.currentDate).split("/")[0]
    const month = this.getResult(this.data.currentDate).split("/")[1]
    wx.request({
      url: jobCalendarUrl,
      data: {
        // sessionId: app.sessionId,
        year: year,
        month: month
      },
      success: res => {
        if (res.data.code == 0) {
          wx.hideLoading();
          that.setData({
            calendarList: res.data.data
          })
        } else if (res.data.code == 400) {
          wx.hideLoading();
          wx.showModal({
            title: '加载失败',
            showCancel: false,
            content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '加载失败',
          showCancel: false,
          content: '请检查学校就业网能否访问\n http://jobs.djtu.edu.cn'
        })
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
    var that = this;
    // 获取原先的当前页面和总页面，如果相等就提示没有更多
    if (parseInt(that.data.TabCur) == 1) {
      var currentPage = that.data.demandListPage;
      var totalPage = that.data.demandListTotalPage;
    } else if (parseInt(that.data.TabCur) == 2) {
      var currentPage = that.data.recruitListPage;
      var totalPage = that.data.recruitListTotalPage;
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
    if (parseInt(that.data.TabCur) == 1) {
      wx.request({
        url: jobDemandListUrl,
        data: {
          // sessionId: app.sessionId,
          page: page
        },
        success: res => {
          if (res.data.code == 0) {
            wx.hideLoading();
            var demandList = res.data.data.list;
            var newList = that.data.demandList;
            that.setData({
              demandList: newList.concat(demandList),
              demandListPage: res.data.data.page,
              demandListTotalPage: res.data.data.totalPage
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
    } else if (parseInt(that.data.TabCur) == 2) {
      wx.request({
        url: jobRecruitListUrl,
        data: {
          // sessionId: app.sessionId,
          page: page
        },
        success: res => {
          if (res.data.code == 0) {
            wx.hideLoading();
            var recruitList = res.data.data.list;
            var newList = that.data.recruitList;
            that.setData({
              recruitList: newList.concat(recruitList),
              recruitListPage: res.data.data.page,
              recruitListTotalPage: res.data.data.totalPage
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
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我发现一个很有用的校园小程序，推荐给你~',
      path: 'pages/index/index', // 路径，传递参数到指定页面。
      success: function (res) { },
      fail: function (res) { }
    }
  }
})