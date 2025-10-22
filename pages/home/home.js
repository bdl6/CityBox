// pages/home/home.js
Page({
  data: {
  },

  onLoad(options) {
    // 页面加载时的初始化动画
    this.animatePageEntrance();
  },

  // 页面入场动画
  animatePageEntrance() {
    // 这里可以添加一些页面加载后的额外动画逻辑
    // 当前的CSS动画已经足够，这里留空为未来扩展做准备
  },

  // 开始探索按钮点击事件
  startExplore() {
    // 添加按钮点击效果
    const query = wx.createSelectorQuery();
    query.select('.explore-btn').boundingClientRect();
    query.exec((res) => {
      // 直接跳转到设置页面
      wx.navigateTo({
        url: '/pages/settings/settings'
      })
    });
  },

  // 我的探索点击事件
  goToMyExploration() {
    wx.navigateTo({
      url: '/pages/myexploration/myexploration'
    })
  },

  // 关于我们点击事件
  goToAbout() {
    wx.showToast({
      title: '关于我们页面待开发',
      icon: 'none'
    })
  },
  

})