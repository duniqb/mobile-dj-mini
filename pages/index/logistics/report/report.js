const app = getApp()
var config = require('../../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numList: [{
      name: '校区'
    }, {
      name: '地点'
    }, {
      name: '位置'
    }, {
      name: '设备'
    }],
    // 步骤条
    num: -1,
    picker1: ['旅顺一期', '旅顺二期', '沙河口校区', '南区'],
    picker2: [],
    picker3: [],
    picker4: [],
    index1: null,
    index2: null,
    index3: null,
    index4: null,
    distinctId: '',
    buildingId: '',
    roomId: '',
    equipmentId: '',
    buildings: [],
    rooms: [],
    equipments: [],
    equipmentDetail: null,
    comment: '',
    phone: '',
    place: '',
    describe: '',
    showReportButton: true
  },
  /**
   * 发起报修
   */
  reportButton() {
    var that = this;
    if (this.data.distinctId == '' || this.data.buildingId == '' || this.data.roomId == '' || this.data.equipmentId == '' || this.data.place == '' || this.data.phone == '' || this.data.describe == '') {
      wx.showToast({
        title: '请填完所有项',
        icon: 'none'
      })
      return;
    }
    // 校验手机号
    var patt = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/i;
    if (this.data.phone.search(patt) == 0) {
      // 合格
    } else {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      })
      return;
    }
    // 校验通过
    wx.showModal({
      title: '报修',
      content: '即将提交报修信息，确认继续？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
          })
          wx.request({
            url: config.logisticsReportUrl,
            data: {
              // sessionId: app.sessionId,
              buildingId: this.data.buildingId,
              description: this.data.describe,
              distinctId: this.data.distinctId,
              equipmentId: this.data.equipmentId,
              phone: this.data.phone,
              place: this.data.place,
              roomId: this.data.roomId,
            },
            success: res => {
              if (res.data.meta.status == 200) {
                wx.hideLoading();
                that.setData({
                  showReportButton: false
                })
              } else if (res.data.meta.status == 400) {
                wx.hideLoading();
                wx.showToast({
                  title: '报修失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 监听输入框改变
   */
  onPlaceChange(event) {
    this.setData({
      place: event.detail.value,
    })
  },
  onPhoneChange(event) {
    this.setData({
      phone: event.detail.value,
    })
  },
  onDescribeChange(event) {
    this.setData({
      describe: event.detail.value,
    })
  },
  /**
   * 设置校区，请求地点数据
   */
  PickerChange1(e) {
    var that = this;
    if (e.detail.value == 0) {
      this.setData({
        distinctId: '9423325b-ac9a-4a2f-b327-cdffb265000e'
      })
    } else if (e.detail.value == 1) {
      this.setData({
        distinctId: '18312640-7356-4355-a5ea-fe92c14b364f'
      })
    } else if (e.detail.value == 2) {
      this.setData({
        distinctId: 'a91ce1a9-9a01-4e17-b3c6-ef65b756f784'
      })
    } else if (e.detail.value == 3) {
      this.setData({
        distinctId: '1db564a1-7fcd-4e90-bae8-a329969dd75a'
      })
    }
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.logisticsDataUrl,
      data: {
        // sessionId: app.sessionId,
        id: 'distinctId',
        value: this.data.distinctId
      },
      success: res => {
        if (res.data.meta.status == 200) {
          var list = [];
          for (var i = 0; i < res.data.data.buildings.length; i++) {
            list[i] = res.data.data.buildings[i].buildingName
          }
          wx.hideLoading();
          that.setData({
            buildings: res.data.data.buildings,
            picker2: list
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    this.setData({
      index1: e.detail.value,
      index2: null,
      index3: null,
      index4: null,
      roomId: '',
      equipmentId: '',
      rooms: [],
      equipments: [],
      equipmentDetail: null,
      picker3: [],
      picker4: [],
      num: 0,
      comment: ''
    })
  },
  /**
   * 设置地点，请求位置数据
   */
  PickerChange2(e) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.logisticsDataUrl,
      data: {
        // sessionId: app.sessionId,
        id: 'buildingId',
        value: this.data.buildings[e.detail.value].buildingId
      },
      success: res => {
        if (res.data.meta.status == 200) {
          var list = [];
          for (var i = 0; i < res.data.data.rooms.length; i++) {
            list[i] = res.data.data.rooms[i].roomName
          }
          wx.hideLoading();
          that.setData({
            rooms: res.data.data.rooms,
            picker3: list,
            buildingId: this.data.buildings[e.detail.value].buildingId
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    this.setData({
      index2: e.detail.value,
      index3: null,
      index4: null,
      equipmentId: '',
      equipments: [],
      equipmentDetail: null,
      picker4: [],
      num: 1,
      comment: ''
    })
  },
  /**
   * 设置位置，请求设备数据
   */
  PickerChange3(e) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.logisticsDataUrl,
      data: {
        // sessionId: app.sessionId,
        id: 'roomId',
        value: this.data.rooms[e.detail.value].roomId
      },
      success: res => {
        if (res.data.meta.status == 200) {
          var list = [];
          for (var i = 0; i < res.data.data.equipments.length; i++) {
            list[i] = res.data.data.equipments[i].equipmentName
          }
          wx.hideLoading();
          that.setData({
            equipments: res.data.data.equipments,
            picker4: list,
            roomId: this.data.rooms[e.detail.value].roomId
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    this.setData({
      index3: e.detail.value,
      index4: null,
      equipmentDetail: null,
      num: 2,
      comment: ''
    })
  },
  /**
   * 请求设备详情
   */
  PickerChange4(e) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.logisticsDataUrl,
      data: {
        // sessionId: app.sessionId,
        id: 'equipmentId',
        value: this.data.equipments[e.detail.value].equipmentId
      },
      success: res => {
        if (res.data.meta.status == 200) {
          wx.hideLoading();
          that.setData({
            equipmentDetail: res.data.data.json,
            equipmentId: res.data.data.json.equipmentId,
            comment: res.data.data.json.comment
          })
        } else if (res.data.meta.status == 400) {
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    this.setData({
      index4: e.detail.value,
      num: 3
    })
  },
  steps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
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
    return {
      title: '我发现一个很有用的校园小程序，推荐给你~',
      path: 'pages/index/index', // 路径，传递参数到指定页面。
      success: function(res) {},
      fail: function(res) {}
    }
  }
})