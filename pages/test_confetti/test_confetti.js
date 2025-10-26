// pages/test_confetti/test_confetti.js
const MiniConfetti = require('../../utils/confetti');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusText: '点击按钮测试',
    // 存储彩带数据
    confettiData: [],
    // 存储彩带动画
    confettiAnimation: []
  },
  
  // 彩带动画实例
  confettiInstance: null,
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('页面加载');
    // 初始化彩带实例，传入页面上下文
    this.confettiInstance = new MiniConfetti(this);
  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('页面卸载，清理资源');
    // 清理资源
    if (this.confettiInstance) {
      this.confettiInstance.clear();
    }
  },
  
  // 简单的按钮点击测试函数
  simpleTest: function() {
    console.log('简单测试按钮被点击');
    this.setData({
      statusText: '按钮点击成功! ' + new Date().getTime()
    });
  },
  
  /**
   * 触发彩带效果 - 使用新版MiniConfetti
   */
  triggerConfetti: function () {
    console.log('triggerConfetti被调用');
    this.setData({
      statusText: '开始生成彩带...'
    });
    
    try {
      // 检查是否已初始化彩带实例
      if (!this.confettiInstance) {
        console.log('初始化彩带实例');
        this.confettiInstance = new MiniConfetti(this);
      }
      
      console.log('调用addConfetti方法');
      // 添加彩带效果
      const result = this.confettiInstance.addConfetti({
        confettiNumber: 350,
        confettiColors: ['#fcf403', '#62fc03', '#f4fc03', '#03e7fc', '#03fca5', '#a503fc', '#fc03ad', '#fc03c2'],
        confettiRadius: 4
      });
      
      console.log('彩带添加结果:', result);
      this.setData({
        statusText: '彩带生成成功!'
      });
      
      // 5秒后重置状态文本
      setTimeout(() => {
        if (this.data.statusText === '彩带生成成功!') {
          this.setData({
            statusText: '点击按钮再次测试'
          });
        }
      }, 5000);
      
    } catch (error) {
      console.error('触发彩带效果失败:', error);
      this.setData({
        statusText: '触发失败: ' + error.message
      });
    }
  }
})