const app = getApp()
Page({
  data: {
    range: 0,
    distance: 0,
    place:{}
  },

  onLoad(options) {
    // 解析参数
    const range = app.globalData.range
    const distance = parseFloat(options.distance) || 0
    const tags = app.globalData.selectedTags
    const place = app.globalData.selectedPOI
    
    // 设置页面数据
    this.setData({
      range,
      distance,
      tags,
      place
    })
    
    
  },

  // 重新生成按钮点击事件
  regenerate() {
    wx.redirectTo({
      url: '/pages/settings/settings'
    })
  },

  // 开始导航按钮点击事件
  startNavigation() {
      wx.navigateTo({
        url: `/pages/navigation/navigation`
      })
  }

})