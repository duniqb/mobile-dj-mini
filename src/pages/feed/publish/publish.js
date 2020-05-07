const app = getApp()
import {
  feedPolicyUrl
} from '../../../config.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    address: '',
    content: '',
    // 签名数据
    sign: {},
    // 要保存到数据库的图片列表
    imgListSave: []
  },
  textareaAInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 发表
   */
  publish() {
    var that = this;
    console.log('imgList', that.data.imgList)
    console.log('address', that.data.address)
    console.log('content', that.data.content)

    if (that.data.imgList.length >= 1 && that.data.content != '') {
      console.log('开始鉴定内容安全')
      // 鉴定图片安全
      wx.cloud.callFunction({
        name: 'imgSecCheck',
        data: {
          img: that.data.imgList
        },
        success(res) {
          if (res.result.errCode == 0) {
            console.log('鉴定图片通过', res) // 3
            // 鉴定文字安全
            wx.cloud.callFunction({
              name: 'msgSecCheck',
              data: {
                msg: that.data.content
              },
              success(res) {
                if (res.result.errCode == 0) {
                  console.log('鉴定文字通过', res) // 3
                  // 获取签名并上传
                  wx.request({
                    url: feedPolicyUrl,
                    data: {
                      // sessionId: app.sessionId,
                    },
                    success(res) {
                      if (res.data.code == 0) {
                        console.log('签名数据：', res.data)
                        that.setData({
                          sign: res.data.data
                        })
                        console.log('sign 数据：', that.data.sign)
                        var successUp = 0; // 成功
                        var failUp = 0; // 失败
                        var length = that.data.imgList.length; // 总数
                        var count = 0; // 第几张
                        that.uploadOneByOne(that.data.imgList, successUp, failUp, count, length);
                      }
                    }
                  })
                } else if (res.result.errCode == 87014) {
                  wx.showToast({
                    title: '文字违规',
                    icon: 'fail',
                    duration: 2000
                  })
                }
              }
            })
          } else if (res.result.errCode == 87014) {
            wx.showToast({
              title: '图片违规',
              icon: 'fail',
              duration: 2000
            })
          }
        }
      })
    }
  },
  /**
   * 上传多张图片到阿里云
   * @param {*} params 
   */
  uploadOneByOne(imgPaths, successUp, failUp, count, length) {
    var that = this;

    wx.showLoading({
      title: '正在上传第' + count + '张',
    })
    // 获取文件扩展名以生成正确的文件名
    const imgsrc = imgPaths[count];
    const index = imgPaths[count].lastIndexOf("\.");
    const imgExtension = imgsrc.substring(index + 1, imgPaths[count].length);
    // 这里是 OSS 上的完整路径名+文件名
    const imgPath = that.data.sign.dir + new Date().getTime() + "." + imgExtension;

    wx.uploadFile({
      url: that.data.sign.host,
      filePath: imgPaths[count],
      name: 'file',
      formData: {
        name: imgPaths[count],
        key: imgPath,
        policy: that.data.sign.policy,
        OSSAccessKeyId: that.data.sign.accessid,
        success_action_status: '200', // 让服务端返回200,不然，默认会返回204
        signature: that.data.sign.signature,
      },
      success: function (e) {
        console.log("success:", e)
        let imgUrl = that.data.sign.host + '/' + imgPath
        that.data.imgListSave.push(imgUrl)
        successUp++; // 成功+1
      },
      fail: function (e) {
        console.log("fail:", e)
        failUp++; // 失败+1
      },
      complete: function (e) {
        console.log("complete:", e)
        count++; // 下一张
        if (count == length) {
          // 上传完毕
          console.log('上传成功 ' + successUp + ' ,' + '失败 ' + failUp);
          console.log('上传完成，图片可访问列表：', that.data.imgListSave)
          wx.showToast({
            title: '上传成功' + successUp,
            icon: 'success',
            duration: 2000
          })
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
          console.log('正在上传第 ' + count + ' 张');
        }
      }
    })
  },
  /**
   * 打开地图
   */
  openMap() {
    var that = this;
    wx.chooseLocation({
      success: res => {
        that.setData({
          address: res.name
        })
      },
      fail: res => {

      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除一张图片?',
      // content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  ChooseImage() {
    this.data.imgList = [];
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册/相机选择
      success: (res) => {
        console.log('选择的文件：', res)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: res.tempFilePaths
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})