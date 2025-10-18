// pages/home/home.js
Page({
  data: {
    showParticles: false,
    particles: []
  },

  onLoad(options) {

  },

  // 开始探索按钮点击事件
  startExplore() {
    // 创建爆炸效果
    this.createExplosionEffect();
    
    // 延迟跳转以显示动画效果
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/settings/settings'
      })
    }, 800);
  },

  // 创建爆炸效果
  createExplosionEffect() {
    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        left: Math.random() * wx.getSystemInfoSync().windowWidth,
        top: Math.random() * wx.getSystemInfoSync().windowHeight * 0.5 + wx.getSystemInfoSync().windowHeight * 0.25,
        size: Math.random() * 10 + 5,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.8 + 0.2})`,
        delay: Math.random() * 300
      });
    }
    
    this.setData({
      showParticles: true,
      particles: particles
    });
    
    // 动画结束后隐藏粒子
    setTimeout(() => {
      this.setData({
        showParticles: false
      });
    }, 1000);
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
  }
})