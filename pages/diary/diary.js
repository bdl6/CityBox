const app = getApp()
Page({
  data: {
    imageList: [],
    desc: '',
    title: '',
    descLength: 0
  },
  onLoad() {
    const title = app.globalData.selectedPOI.title
    this.setData({
      title
    })
  },
  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 3 - this.data.imageList.length,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('完整返回数据:', res); // 调试日志

        // 处理返回的图片数据
        let imagePaths = [];
        if (res.tempFiles && res.tempFiles.length > 0) {
          // 新版本 API 返回 tempFiles 数组
          imagePaths = res.tempFiles.map(file => file.tempFilePath);
          console.log('从 tempFiles 获取路径:', imagePaths);
        } else if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          // 兼容旧版本 API
          imagePaths = res.tempFilePaths;
          console.log('从 tempFilePaths 获取路径:', imagePaths);
        }

        if (imagePaths.length > 0) {
          this.setData({
            imageList: this.data.imageList.concat(imagePaths)
          }, () => {
            console.log('当前图片列表:', this.data.imageList);
          });
        } else {
          console.warn('未获取到有效的图片路径');
        }
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },
  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const newList = this.data.imageList.filter((_, i) => i !== index);
    this.setData({
      imageList: newList
    });
  },
  // 输入描述
  inputDesc(e) {
    const desc = e.detail.value;
    this.setData({
      desc,
      descLength: desc.length
    });
  },
  // 发布
  publish() {
    if (this.data.imageList.length === 0) {
      wx.showToast({
        title: '请上传现场照片',
        icon: 'none'
      });
      return;
    }
    if (this.data.desc.length < 10 || this.data.desc.length > 200) {
      wx.showToast({
        title: '请输入10-200字的感受',
        icon: 'none'
      });
      return;
    }

    // 保存探索记录到本地存储
    this.saveExploration();
  },

  // 保存探索记录
  saveExploration() {
    try {
      // 获取现有的探索记录
      const existingExplorations = wx.getStorageSync('explorations') || []
      
      // 创建新的探索记录
      const newExploration = {
        id: Date.now(), // 使用时间戳作为唯一ID
        name: this.data.title || '未知地点',
        date: this.formatDate(new Date()),
        description: this.data.desc,
        image: this.data.imageList[0] || '', // 使用第一张图片作为封面
        images: this.data.imageList, // 保存所有图片
        distance: this.calculateDistance(), // 计算距离
        tags: this.generateTags() // 生成标签
      }

      // 添加到记录列表开头（最新的在前面）
      existingExplorations.unshift(newExploration)
      
      // 保存到本地存储
      wx.setStorageSync('explorations', existingExplorations)
      
      console.log('保存探索记录成功:', newExploration)
      
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
      
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/myexploration/myexploration`
        })
      }, 1500);
      
    } catch (error) {
      console.error('保存探索记录失败:', error)
      wx.showToast({
        title: '发布失败，请重试',
        icon: 'none'
      });
    }
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  },

  // 计算距离（模拟）
  calculateDistance() {
    // 这里可以根据实际位置计算距离，暂时返回随机值
    const distances = ['500m', '800m', '1.2km', '1.5km', '2.1km']
    return distances[Math.floor(Math.random() * distances.length)]
  },

  // 生成标签
  generateTags() {
    const allTags = ['文艺', '安静', '咖啡', '特色', '美食', '风景', '历史', '现代', '传统', '创意']
    // 随机选择1-3个标签
    const tagCount = Math.floor(Math.random() * 3) + 1
    const selectedTags = []
    
    for (let i = 0; i < tagCount; i++) {
      const randomTag = allTags[Math.floor(Math.random() * allTags.length)]
      if (!selectedTags.includes(randomTag)) {
        selectedTags.push(randomTag)
      }
    }
    
    return selectedTags
  }
});