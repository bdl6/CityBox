// pages/discovery/discovery.js
Page({
  data: {
    place: null,
    range: 0,
    tags: []
  },

  onLoad(options) {
    // 获取传入的参数
    const place = JSON.parse(options.place || '{}');
    const range = parseFloat(options.range) || 2.0;
    const tags = JSON.parse(options.tags || '[]');
    
    this.setData({
      place: place,
      range: range,
      tags: tags
    });
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