// pages/myexploration/myexploration.js
Page({
  data: {
    explorationCount: 0,
    explorations: []
  },

  onLoad(options) {
    // 模拟加载探索记录数据
    this.loadExplorations()
  },

  // 模拟加载探索记录
  loadExplorations() {
    // 实际应用中这里应该从服务器或本地存储加载数据
    const explorations = [
      {
        id: 1,
        name: "街角旧书店",
        date: "2023.10.15",
        description: "隐藏在巷子里的复古咖啡馆，老板很健谈，咖啡超香，环境安静舒适，适合一个人发呆。",
        image: "/images/bookstore.jpg",
        distance: "1.2km",
        tags: ["文艺", "安静"]
      },
      {
        id: 2,
        name: "隐藏咖啡馆",
        date: "2023.09.22",
        description: "一家很有特色的咖啡馆，装修风格独特，咖啡豆都是老板自己烘焙的，非常香醇。",
        image: "/images/cafe.jpg",
        distance: "800m",
        tags: ["咖啡", "特色"]
      },
      {
        id: 2,
        name: "隐藏咖啡馆",
        date: "2023.09.22",
        description: "一家很有特色的咖啡馆，装修风格独特，咖啡豆都是老板自己烘焙的，非常香醇。",
        image: "/images/cafe.jpg",
        distance: "800m",
        tags: ["咖啡", "特色"]
      }
    ]
    
    this.setData({
      explorationCount: explorations.length,
      explorations: explorations
    })
  },

  // 跳转到地点揭秘页
  goToDiscovery(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/discovery/discovery?id=' + id
    })
  },

  // 去探索按钮点击事件
  goToHome() {
    wx.redirectTo({
      url: '/pages/home/home'
    })
  }
})