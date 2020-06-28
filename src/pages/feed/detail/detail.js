const app = getApp()
import {
  feedDetailUrl,
  feedCommentListUrl,
  feedCommentPublishUrl,
  feedLikeListUrl,
  feedCommentReplyPublishUrl,
  feedDeleteArticleUrl
} from '../../../config.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    article: {},
    time: '',
    id: '',
    commentList: [],
    likeList: [],
    totalCount: 0,
    pageSize: 5,
    totalPage: 0,
    currPage: 1,
    commentContent: '',
    replyContent: '',
    // 用作展示
    replyToName: '',
    replyToContent: '',
    TabCur: 0,
    scrollLeft: 0,
    commentId: 0,
    openIdTo: '',
    inputValue: ''
  },
  showDialogModal(e) {
    console.log(e.target.dataset.id)
    var that = this;
    that.setData({
      modalName: e.currentTarget.dataset.target,
      currId: e.target.dataset.id
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 删除
   */
  delete: function () {
    var that = this;
    console.log('id:',this.data.article.id)
    var article = {
      id: that.data.article.id
    }
    wx.request({
      url: feedDeleteArticleUrl,
      method: 'POST',
      data: JSON.stringify(article),
      success(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
          })
          wx.navigateBack({
            delta: 1
          })
          that.hideModal();
          console.log("删除成功", res)
        }
      },
      fail(res) {
        this.hideModal();

        console.log(res)
      }
    })
  },
  tabSelect(e) {
    var that = this;
    that.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    if (e.currentTarget.dataset.id == 1) {
      that.getLikeList();
    }
  },
  showModal(e) {
    // console.log(e.target.dataset.id)
    this.setData({
      modalName: e.currentTarget.dataset.target,
      commentId: e.target.dataset.id.commentId,
      openIdTo: e.target.dataset.id.fromName == null ? e.target.dataset.id.openId : e.target.dataset.id.openIdFrom,
      replyToName: e.target.dataset.id.fromName == null ? e.target.dataset.id.name : e.target.dataset.id.fromName,
      replyToContent: e.target.dataset.id.fromName == null ? e.target.dataset.id.content.slice(0, 14) + '...' : e.target.dataset.id.content.slice(0, 14) + '...',
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      replyContent: '',
      replyToName: '',
      replyToContent: '',
      inputValue: ''
    })
  },
  /**
   * 发表回复
   */
  publishReply(e) {
    var that = this;
    if (that.data.replyContent == '') {
      wx.showToast({
        title: '不写点什么?',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.replyContent.length > 140) {
      wx.showToast({
        title: '内容过长',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    var commentReply = {
      commentId: that.data.commentId,
      openIdTo: that.data.openIdTo,
      content: that.data.replyContent
    }
    console.log('开始鉴定内容安全')
    // 鉴定文字安全
    wx.cloud.callFunction({
      name: 'msgSecCheck',
      data: {
        msg: that.data.replyContent
      },
      success(res) {
        if (res.result.errCode == 0) {
          console.log('鉴定回复文字通过', res) // 3
          wx.request({
            url: feedCommentReplyPublishUrl + '/' + app.sessionId,
            method: 'POST',
            data: JSON.stringify(commentReply),
            success: res => {
              if (res.data.code == 0) {
                console.log('发表回复成功：', res)
                wx.showToast({
                  title: '回复成功',
                  icon: 'none',
                  duration: 2000
                })
                that.getCommentList();
                that.hideModal();
                that.setData({
                  replyContent: ''
                })
              } else if (res.data.code == 400) {
                wx.showToast({
                  title: '回复失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          });
        } else if (res.result.errCode == 87014) {
          that.setData({
            publishing: false
          })
          wx.showToast({
            title: '回复内容违规',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 发表评论
   */
  publishComment() {
    var that = this;
    if (that.data.commentContent == '') {
      wx.showToast({
        title: '不写点什么?',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.commentContent.length > 140) {
      wx.showToast({
        title: '内容过长',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var comment = {
      articleId: that.data.articleId,
      content: that.data.commentContent
    }

    console.log('开始鉴定内容安全')
    // 鉴定文字安全
    wx.cloud.callFunction({
      name: 'msgSecCheck',
      data: {
        msg: that.data.commentContent
      },
      success(res) {
        if (res.result.errCode == 0) {
          console.log('鉴定评论文字通过', res) // 3
          wx.request({
            url: feedCommentPublishUrl + '/' + app.sessionId,
            method: 'POST',
            data: JSON.stringify(comment),
            success: res => {
              if (res.data.code == 0) {
                console.log('发表评论成功：', res)
                wx.showToast({
                  title: '评论成功',
                  icon: 'none',
                  duration: 2000
                })
                that.getCommentList();
                that.setData({
                  commentContent: ''
                })
              } else if (res.data.code == 400) {
                wx.showToast({
                  title: '评论失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.result.errCode == 87014) {
          that.setData({
            publishing: false
          })
          wx.showToast({
            title: '评论内容违规',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  textareaReplyInput(e) {
    var that = this;
    that.setData({
      replyContent: e.detail.value
    })
  },
  textareaInput(e) {
    this.setData({
      commentContent: e.detail.value
    })
  },
  /**
   * 显示图片
   * @param {*} event 
   */
  showImg(event) {
    var that = this;
    wx.previewImage({
      current: event.target.id, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.images // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    console.log(params.id)
    this.setData({
      articleId: params.id
    })
    // 请求内容
    this.getArticle();
    // 请求评论
    this.getCommentList();
  },
  getLikeList() {
    var that = this;
    wx.request({
      url: feedLikeListUrl + '/' + that.data.article.id,
      success: res => {
        if (res.data.code == 0) {
          console.log('请求点赞数据成功：', res)
          for (let i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(new Date(res.data.page.list[i].time))
          }
          that.setData({
            likeList: res.data.page.list
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  getArticle() {
    var that = this;
    wx.request({
      url: feedDetailUrl,
      data: {
        sessionId: app.sessionId,
        // id: params.id
        id: that.data.articleId
      },
      success: res => {
        if (res.data.code == 0) {
          console.log('请求内容成功：', res)
          that.setData({
            article: res.data.article,
            time: that.timeFormat(new Date(res.data.article.time))
          })
        } else if (res.data.meta.status == 400) {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  getCommentList() {
    var that = this;
    wx.request({
      url: feedCommentListUrl,
      data: {
        // sessionId: app.sessionId,
        // id: params.id
        id: that.data.articleId
      },
      success: res => {
        wx.hideNavigationBarLoading({
          complete: (res) => { },
        })
        if (res.data.code == 0) {
          console.log('请求评论成功：', res)
          for (let i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i].time = that.timeFormat(new Date(res.data.page.list[i].time))
          }
          that.setData({
            commentList: res.data.page.list,
            totalCount: res.data.page.totalCount,
            pageSize: res.data.page.pageSize,
            totalPage: res.data.page.totalPage,
            currPage: res.data.page.currPage
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: '评论加载失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  timeFormat(timestamp) {
    var date = timestamp;
    var month = date.getMonth() + 1;
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return date.getFullYear() + '年' + month + '月' + date.getDate() + "日 " + hour + ':' + minute;
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
    wx.showNavigationBarLoading({
      complete: (res) => { },
    })
    // wx.showNavigationBarLoading();
    var that = this;
    // 请求评论
    this.getCommentList();
    // 请求点赞
    this.getLikeList();
    wx.hideNavigationBarLoading();
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
      title: "【校友圈】" + this.data.article.author + " 发布了新动态",
      path: '/pages/feed/detail/detail?id=' + this.data.article.id, // 路径，传递参数到指定页面。
      success: function (res) { },
      fail: function (res) { }
    }
  }
})