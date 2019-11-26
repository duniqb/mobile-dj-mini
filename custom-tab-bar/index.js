Component({
  data: {
    active: 0,
    list: [{
        icon: 'home-o',
        text: '首页',
        url: '/pages/index/index'
      },
      {
        icon: 'newspaper-o',
        text: '资讯',
        url: '/pages/news/index'
      },
      {
        icon: 'eye-o',
        text: '发现',
        url: '/pages/discovery/index'
      },
      {
        icon: 'contact',
        text: '我',
        url: '/pages/mine/index'
      }
    ]
  },

  methods: {
    onChange(event) {
      this.setData({
        active: event.detail
      });
      wx.switchTab({
        url: this.data.list[event.detail].url
      });
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
});