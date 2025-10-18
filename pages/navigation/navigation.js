// pages/navigation/navigation.js
// 引入腾讯地图SDK
var QQMapWX = require('../../qqmap-wx-jssdk.min.js');

Page({
  data: {
    range: 0,
    tags: [],
    place: null,
    totalDistance: 0,
    remainingDistance: 0,
    progress: 0,
    progressWidth: '0%',
    arrowRotation: 0,
    direction: '东北',
    directions: ['东北', '东', '东南', '南', '西南', '西', '西北', '北'],
    intervalId: null,
    userLocation: null
  },

  onLoad(options) {
    // 获取传入的参数
    const range = parseFloat(options.range) || 2.0
    const distance = options.distance || 1000
    const tags = JSON.parse(options.tags || '[]')
    const place = JSON.parse(options.place || '{}')
    
    this.setData({
      range: range,
      tags: tags,
      place: place,
      totalDistance: parseInt(distance),
      remainingDistance: parseInt(distance)
    })
    
    // 获取用户位置
    this.getUserLocation(() => {
      // 如果有地点信息，则计算真实导航路径
      if (this.data.place && this.data.userLocation) {
        this.calculateRoute();
      } else {
        // 否则使用模拟导航
        this.initSimulation();
      }
    });
  },

  onUnload() {
    // 页面卸载时清除定时器
    if (this.data.intervalId) {
      clearInterval(this.data.intervalId);
    }
  },

  // 获取用户位置
  getUserLocation(callback) {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
        
        if (callback) callback();
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
        
        // 获取位置失败时也初始化模拟导航
        if (callback) callback();
      }
    });
  },

  // 计算真实导航路径
  calculateRoute() {
    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: 'KSSBZ-YWRWT-WX2X3-VQ7HA-UCGOO-TKB5T'
    });
    
    // 调用腾讯地图API获取步行路径
    qqmapsdk.direction({
      mode: 'walking',
      from: {
        latitude: this.data.userLocation.latitude,
        longitude: this.data.userLocation.longitude
      },
      to: {
        latitude: this.data.place.location ? this.data.place.location.lat : 0,
        longitude: this.data.place.location ? this.data.place.location.lng : 0
      },
      success: (res) => {
        console.log('路径规划成功:', res);
        // 这里可以处理路径数据，但在当前简化版本中我们仍然使用模拟导航
        this.initSimulation();
      },
      fail: (err) => {
        console.error('路径规划失败:', err);
        wx.showToast({
          title: '路径规划失败，使用模拟导航',
          icon: 'none'
        });
        this.initSimulation();
      }
    });
  },

  // 初始化模拟导航
  initSimulation() {
    // 初始化方向（随机选择一个方向）
    const randomDirectionIndex = Math.floor(Math.random() * this.data.directions.length);
    const direction = this.data.directions[randomDirectionIndex];
    const rotation = randomDirectionIndex * 45; // 每个方向相差45度
    
    this.setData({
      direction: direction,
      arrowRotation: rotation
    });
    
    // 更新进度
    this.updateProgress();
    
    // 启动模拟导航
    this.startSimulation();
  },

  // 更新进度条
  updateProgress() {
    const progress = Math.round(((this.data.totalDistance - this.data.remainingDistance) / this.data.totalDistance) * 100);
    const progressWidth = progress + '%';
    
    this.setData({
      progress: progress,
      progressWidth: progressWidth
    });
    
    // 如果接近目标（50米内），跳转到地点揭秘页
    if (this.data.remainingDistance <= 50) {
      this.reachDestination();
    }
  },

  // 启动模拟导航
  startSimulation() {
    const intervalId = setInterval(() => {
      // 模拟移动（每秒减少5米距离）
      const newDistance = Math.max(0, this.data.remainingDistance - 5);
      this.setData({
        remainingDistance: newDistance
      });
      
      // 更新进度
      this.updateProgress();
      
      // 随机改变方向（仅作演示）
      if (Math.random() < 0.1) {
        const randomDirectionIndex = Math.floor(Math.random() * this.data.directions.length);
        const direction = this.data.directions[randomDirectionIndex];
        const rotation = randomDirectionIndex * 45;
        
        this.setData({
          direction: direction,
          arrowRotation: rotation
        });
      }
    }, 1000);
    
    this.setData({
      intervalId: intervalId
    });
  },

  // 到达目的地
  reachDestination() {
    // 清除定时器
    if (this.data.intervalId) {
      clearInterval(this.data.intervalId);
    }
    
    // 跳转到地点揭秘页，传递参数
    let url = `/pages/discovery/discovery?range=${this.data.range}&tags=${JSON.stringify(this.data.tags)}`;
    if (this.data.place) {
      url += `&place=${JSON.stringify(this.data.place)}`;
    }
    wx.redirectTo({
      url: url
    });
  },

  // 退出导航
  exitNavigation() {
    wx.showModal({
      title: '确定放弃探索吗？',
      content: '退出后当前盲盒将失效',
      success: (res) => {
        if (res.confirm) {
          // 清除定时器
          if (this.data.intervalId) {
            clearInterval(this.data.intervalId);
          }
          
          // 返回盲盒生成页
          wx.redirectTo({
            url: '/pages/blindbox/generate'
          });
        }
      }
    });
  },

  // 刷新位置
  refreshLocation() {
    wx.showToast({
      title: '位置已刷新',
      icon: 'success'
    });
  }
})