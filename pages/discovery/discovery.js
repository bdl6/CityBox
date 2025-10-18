// pages/discovery/discovery.js
Page({
  data: {

  },

  onLoad(options) {

  },

  // 上传照片
  uploadPhoto() {
    wx.chooseImage({
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
    wx.navigateTo({
      url: '/pages/diary/diary'
    })
  }
})