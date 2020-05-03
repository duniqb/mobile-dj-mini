const app = getApp()
import QQMapWX from '../../libs/qqmap-wx-jssdk.min.js';

var qqmapsdk;
import {
  miniSlideImageUrl,
  miniTipUrl,
  festivalUrl,
  repairNoticeUrl
} from '../../config.js';
Page({
  data: {
    // 后勤通知
    noticeShow: false,
    noticeTitle: '',
    noticeContent: '',
    noticeDate: '',
    modalName: null,

    degree: '',
    weather: '',
    tips: '',
    festivalTips: null,
    province: null,
    city: '',
    cardCur: 0,
    swiperList: [{
      id: 1,
      type: 'image',
      url: 'https://mobile-dj.oss-cn-beijing.aliyuncs.com/slide/1.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://mobile-dj.oss-cn-beijing.aliyuncs.com/slide/2.jpg',
    }, {
      id: 3,
      type: 'image',
      url: 'https://mobile-dj.oss-cn-beijing.aliyuncs.com/slide/3.jpg',
    }],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    iconList: [{
      id: 0,
      icon: 'read',
      color: 'red',
      badge: 0,
      name: '教务',
      navUrl: './jw/jw'
    }, {
      id: 1,
      icon: 'news',
      color: 'orange',
      badge: 0,
      name: '一卡通',
      navUrl: './card/card'
    }, {
      id: 2,
      icon: 'searchlist',
      color: 'yellow',
      badge: 0,
      name: '图书查询',
      navUrl: './library/library'
    }, {
      id: 3,
      icon: 'repair',
      color: 'olive',
      badge: 0,
      name: '后勤报修',
      navUrl: './repair/repair'
    }, {
      id: 4,
      icon: 'activity',
      color: 'cyan',
      badge: 0,
      name: '失物招领'
    }, {
      id: 5,
      icon: 'time',
      color: 'mauve',
      badge: 0,
      name: '校车时刻'
    }, {
      id: 6,
      icon: 'calendar',
      color: 'pink',
      badge: 0,
      name: '校历',
      navUrl: './calendar/calendar'
    }, {
      id: 7,
      icon: 'group',
      color: 'purple',
      badge: 0,
      name: '就业信息',
      navUrl: './job/job'
    }, {
      id: 8,
      icon: 'apps',
      color: 'blue',
      badge: 0,
      name: '学院专区'
    }, ],
    gridCol: 3,
    skin: false
  },
  /**
   * 显示后勤通知详情的模态框
   */
  showModal(e) {
    var that = this;
    that.setData({
      modalName: e.currentTarget.dataset.target,
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 点击九宫格
   */
  bindGrid: function (e) {
    if (e.currentTarget.dataset.id == 5 || e.currentTarget.dataset.id == 8) {
      wx.showToast({
        title: '未完成的功能',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onLoad() {
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'LDDBZ-2JWW5-XBIIX-Q35KA-F7US6-54B4X'
    });
    try {
      var value = wx.getStorageSync('province')
      if (value) {
        this.province = value;
      }
    } catch (e) {
      // Do something when catch error
    }
    try {
      var value = wx.getStorageSync('city')
      if (value) {
        this.city = value;
      }
    } catch (e) {
      // Do something when catch error
    }
    if (this.city == null || this.province == null) {
      this.getLocation();
    } else {
      this.getTip();
      this.getFestival();
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  onShow() {
    var that = this;
    this.getTabBar().init();
    // 查询后勤通知
    wx.request({
      url: repairNoticeUrl,
      data: {
        // sessionId: app.sessionId,
      },
      success: res => {
        if (res.data.code == 0) {
          if (res.data.code != '') {
            that.setData({
              noticeShow: true,
              noticeTitle: res.data.title,
              noticeContent: res.data.content,
              noticeDate: res.data.date
            })
          }
        }
      }
    })
  },
  // 获取位置信息
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180
        //根据经纬度获取所在城市
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            //address 城市
            that.setData({
              province: res.result.ad_info.province,
              city: res.result.address_component.city
            })
            wx.setStorage({
              key: "province",
              data: res.result.ad_info.province
            })
            wx.setStorage({
              key: "city",
              data: res.result.ad_info.city
            })
          }
        });
        that.getTip();
        that.getFestival();
      }
    })
  },

  // 获取提示信息
  getTip: function () {
    var that = this;
    wx.request({
      url: miniTipUrl,
      data: {
        sessionId: app.sessionId,
        province: this.province,
        city: this.city
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          that.setData({
            weather: res.data.data.weather,
            degree: res.data.data.degree + '℃',
            tips: that.randomTip(res.data.data.tips)
          })
        }
      }
    })
  },
  getFestival: function () {
    var that = this;
    wx.request({
      url: festivalUrl,
      data: {
        // sessionId: app.sessionId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          festivalTips: that.randomTip(res.data) != undefined ? that.randomTip(res.data) : null
        })
      }
    })
  },
  randomTip: function (tips) {
    return tips[Math.floor(Math.random() * tips.length)]
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    return {
      title: '我发现一个很有用的校园小程序，推荐给你~',
      path: 'pages/index/index', // 路径，传递参数到指定页面。
      success: function (res) {},
      fail: function (res) {}
    }
  }
})