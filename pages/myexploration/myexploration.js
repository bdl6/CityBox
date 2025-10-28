// pages/myexploration/myexploration.js
const app = getApp()

Page({
  data: {
    explorationCount: 0,
    explorations: []
  },

  onLoad() {
    this.loadExplorations()
  },

  onShow() {
    // 每次显示页面时重新加载数据，确保显示最新的探索记录
    this.loadExplorations()
  },

  // 从本地存储加载探索记录
  loadExplorations() {
    try {
      const explorations = wx.getStorageSync('explorations') || []
      console.log('加载的探索记录:', explorations)

      this.setData({
        explorationCount: explorations.length,
        explorations: explorations
      })
    } catch (error) {
      console.error('加载探索记录失败:', error)
      this.setData({
        explorationCount: 0,
        explorations: []
      })
    }
  },

  

  // 去探索按钮点击事件
  goHome() {
    wx.redirectTo({
      url: '/pages/home/home'
    })
  },

  // 清空所有探索记录
  clearAllExplorations() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有探索记录吗？此操作不可恢复。',
      confirmText: '确定清空',
      confirmColor: '#ff7d00',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('explorations')
            this.setData({
              explorationCount: 0,
              explorations: []
            })
            wx.showToast({
              title: '清空成功',
              icon: 'success'
            })
          } catch (error) {
            console.error('清空记录失败:', error)
            wx.showToast({
              title: '清空失败',
              icon: 'none'
            })
          }
        }
      }
    })
  }
})