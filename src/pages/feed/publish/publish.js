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
    sign: {}
  },
  /**
   * 上传图片到阿里云
   * @param {*} params 
   */
  uploadImgFile(params = {}) {
    var that = this;
    let data = new Promise((resolve, reject) => {
      // 获取文件扩展名以生成正确的文件名
      const imgsrc = that.data.imgList[0];
      const index = that.data.imgList[0].lastIndexOf("\.");
      const imgExtension = imgsrc.substring(index + 1, that.data.imgList[0].length);
      // 这里是 OSS 上的完整路径名+文件名
      const imgPath = params.fileName + "." + imgExtension;
      wx.uploadFile({
        url: params.url, //上传地址,
        filePath: that.data.imgList[0],
        name: 'file',
        formData: {
          name: that.data.imgList[0],
          key: imgPath, //文件上传的位置(默认根目录)
          policy: params.policy,
          OSSAccessKeyId: params.accessid,
          success_action_status: '200', //让服务端返回200,不然，默认会返回204
          signature: params.signature,
        },

        success: function (res) {
          wx.showToast({
            title: "上传成功",
            icon: 'success',
            duration: 2000
          })
          console.log('上传时的文件：', that.data.imgList[0])
          console.log('上传成功：', res)
          let imgUrl = params.url + "/" + imgPath
          console.log('可访问的图片地址：', imgUrl)
        },
        fail: function (res) {
          console.log('上传失败', res)
          reject("上传失败");
        }
      })
      // },
      // })
    })
    return data;
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
    console.log('imgList', this.data.imgList)
    console.log('address', this.data.address)
    console.log('content', this.data.content)
    // 获取签名
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
          var obj = {
            url: that.data.sign.host, //上传路径
            fileName: that.data.sign.dir + new Date().getTime(), //上传到xxx文件夹下（我这里图片重新命名）
            policy: that.data.sign.policy, //后端返回的policy
            accessid: that.data.sign.accessid, //后端返回的accessid
            signature: that.data.sign.signature, //后端返回的signature
          }

          console.log('obj数据：', obj)
          that.uploadImgFile(obj).then(function (res) {
            if (res.statusCode == 200) {
              // let src = res.imgUrl; //返回上传的图片地址
              // console.log('图片地址：', src)
            } else {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000,
              })
            }
          }).catch(function (err) {
            console.log('err:' + err);
          })
        }
      }
    })
  },
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
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册/相机选择
      success: (res) => {
        console.log('选择的文件：', res)
        if (this.data.imgList.length != 0) {
          this.setData({
            // imgList: this.data.imgList.concat(res.tempFilePaths)
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