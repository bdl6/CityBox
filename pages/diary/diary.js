// pages/diary/diary.js
Page({
  data: {
    placeName: '',
    photos: [],
    description: '',
    wordCount: 0,
    canSubmit: false
  },

  onLoad(options) {
    // 获取传入的地点名称
    const placeName = options.placeName ? decodeURIComponent(options.placeName) : '';
    this.setData({
      placeName: placeName
    });
  },

  // 上传照片
  uploadPhoto() {
    if (this.data.photos.length >= 3) {
      wx.showToast({
        title: '最多只能上传3张照片',
        icon: 'none'
      })
      return
    }

    wx.chooseImage({
      count: 3 - this.data.photos.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newPhotos = this.data.photos.concat(res.tempFilePaths)
        this.setData({
          photos: newPhotos
        })
        this.checkSubmitStatus()
      }
    })
  },

  // 删除照片
  deletePhoto(e) {
    const index = e.currentTarget.dataset.index
    const photos = this.data.photos
    photos.splice(index, 1)
    this.setData({
      photos: photos
    })
    this.checkSubmitStatus()
  },

  // 输入描述文字
  onInput(e) {
    const value = e.detail.value
    this.setData({
      description: value,
      wordCount: value.length
    })
    this.checkSubmitStatus()
  },

  // 检查是否可以提交
  checkSubmitStatus() {
    const canSubmit = this.data.photos.length > 0 && 
                      this.data.description.length >= 10 && 
                      this.data.description.length <= 200
    this.setData({
      canSubmit: canSubmit
    })
  },

  // 提交日记
  submitDiary() {
    if (!this.data.canSubmit) {
      if (this.data.photos.length === 0) {
        wx.showToast({
          title: '请至少上传一张照片',
          icon: 'none'
        })
      } else if (this.data.description.length < 10) {
        wx.showToast({
          title: '描述文字至少10个字',
          icon: 'none'
        })
      }
      return
    }

    // 显示提交成功提示
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    })

    // 模拟提交过程
    setTimeout(() => {
      // 返回地点揭秘页并刷新UGC区
      wx.navigateBack()
    }, 1500)
  }
})