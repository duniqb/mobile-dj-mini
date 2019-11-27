const app = getApp()

Page({
  data: {

  },

  onShow() {
    this.getTabBar().init();
  },
  menuCard: function(e) {
    this.setData({
      menuCard: e.detail.value
    });
  },
})