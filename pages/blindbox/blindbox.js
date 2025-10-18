// pages/blindbox/blindbox.js
Page({
  data: {
    range: 0,
    distance: 0,
    tags: [],
    place: null
  },

  onLoad(options) {
    // 获取传入的参数
    const range = parseFloat(options.range) || 2.0
    const tags = JSON.parse(options.tags || '[]')
    const distance = parseFloat(options.distance) || 0
    const place = JSON.parse(options.place || '{}')
    
    this.setData({
      range: range,
      distance: distance,
      tags: tags,
      place: place
    })
  },

  // 重新生成按钮点击事件
  regenerate() {
    wx.redirectTo({
      url: '/pages/blindbox/generate'
    })
  },

  // 开始导航按钮点击事件
  startNavigation() {
    // 如果有地点信息，则传递给导航页面
    if (this.data.place) {
      wx.navigateTo({
        url: `/pages/navigation/navigation?range=${this.data.range}&distance=${this.data.distance}&tags=${JSON.stringify(this.data.tags)}&place=${JSON.stringify(this.data.place)}`
      })
    } else {
      wx.navigateTo({
        url: '/pages/navigation/navigation?range=' + this.data.range + '&distance=' + this.data.distance + '&tags=' + JSON.stringify(this.data.tags)
      })
    }
  }
})