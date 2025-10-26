const app = getApp()
Page({
  data: {
    imageList: [],
    desc: '',
    title:'',
    descLength: 0
  },
onLoad(){
  const title = app.globalData.selectedPOI.title
  this.setData({
    title
  })
}, 
  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 3 - this.data.imageList.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imageList: this.data.imageList.concat(res.tempFilePaths)
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