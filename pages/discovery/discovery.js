const app = getApp()
const MiniConfetti = require('../../utils/confetti');
Page({
  data: {
    place: null,
    tags: [],
    systemInfo: null,
    // 存储彩带数据
    confettiData: [],
    // 存储彩带动画
    confettiAnimation: [],
    // 礼物盒状态
    isGiftOpened: false,
    // 礼物盒动画
    giftAnimation: ''
  },
  
  // 彩带动画实例
  confettiInstance: null,

  
  onLoad() {
    const systemInfo = wx.getWindowInfo()
    const place = app.globalData.selectedPOI
    const tags = app.globalData.selectedTags
    this.setData({
      systemInfo,
      place,
      tags
    });
    
    // 初始化彩带实例
    this.confettiInstance = new MiniConfetti(this);
  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 清理资源
    if (this.confettiInstance) {
      this.confettiInstance.clear();
    }
  },
  onReady() {
    // 确保页面渲染完成后再执行动画
    wx.setEnableDebug({ enableDebug: true })
  },

  /**
   * 打开礼物盒
   */
  openGift() {
    // 设置礼物盒打开动画
    this.setData({
      giftAnimation: 'gift-open'
    });

    // 延迟后显示地点信息并触发彩带效果
    setTimeout(() => {
      // 显示地点信息
      this.setData({
        isGiftOpened: true
      });

      // 触发彩带效果
      this.triggerConfetti();
    }, 800); // 等待礼物盒动画完成
  },
  
  /**
   * 触发彩带效果
   */
  triggerConfetti: function () {
    
    try {
      // 检查是否已初始化彩带实例
      if (!this.confettiInstance) {
        this.confettiInstance = new MiniConfetti(this);
      }
      
      // 添加彩带效果
      this.confettiInstance.addConfetti({
        confettiNumber: 150,
        confettiColors: ['#fcf403', '#62fc03', '#f4fc03', '#03e7fc', '#03fca5', '#a503fc', '#fc03ad', '#fc03c2'],
        confettiRadius: 4
      });
      
    } catch (error) {
      console.error('触发彩带效果失败:', error);
    }
  },
 
  
    
 
  // 上传照片
  uploadPhoto() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showToast({
          title: '图片上传成功',
          icon: 'success'
        })
      }
    })
  },

  // 写探索日记
  writeDiary() {
    // 传递地点名称到日记页面
    const placeName = this.data.place ? this.data.place.title : '未知地点';
    wx.navigateTo({
      url: `/pages/diary/diary?placeName=${encodeURIComponent(placeName)}`
    })
  },

  // 查看更多探索日记
  viewMoreDiaries() {
    // 传递地点名称到UGC页面
    const placeName = this.data.place ? this.data.place.title : '未知地点';
    wx.navigateTo({
      url: `/pages/discovery/ugc?placeName=${encodeURIComponent(placeName)}`
    })
  }
})