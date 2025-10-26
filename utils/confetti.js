/**
 * 小程序彩带效果工具类 - 简化版本
 * 使用微信小程序动画API实现，更兼容微信小程序环境
 */
class MiniConfetti {
  constructor(pageContext) {
    // 存储页面上下文，用于创建和管理动画
    this.page = pageContext;
    // 存储创建的彩带视图ID
    this.confettiViews = [];
    // 存储动画实例
    this.animations = [];
    // 获取屏幕尺寸
    const { windowWidth, windowHeight } = wx.getWindowInfo();
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  }

  /**
   * 添加彩带效果
   * @param {Object} options 配置选项
   */
  addConfetti(options = {}) {
    const {
      confettiNumber = 100,
      confettiColors = ['#fcf403', '#62fc03', '#f4fc03', '#03e7fc', '#03fca5', '#a503fc', '#fc03ad', '#fc03c2'],
      confettiRadius = 4
    } = options;
    
    console.log('开始添加彩带，数量:', confettiNumber);
    
    // 清除之前的彩带效果
    this.clear();
    
    // 创建新的彩带数据列表
    const confettiData = [];
    for (let i = 0; i < confettiNumber; i++) {
      confettiData.push({
        id: `confetti_${Date.now()}_${i}`,
        x: Math.random() * this.windowWidth,
        y: -50, // 从屏幕顶部上方开始
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: confettiRadius * 2,
        delay: Math.random() * 1000 // 随机延迟，使效果更自然
      });
    }
    
    // 在页面数据中存储彩带数据
    this.page.setData({
      confettiData: confettiData
    });
    
    // 为每个彩带创建动画
    setTimeout(() => {
      this.animateConfetti(confettiData);
    }, 50);
    
    return true;
  }

  /**
   * 为彩带创建动画
   */
  animateConfetti(confettiData) {
    console.log('开始彩带动画');
    
    confettiData.forEach((confetti, index) => {
      // 计算目标位置（飘落到底部）
      const targetY = this.windowHeight + 50;
      // 计算水平偏移（随机左右飘动）
      const xOffset = (Math.random() - 0.5) * 200;
      
      // 创建动画实例
      const animation = wx.createAnimation({
        duration: 3000 + Math.random() * 2000, // 动画持续时间随机
        timingFunction: 'ease-in',
        delay: confetti.delay,
        transformOrigin: '50% 50%'
      });
      
      // 存储动画实例
      this.animations.push({
        id: confetti.id,
        animation: animation
      });
      
      // 执行动画
      animation.translate(xOffset, targetY)
        .rotate(Math.random() * 720 - 360) // 随机旋转
        .opacity(0)
        .step();
      
      // 更新页面数据
      const animationData = {};
      animationData[`confettiAnimation[${index}]`] = animation.export();
      this.page.setData(animationData);
      
      // 动画结束后清理
      setTimeout(() => {
        this.removeConfetti(confetti.id);
      }, 5000 + confetti.delay);
    });
  }

  /**
   * 移除单个彩带
   */
  removeConfetti(id) {
    // 从列表中移除
    const index = this.confettiViews.indexOf(id);
    if (index > -1) {
      this.confettiViews.splice(index, 1);
    }
    
    // 从动画实例中移除
    this.animations = this.animations.filter(item => item.id !== id);
  }

  /**
   * 清除所有彩带效果
   */
  clear() {
    console.log('清除所有彩带');
    // 清除页面上的彩带数据和动画
    if (this.page.data) {
      this.page.setData({
        confettiData: [],
        confettiAnimation: []
      });
    }
    
    // 清空存储的引用
    this.confettiViews = [];
    this.animations = [];
  }
}

module.exports = MiniConfetti;