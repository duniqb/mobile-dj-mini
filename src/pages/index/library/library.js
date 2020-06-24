const app = getApp()
import {
  libraryHotUrl,
  libraryMajorUrl,
  libraryCategoryUrl,
  libraryShowUrl,
  libraryBookCateUrl,
  libraryCollegeUrl,
  libraryLikeUrl,
  libraryIsLikeUrl
} from '../../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否收藏图书
    isLike: false,
    TabCur: 1,
    scrollLeft: 0,
    // 热点图书列表
    readerHotList: [],
    recommendHotList: [],
    cateHotList: [],
    majorHotList: [],
    // 图书分类法总类列表
    bookCateList: [],
    // 学院列表
    collegeList: [],
    bookName: '',
    bookDetail: null,
    value: '',
    // 分类热点下面的二级列表
    showBookCate: true,
    showBookCateDetail: false,
    bookCateDetailList: [],

    // 专业热点下面的
    // 学院
    showCollege: true,
    // 专业
    showMajor: false,
    majorList: [],
    // 课程
    showCourse: false,
    courseList: [],
    // 临时保存学院名字，供查看三级时用
    tempCollege: '',
    // 展示专业图书列表
    showMajorDetail: false,
    majorDetailList: []
  },
  /**
   * 收藏或取消收藏图书
   */
  likeBook() {
    var that = this;
    var sessionId = app.sessionId;
    var book = {
      "author": this.data.bookDetail.author,
      "bookId": this.data.bookDetail.id,
      "bookName": this.data.bookDetail.bookName
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
          that.setData({
            isLike: res.data.data
          })
        }
      }
    })
  },
  /**
   * 专业热点，从图书列表页返回课程列表，返回上一级
   */
  backCourseList() {
    this.setData({
      showMajorDetail: false,
      showCourse: true
    })
  },
  /**
   * 展示专业热点下面的四级 - 图书列表
   */
  clickCourseList(e) {
    wx.request({
      url: libraryHotUrl,
      data: {
        // sessionId: app.sessionId,
        sq: e.currentTarget.dataset.id,
        type: 6
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            showMajorDetail: true,
            showCourse: false,
            majorDetailList: res.data.data
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '没有记录',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 专业热点，从课程返回专业，返回上一级
   */
  backMajorList() {
    this.setData({
      showCourse: false,
      showMajor: true
    })
  },
  /**
   * 展示专业热点下面的三级
   */
  clickMajorList(e) {
    var that = this;
    wx.request({
      url: libraryMajorUrl,
      data: {
        // sessionId: app.sessionId,
        major: e.currentTarget.dataset.id,
        college: this.data.tempCollege
      },
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            courseList: res.data.data.list,
            showMajor: false,
            showCourse: true
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '没有记录',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 专业热点，从专业返回学院，返回上一级
   */
  backCollegeList() {
    this.setData({
      showCollege: true,
      showMajor: false
    })
  },
  /**
   * 展示专业热点下面的二级
   */
  clickMajorHot(e) {
    var that = this;
    wx.request({
      url: libraryMajorUrl,
      data: {
        // sessionId: app.sessionId,
        college: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            majorList: res.data.data.list,
            showCollege: false,
            showMajor: true,
            tempCollege: e.currentTarget.dataset.id
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '没有记录',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 分类热点，返回上一级
   */
  bookCateBack() {
    this.setData({
      showBookCate: !this.data.showBookCate,
      showBookCateDetail: !this.data.showBookCateDetail
    })
  },
  /**
   * 展示分类热点下面的二级
   */
  clickCateHot(e) {
    var that = this;
    wx.request({
      url: libraryCategoryUrl,
      data: {
        // sessionId: app.sessionId,
        cate: e.currentTarget.dataset.id,
        type: 2
      },
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            bookCateDetailList: res.data.data,
            showBookCateDetail: true,
            showBookCate: false
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '没有记录',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 监听搜索框改变
   */
  onChange(e) {
    this.setData({
      value: e.detail
    });
  },
  /**
   * 搜索图书
   */
  onSearch(e) {
    var that = this;
    if (this.data.value === '') {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none'
      });
      return;
    }
    // 开始搜索
    if (this.data.value) {
      // 跳转到搜索列表页，并将关键词带过去
      wx.navigateTo({
        url: './search/search?name=' + this.data.value
      })
    }
  },
  /**
   * 显示图书详情的模态框
   */
  showModal(e) {
    var that = this;
    wx.request({
      url: libraryShowUrl,
      data: {
        // sessionId: app.sessionId,
        id: e.currentTarget.dataset.id
      },
      timeout: 5000,
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            bookDetail: res.data.data
          })
          that.setData({
            // modalName: e.currentTarget.dataset.target
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
    // 是否收藏图书
    wx.request({
      url: libraryIsLikeUrl + "/" + app.sessionId,
      data: {
        id: e.currentTarget.dataset.id
      },
      timeout: 5000,
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            isLike: res.data.data
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
   * tab 切换
   */
  tabSelect(e) {
    var that = this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    // 判断当前页已经加载过了，就不再首次加载了
    if (e.currentTarget.dataset.id == 1 && this.data.readerHotList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id == 2 && this.data.recommendHotList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id == 3 && this.data.bookCateList.length != 0) {
      return;
    } else if (e.currentTarget.dataset.id == 4 && this.data.collegeList.length != 0) {
      return;
    }
    // 判断是哪种图书热点
    var url = libraryHotUrl;
    // 读者热点-近2年入藏复本总借量
    if (e.currentTarget.dataset.id == 1) {
      var type = 2;
    }
    // 荐购热点-近5年入藏复本总借量
    else if (e.currentTarget.dataset.id == 2) {
      var type = 4;
    }
    // 分类热点，查询图书分类法总类列表
    else if (e.currentTarget.dataset.id == 3) {
      url = libraryBookCateUrl;
    }
    // 专业热点，查询学院列表
    else if (e.currentTarget.dataset.id == 4) {
      url = libraryCollegeUrl;
    }

    // 请求标签所在的列表
    wx.request({
      url: url,
      data: {
        // sessionId: app.sessionId,
        type: type
      },
      success: res => {
        if (res.data.code == 0) {
          if (e.currentTarget.dataset.id == 1) {
            that.setData({
              readerHotList: res.data.data
            })
          } else if (e.currentTarget.dataset.id == 2) {
            that.setData({
              recommendHotList: res.data.data
            })
          } else if (e.currentTarget.dataset.id == 3) {
            that.setData({
              bookCateList: res.data.data
            })
          } else if (e.currentTarget.dataset.id == 4) {
            that.setData({
              collegeList: res.data.data.list
            })
          }
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '加载失败',
          showCancel: false,
          content: '请检查学校图书馆能否访问\n http://wxlib.djtu.edu.cn'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    // wx.showLoading({
    //   title: '正在加载',
    // })
    // 页面加载，请求读者热点
    wx.request({
      url: libraryHotUrl,
      data: {
        // sessionId: app.sessionId,
        type: 2
      },
      success: res => {
        if (res.data.code == 0) {
          wx.hideLoading();
          this.setData({
            readerHotList: res.data.data
          })
        } else if (res.data.code == 400) {
          // wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '加载失败',
          showCancel: false,
          content: '请检查学校图书馆能否访问\n http://wxlib.djtu.edu.cn'
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {

  }
})