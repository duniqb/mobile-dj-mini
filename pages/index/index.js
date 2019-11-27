const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var config = require('../../config.js')
Page({
  data: {
    degree: '',
    weather: '',
    tips: '',
    province: null,
    city: '',
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://www.djtu.edu.cn/Upload/image/20181026/ca811cd7-7137-462a-ab03-d4ce5acb17ef.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'http://www.djtu.edu.cn/Upload/image/20181026/dfdd9496-2ddf-460d-8575-3bd4eb73571f.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'http://www.djtu.edu.cn/Upload/image/20181026/6db1a643-1ddb-4fda-9e8d-44d92ba9e03a.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'http://www.djtu.edu.cn/Upload/image/20181026/50f61c67-82ec-4c4e-8b41-f4bffaf032af.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'http://www.djtu.edu.cn/Upload/image/20181026/fe54e8a4-b5b1-4454-8b26-5e4629f2da8f.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'http://www.djtu.edu.cn/Upload/image/20181026/c57bcd5a-f6fa-4d2c-8e2a-bf3b7069a01e.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'http://www.djtu.edu.cn/Upload/image/20181029/b0a49974-7348-4932-9986-8b82362c3568.jpg'
    }],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    iconList: [{
      icon: 'read',
      color: 'red',
      badge: 0,
      name: '教务'
    }, {
      icon: 'news',
      color: 'orange',
      badge: 0,
      name: '一卡通'
    }, {
      icon: 'search',
      color: 'yellow',
      badge: 0,
      name: '图书查询'
    }, {
      icon: 'repair',
      color: 'olive',
      badge: 0,
      name: '后勤报修'
    }, {
      icon: 'font',
      color: 'cyan',
      badge: 0,
      name: '四六级'
    }, {
      icon: 'time',
      color: 'mauve',
      badge: 0,
      name: '校车时刻'
    }, {
      icon: 'calendar',
      color: 'pink',
      badge: 0,
      name: '校历'
    }, {
      icon: 'group',
      color: 'purple',
      badge: 0,
      name: '就业信息'
    }, {
      icon: 'apps',
      color: 'blue',
      badge: 0,
      name: '学院专区'
    }, ],
    gridCol: 3,
    skin: false
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
      console.log('获取 省份')
      if (value) {
        console.log('获取 省份成功')
        this.province = value;
        console.log(this.province)
      }
    } catch (e) {
      // Do something when catch error
    }

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
    this.getLocation();
    // 获取提示信息
    // this.getTip();
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
    this.getTabBar().init()
  },
  // 获取位置信息
  getLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180
        //根据经纬度获取所在城市
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
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
            // wx.showToast({
            //   title: `当前位置： ` + that.data.city,
            //   icon: 'none'
            // });
          }
        });
        that.getTip();
      }
    })
  },

  // 获取提示信息
  getTip: function() {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    wx.request({
      url: config.tipUrl,
      data: {
        sessionId: app.sessionId,
        province: this.province,
        city: this.city
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        that.setData({
          weather: res.data.data.weather,
          degree: res.data.data.degree + '℃',
          tips: that.randomTip(res.data.data.tips)
        })
      }
    })
  },
  randomTip: function(tips) {
    return tips[Math.floor(Math.random() * tips.length)]
  }


})