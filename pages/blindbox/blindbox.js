// pages/blindbox/blindbox.js
Page({
  data: {
    distance: 0,
    tags: ''
  },

  onLoad(options) {
    // 获取传入的参数
    const range = options.range || 2.0
    const tags = JSON.parse(options.tags || '[]')
    
    // 模拟计算距离（实际应用中应该根据用户位置和目标位置计算）
    const distance = Math.floor(Math.random() * 2000) + 500 // 500-2500米之间
    
    this.setData({
      distance: distance,
      tags: tags.join(' + ')
    })
  },

  // 重新生成按钮点击事件
  regenerate() {
    wx.navigateBack()
  },

  // 开始导航按钮点击事件
  startNavigation() {
    wx.navigateTo({
      url: '/pages/navigation/navigation?distance=' + this.data.distance + '&tags=' + encodeURIComponent(this.data.tags)
    })
  }
})