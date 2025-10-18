// pages/settings/settings.js
Page({
  data: {
    rangeValue: 2.0,
    selectedTags: [],
    isGiftBoxOpen: false
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
    // 修复多位小数问题，保留一位小数
    const value = parseFloat(e.detail.value).toFixed(1)
    this.setData({
      rangeValue: parseFloat(value)
    })
  },

  // 标签选择切换事件
  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag
    let selectedTags = [...this.data.selectedTags] // 创建副本以避免直接修改原数组
    
    const index = selectedTags.indexOf(tag)
    if (index !== -1) {
      // 如果已选中，则取消选中
      selectedTags.splice(index, 1)
      // 添加取消选中的视觉反馈
      wx.showToast({
        title: `已取消选择"${tag}"`,
        icon: 'none',
        duration: 1000
      })
    } else {
      // 如果未选中，则添加选中
      selectedTags.push(tag)
      // 添加选中的视觉反馈
      wx.showToast({
        title: `已选择"${tag}"`,
        icon: 'success',
        duration: 1000
      })
    }
    
    this.setData({
      selectedTags
    })
  },

  // 小礼盒开关切换事件
  toggleGiftBox() {
    this.setData({
      isGiftBoxOpen: !this.data.isGiftBoxOpen
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
    
    // 确保距离值格式化为一位小数
    const formattedRange = parseFloat(this.data.rangeValue).toFixed(1)
    
    // 模拟生成过程
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateTo({
        url: '/pages/blindbox/blindbox?range=' + formattedRange + '&tags=' + JSON.stringify(this.data.selectedTags)
      })
    }, 1500)
  }
})