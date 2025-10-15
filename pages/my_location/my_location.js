
Page({
  data: {
    longitude: 0,
    latitude: 0,
  },

  onLoad() {
    this.getLocation()
  },

  getLocation() {
    wx.showLoading({
      title: '定位中...'
    })

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        wx.hideLoading()
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers: [{
            id: 0,
            longitude: res.longitude,
            latitude: res.latitude,
            iconPath:'../../images/marker.png',
            width: 30,
            height: 30
          }]
        })
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        })
        console.error('定位失败:', err)
        // 默认显示北京位置
        this.setData({
          longitude: 116.404,
          latitude: 39.915
        })
      }
    })
  }
 


  
 

})