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
    if (this.data.desc.length < 1 || this.data.desc.length > 200) {
      wx.showToast({
        title: '请输入10-200字的感受',
        icon: 'none'
      });
      return;
    }
    // 发布逻辑
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/myexploration/myexploration`
      })
    }, 1500);
  }
});