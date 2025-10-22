// pages/navigation/navigation.js
var QQMapWX = require('../../qqmap-wx-jssdk.min');
var qqmapsdk = new QQMapWX({
  key: 'KSSBZ-YWRWT-WX2X3-VQ7HA-UCGOO-TKB5T' // 请替换为您的有效密钥
});
const app = getApp()
Page({
  data: {
    isFirst:true,
    totalDistance:0,
    remainingDistance: 0,
    progress: 0,
    progressWidth: '0%',
    startlongitude: null, 
    startlatitude: null,  
    poiLat:null,
    poiLng:null,
    direction:null,
    timerId:null
  },

  onLoad(options) {
    //获取位置
    this.getLocation()
    // 获取传入的距离参数
    const distance = options.distance 
    const poiLat = app.globalData.selectedPOI.location.lat
    const poiLng = app.globalData.selectedPOI.location.lng
   

    this.setData({
      poiLat,
      poiLng,
      totalDistance: parseInt(distance),
      remainingDistance: parseInt(distance),
    })
    this.getRemainDis()
    this.updateProgress()
  },

  

      getLocation(){
        wx.showLoading({ title: '定位中...', mask: true })
        wx.getLocation({
          type: 'gcj02', // 必须使用gcj02坐标系
          success: (res) => {
            wx.hideLoading();
            console.log("现在为止是",res)
            this.setData({
              startlatitude:res.latitude,
              startlongitude:res.longitude
            })
          },
          fail: (err) => {
            console.error('定位失败:', err)
            wx.showToast({ title: '定位失败', icon: 'error' })
          },
          complete: () => {
            // 5. 确保始终隐藏loading
            wx.hideLoading()
          }
        })
      },
      
      getRemainDis(){
        qqmapsdk.direction({
          mode: 'walking',
          //from参数不填默认当前地址
         
          to: {
            latitude: this.data.poiLat,
            longitude: this.data.poiLng
          }, 
          success: (res)=> {
    
           console.log(res.result.routes[0])
           const distance = res.result.routes[0].distance
           const direction = res.result.routes[0].direction
           console.log("距离",distance)
           console.log("方向",direction)
           if(this.data.isFirst){
             this.setData({
              totalDistance:distance,
              isFirst:false
             })    
           }
           this.setData({
             direction,
             remainingDistance:distance
           })
           console.log("总距离",this.data.totalDistance)
           
          },
          fail:(res)=>{
            console.log(res)
            wx.showToast({
              title: '路径规划失败',
            })
          }
    
        
        })
      },
  

  // 更新进度条
  updateProgress() {
    let timerId=setInterval(()=>{
      this.getRemainDis()
      const progress = Math.round(((this.data.totalDistance - this.data.remainingDistance) / this.data.totalDistance) * 100)
      const progressWidth = progress + '%'
      
      this.setData({
        progress: progress,
        progressWidth: progressWidth
      })
      console.log("记录中")
      // 如果接近目标（50米内），跳转到地点揭秘页
      if (this.data.remainingDistance <= 80) {
        this.reachDestination()
      }
    },5000)
    this.setData({
      timerId,
    })
  },

 

  // 到达目的地
  reachDestination() {
    // 跳转到地点揭秘页
    wx.redirectTo({
      url: '/pages/discovery/discovery'
    })
    if(this.data.timerId){
      clearInterval(this.data.timerId)
    }
  },

  // 退出导航
  exitNavigation() {
    wx.showModal({
      title: '确定放弃探索吗？',
      content: '退出后当前盲盒将失效',
      success: (res) => {
        if (res.confirm) {
         
          // 返回首页
          wx.redirectTo({
            url: '/pages/home/home'
          })
        }
      }
    })
  },

  // 刷新位置
  refreshLocation() {
    wx.showToast({
      title: '位置已刷新',
      icon: 'success'
    })
    this.getRemainDis()
    this.reachDestination()
  }
})