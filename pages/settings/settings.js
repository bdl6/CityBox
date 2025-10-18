// pages/settings/settings.js
Page({
  data: {
    rangeValue: 2.0,
    selectedTags: []
  },

  onLoad(options) {

  },

  // 返回按钮点击事件
  goBack() {
    wx.navigateBack()
  },

  // 帮助按钮点击事件
  showHelp() {
    wx.showModal({
      title: '设置说明',
      content: '范围建议 1-2 公里更易探索',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 范围滑块变化事件
  onRangeChange(e) {
    this.setData({
      rangeValue: e.detail.value
    })
  },

  // 标签选择切换事件
  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag
    let selectedTags = this.data.selectedTags
    
    const index = selectedTags.indexOf(tag)
    if (index !== -1) {
      // 如果已选中，则取消选中
      selectedTags.splice(index, 1)
    } else {
      // 如果未选中，则添加选中
      selectedTags.push(tag)
    }
    
    this.setData({
      selectedTags
    })
  },

  // 生成盲盒按钮点击事件
  generateBlindBox() {
    if (this.data.selectedTags.length === 0) {
      wx.showToast({
        title: '请至少选择一个兴趣标签',
        icon: 'none'
      })
      return
    }
    
    // 显示加载提示
    wx.showLoading({
      title: '盲盒生成中...'
    })
    
    // 模拟生成过程
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateTo({
        url: '/pages/blindbox/blindbox?range=' + this.data.rangeValue + '&tags=' + JSON.stringify(this.data.selectedTags)
      })
    }, 1500)
  }
})