// pages/navigation/navigation.js
Page({
  data: {
    totalDistance: 0,
    remainingDistance: 0,
    progress: 0,
    progressWidth: '0%',
    arrowRotation: 0,
    direction: '东北',
    directions: ['东北', '东', '东南', '南', '西南', '西', '西北', '北'],
    intervalId: null
  },

  onLoad(options) {
    // 获取传入的距离参数
    const distance = options.distance || 1000
    this.setData({
      totalDistance: parseInt(distance),
      remainingDistance: parseInt(distance)
    })
    
    // 初始化方向（随机选择一个方向）
    const randomDirectionIndex = Math.floor(Math.random() * this.data.directions.length)
    const direction = this.data.directions[randomDirectionIndex]
    const rotation = randomDirectionIndex * 45 // 每个方向相差45度
    
    this.setData({
      direction: direction,
      arrowRotation: rotation
    })
    
    // 更新进度
    this.updateProgress()
    
    // 启动模拟导航（实际应用中应该使用真实的位置更新）
    this.startSimulation()
  },

  onUnload() {
    // 页面卸载时清除定时器
    if (this.data.intervalId) {
      clearInterval(this.data.intervalId)
    }
  },

  // 更新进度条
  updateProgress() {
    const progress = Math.round(((this.data.totalDistance - this.data.remainingDistance) / this.data.totalDistance) * 100)
    const progressWidth = progress + '%'
    
    this.setData({
      progress: progress,
      progressWidth: progressWidth
    })
    
    // 如果接近目标（50米内），跳转到地点揭秘页
    if (this.data.remainingDistance <= 50) {
      this.reachDestination()
    }
  },

  // 启动模拟导航
  startSimulation() {
    const intervalId = setInterval(() => {
      // 模拟移动（每秒减少5米距离）
      const newDistance = Math.max(0, this.data.remainingDistance - 5)
      this.setData({
        remainingDistance: newDistance
      })
      
      // 更新进度
      this.updateProgress()
      
      // 随机改变方向（仅作演示）
      if (Math.random() < 0.1) {
        const randomDirectionIndex = Math.floor(Math.random() * this.data.directions.length)
        const direction = this.data.directions[randomDirectionIndex]
        const rotation = randomDirectionIndex * 45
        
        this.setData({
          direction: direction,
          arrowRotation: rotation
        })
      }
    }, 1000)
    
    this.setData({
      intervalId: intervalId
    })
  },

  // 到达目的地
  reachDestination() {
    // 清除定时器
    if (this.data.intervalId) {
      clearInterval(this.data.intervalId)
    }
    
    // 跳转到地点揭秘页
    wx.redirectTo({
      url: '/pages/discovery/discovery'
    })
  },

  // 退出导航
  exitNavigation() {
    wx.showModal({
      title: '确定放弃探索吗？',
      content: '退出后当前盲盒将失效',
      success: (res) => {
        if (res.confirm) {
          // 清除定时器
          if (this.data.intervalId) {
            clearInterval(this.data.intervalId)
          }
          
          // 返回首页
          wx.redirectTo({
            url: '/pages/home/home'
          })
        }
      }
    })
  },

  // 刷新位置
  refreshLocation() {
    wx.showToast({
      title: '位置已刷新',
      icon: 'success'
    })
  }
})