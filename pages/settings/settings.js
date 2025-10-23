// pages/settings/settings.js
var QQMapWX = require('../../qqmap-wx-jssdk.min');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'KSSBZ-YWRWT-WX2X3-VQ7HA-UCGOO-TKB5T' // 请替换为您的有效密钥
});
const app = getApp();
Page({
  data: {
    rangeValue: 2.0,
    selectedTags: [],
    isArt:false,
    isFood:false,
    isOld:false,
    isNature:false,
    isMarket:false,
    isFun:false,
    isGiftBoxOpen: false,
  
  },


  
  // 生命周期函数，页面初次渲染完成时调用
  onReady() {
    console.log('标签选择器初始化完成，当前选中标签:', this.data.selectedTags)
  },

 

  // 帮助按钮点击事件
  showHelp() {
    wx.showModal({
      title: '设置说明',
      content: '范围建议 1-2 公里更易探索',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 范围滑块变化事件
  onRangeChange(e) {
    // 修复多位小数问题，保留一位小数
    const value = parseFloat(e.detail.value).toFixed(1)
    this.setData({
      rangeValue: parseFloat(value)
    })
  },

  // 标签选择切换事件
  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag
    let selectedTags = [...this.data.selectedTags] // 创建副本以避免直接修改原数组
    const index = selectedTags.indexOf(tag)
    if (index !== -1) {
      // 如果已选中，则取消选中
      selectedTags.splice(index, 1)
      // 添加取消选中的视觉反馈
      wx.showToast({
        title: `已取消选择"${tag}"`,
        icon: 'none',
        duration: 1000
      })
      
    } else {
      // 如果未选中，则添加选中
      selectedTags.push(tag)
      // 添加选中的视觉反馈
      wx.showToast({
        title: `已选择"${tag}"`,
        icon: 'success',
        duration: 1000
      })
    }
    app.setSelectedTags(selectedTags)
    console.log('已同步标签到globalData:', app.globalData.selectedTags);
    //以下是用来修改状态的屎山代码，被逼无奈了
{
    if(selectedTags.includes('文艺')){
      this.setData({
        isArt:true
      })
    }else{
      this.setData({
        isArt:false
      })
    }
    if(selectedTags.includes('印象城')){
      this.setData({
        isFood:true
      })
    }else{
      this.setData({
        isFood:false
      })
    }
    if(selectedTags.includes('复古')){
      this.setData({
        isOld:true
      })
    }else{
      this.setData({
        isOld:false
      })
    }
    if(selectedTags.includes('自然')){
      this.setData({
        isNature:true
      })
    }else{
      this.setData({
        isNature:false
      })
    }
    if(selectedTags.includes('小众市集')){
      this.setData({
        isMarket:true
      })
    }else{
      this.setData({
        isMarket:false
      })
    }
    if(selectedTags.includes('娱乐')){
      this.setData({
        isFun:true
      })
    }else{
      this.setData({
        isFun:false
      })
    }
  
    this.setData({
      selectedTags
    })
  }
},

  // 小礼盒开关切换事件
  toggleGiftBox() {
    this.setData({
      isGiftBoxOpen: !this.data.isGiftBoxOpen
    })
    if(this.data.isGiftBoxOpen){
      wx.showToast({
        title: '已启用盲盒推荐',
        icon:'success'
      })
      this.setData({
        selectedTags:['麦当劳']
      })
     
    }else{
      wx.showToast({
        title: '已关闭盲盒推荐',
        icon:'error'
      })
      this.setData({
        selectedTags:[]
      })
    }
    app.setSelectedTags(this.data.selectedTags)
  },
  
  // 触摸开始时添加active类，显示浅绿色
  handleBoxTouchStart: function() {
    this.setData({
      boxActive: true
    })
  },
  
  // 触摸结束时移除active类
  handleBoxTouchEnd: function() {
    setTimeout(() => {
      this.setData({
        boxActive: false
      })
    }, 100)
  },

  // 生成盲盒按钮点击事件
  generateBlindBox() {
    if (this.data.selectedTags.length === 0) {
      wx.showToast({
        title: '请至少选择一个兴趣标签',
        icon: 'none'
      })
      return
    }
    
    // 显示加载提示
    wx.showLoading({
      title: '盲盒生成中...'
    })
    
    // 确保距离值格式化为一位小数
    const formattedRange = parseFloat(this.data.rangeValue).toFixed(1)
    
    // 在 settings.js 顶部添加距离计算函数
function calculateDistance(lat1, lng1, lat2, lng2) {
  // 将经纬度转换为弧度
  const rad = (angle) => angle * Math.PI / 180
  
  const radLat1 = rad(lat1)
  const radLat2 = rad(lat2)
  const radLng1 = rad(lng1)
  const radLng2 = rad(lng2)
  
  // 地球半径（单位：米）
  const EARTH_RADIUS = 6371000
  
  // 计算差值
  const dLat = radLat2 - radLat1
  const dLng = radLng2 - radLng1
  
  // 使用Haversine公式计算距离
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  
  // 返回距离（单位：米）
  return EARTH_RADIUS * c
}

    // 1. 获取用户当前位置，计算距离
    wx.getLocation({
    type: 'gcj02',
    success: (res) => {
      const { latitude, longitude } = res
      
      // 2. 调用腾讯地图POI搜索API
      qqmapsdk.search({
        keyword: this.data.selectedTags.join('|'), // 组合标签
        location: { latitude, longitude },
        radius: this.data.rangeValue * 1000, // 转换为米
        page_size: 20, // 最多获取20个结果
        success: (mapRes) => {
          wx.hideLoading()
          // 3. 处理搜索结果
          const poiList = mapRes.data || []
          if (poiList.length === 0) {
            wx.hideLoading()
            wx.showToast({ title: '附近未找到匹配地点', icon: 'none' })
            return
          }
          
          // 4. 随机抽取一个地点，确保距离在范围内
          let selectedPOI = null
          let formattedDistance = 0
          let attempts = 0
          const maxAttempts = 10 // 最多尝试10次
          
          while (attempts < maxAttempts) {
            const randomIndex = Math.floor(Math.random() * poiList.length)
            selectedPOI = poiList[randomIndex]
            
            // 计算用户位置到POI点的距离（单位：米）
            const distanceMeters = calculateDistance(
              latitude,
              longitude,
              selectedPOI.location.lat,
              selectedPOI.location.lng
            )
            
            formattedDistance = parseInt(distanceMeters)
            const rangeMeters = this.data.rangeValue * 1000
            
            if (formattedDistance <= rangeMeters) {
              break // 找到符合条件的点
            }
            
            attempts++
          }
          
          if (attempts >= maxAttempts) {
            wx.hideLoading()
            wx.showToast({
              title: `附近${this.data.rangeValue}公里内未找到匹配地点`,
              icon: 'none'
            })
            return
          }
          
          console.log('最终选择的地点:', selectedPOI)
          app.setSelectedPOI(selectedPOI)
          app.setRange(this.data.rangeValue)
          wx.navigateTo({
            url: `/pages/blindbox/blindbox?distance=${formattedDistance}`
          })

          
        },
        fail: () => {
          wx.hideLoading()
          wx.showToast({ title: '获取poi失败', icon: 'none' })
        }
    })
    },
    fail:()=>{
      wx.showToast({
        title: '获取当前位置失败',
      })
    }
    })




  }
})