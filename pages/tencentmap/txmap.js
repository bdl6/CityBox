// my_location.js
// 引入SDK核心类
var QQMapWX = require('../../qqmap-wx-jssdk.min');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'KSSBZ-YWRWT-WX2X3-VQ7HA-UCGOO-TKB5T' // 请替换为您的有效密钥
});

Page({
  data: {
    longitude: null, // 默认
    latitude: null,   // 默认为空
    hasLocation:false, //有无定位
    scale: 16,          // 默认缩放级别
    markers: [],        // 存储用户位置和POI点标记
    poiMarkers: [],     // 单独存储POI点标记
    currentKeyword: null, // 当前显示的POI类型
    polyline:[]
  },

  onLoad() {
    this.getLocation();
  },

  // 获取用户位置
  getLocation() {
    wx.showLoading({
      title: '定位中...'
    });

    wx.getLocation({
      type: 'gcj02', // 必须使用gcj02坐标系
      success: (res) => {
        wx.hideLoading();
        
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          hasLocation:true,
          markers: [{
            id: 0,
            longitude: res.longitude,
            latitude: res.latitude,
            width: 30,
            height: 30,
            callout: {
              content: '我的位置',
              color: '#fff',
              fontSize: 14,
              borderRadius: 10,
              bgColor: '#07C160',
              padding: 8,
              display: 'ALWAYS'
            },
            label: {
              content: '我的位置',
              color: '#07C160',
              fontSize: 12,
              anchorX: 0,
              anchorY: 0,
              borderWidth: 1,
              borderColor: '#07C160',
              borderRadius: 3,
              bgColor: '#fff',
              padding: 3
            }
          }]
        });
        
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        });
        // 检查用户授权状态
wx.getSetting({
  success(res) {
    if (!res.authSetting['scope.userLocation']) {
      // 未授权时请求授权
      wx.authorize({
        scope: 'scope.userLocation',
        success() {
          console.log('授权成功')
        },
        fail() {
          // 引导用户手动开启
          wx.showModal({
            title: '权限提示',
            content: '请在设置中开启位置权限',
            showCancel: false
          })
        }
      })
    }
  }
})
        console.error('定位失败:', err);
        this.handleLocationError(err)
        
        // 默认显示北京位置
        this.setData({
          longitude: 116.404,
          latitude: 39.915
        });
        
      }
    });
  },
  // 处理定位失败
handleLocationError(err) {
  let msg = '定位失败'
  switch (err.errCode) {
    case 1:
      msg = '用户拒绝授权'; break;
    case 2:
      msg = '位置不可用'; break;
    case 3:
      msg = '请求超时'; break;
  }
  
  wx.showModal({
    title: '定位提示',
    content: msg,
    confirmText: '去设置',
    success(res) {
      if (res.confirm) {
        // 打开系统设置
        wx.openSetting()
      }
    }
  })
},

  // 搜索附近POI点
  nearby_search: function(e) {
    var _this = this;
    const keyword = e && e.currentTarget && e.currentTarget.dataset.keyword || 'KTV';
    
    wx.showLoading({
      title: '搜索中...'
    });
    
    // 使用用户位置或默认位置
    const location = `${_this.data.latitude},${_this.data.longitude}`;
    
    // 调用接口
    qqmapsdk.search({
      keyword: keyword,  // 搜索关键词
      location: location,  // 使用当前位置
      page_size: 20, // 限制返回数量
      success: function (res) {
        wx.hideLoading()
        console.log('搜索成功:', res)
        var poiMarkers = [];
        for (var i = 0; i < res.data.length; i++) {
          poiMarkers.push({
            title: res.data[i].title,
            id: Number(res.data[i].id),
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            width: 25,
            height: 25,
            callout: {
              content: res.data[i].title,
              color: '#fff',
              fontSize: 12,
              borderRadius: 5,
              bgColor: '#0081FF',
              padding: 5
            },
            label: {
              content: res.data[i].category,
              color: '#0081FF',
              fontSize: 10,
              borderWidth: 1,
              borderColor: '#0081FF',
              borderRadius: 2,
              bgColor: '#fff',
              padding: 2
            }
          });
        }
        
        // 清空原有POI点，只保留用户位置标记
        const userLocationMarker = _this.data.markers.find(m => m.id === 0);
        _this.setData({
          poiMarkers: poiMarkers,
          markers: userLocationMarker ? [userLocationMarker, ...poiMarkers] : [...poiMarkers]
        });
        
      },
      fail: function (res) {
        console.error('POI搜索失败:', res);
        wx.hideLoading()
        if (res.status === 121) {
          wx.showToast({
            title: '服务已达上限',
            icon: 'none'
          });
        }
      }
    });
  },

  

  // 清除所有POI点
  clearAllPOI: function() {
    wx.showLoading({
      title: '清除中...'
    });
    
    // 确保保留用户位置标记
    const userMarker = this.data.markers.find(m => m.id === 0) || [];
    const newMarkers = userMarker ? [userMarker] : [];
    
    // 强制更新数据
    this.setData({
      markers: newMarkers,
      poiMarkers: [],
      polyline: []
    }, () => {
      console.log('清除后数据状态:', {
        markers: this.data.markers,
        poiMarkers: this.data.poiMarkers
      });
      
      // 双重确保地图更新
      this.setData({
        refreshMap: Date.now(),
        'mapKey': Date.now() // 强制重新渲染地图组件
      }, () => {
        wx.hideLoading();
        wx.showToast({
          title: '已清除所有POI点',
          icon: 'success'
        });
        
        // 调试用 - 打印当前地图上的标记点
        setTimeout(() => {
          console.log('当前地图标记点:', this.data.markers);
          console.log('当前POI标记点:', this.data.poiMarkers);
        }, 500);
      });
    });
  },

  // 随机导航相关变量
  navigationInterval: null,
  refreshCount: 0,
  
  // 随机选择一个POI点导航
  randomNavigate: function() {
    const that = this;
    if (this.data.poiMarkers.length === 0) {
      wx.showToast({
        title: '没有可导航的POI点',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '路径规划中...'
    });
    
    // 清除旧路线和定时器
    if (this.navigationInterval) {
      clearInterval(this.navigationInterval);
      this.navigationInterval = null;
    }
    
    const randomIndex = Math.floor(Math.random() * this.data.poiMarkers.length);
    const randomPOI = this.data.poiMarkers[randomIndex];
    
    // 调用路径规划
    qqmapsdk.direction({
      mode: 'driving',
      from: `${this.data.latitude},${this.data.longitude}`,
      to: `${randomPOI.latitude},${randomPOI.longitude}`,
      success: function(res) {
        wx.hideLoading();
        console.log('路径规划结果:', res);
        
        if (!res.result || !res.result.routes || res.result.routes.length === 0) {
          wx.showToast({
            title: '未找到可行路线',
            icon: 'none'
          });
          return;
        }
        
        const route = res.result.routes[0];
        const distance = (route.distance / 1000).toFixed(1) + '公里';
        
        // 处理polyline坐标点 - 添加数据验证
        const points = [];
        const coords = route.polyline;
        for (let i = 0; i < coords.length; i++) {
          const lat = Number(coords[i].lat);
          const lng = Number(coords[i].lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            points.push({
              latitude: lat,
              longitude: lng
            });
          } else {
            console.warn('忽略无效坐标点:', coords[i]);
          }
        }
        
        if (points.length === 0) {
          wx.showToast({
            title: '无效路线数据',
            icon: 'none'
          });
          return;
        }
        
        // 提取导航步骤信息
        const steps = route.steps.map(step => ({
          instruction: step.instruction,
          distance: (step.distance / 1000).toFixed(1) + '公里',
          duration: Math.ceil(step.duration / 60) + '分钟',
          road: step.road_name || '无名道路',
          direction: step.direction
        }));

        that.setData({
          polyline: [{
            points: points,
            color: '#0081FF',
            width: 6,
            dottedLine: false,
            arrowLine: true
          }],
          distance: distance,
          destination: randomPOI,
          navigationSteps: steps // 保存导航步骤
        }, () => {
          console.log('polyline设置完成:', that.data.polyline);
          // 开始模拟位置更新
          that.simulateNavigation(points);
        });
      },
      fail: function(err) {
        wx.hideLoading();
        console.error('路径规划失败:', err);
        wx.showToast({
          title: '路径规划失败',
          icon: 'none'
        });
      }
    });
  },
  
  // 模拟导航位置更新
  simulateNavigation: function(points) {
    const that = this;
    let currentIndex = 0;
    this.refreshCount = 0;
    
    this.navigationInterval = setInterval(() => {
      if (currentIndex >= points.length - 1) {
        clearInterval(this.navigationInterval);
        wx.showToast({ title: '已到达目的地', icon: 'success' });
        return;
      }
      
      // 每5次更新移动一个点
      if (this.refreshCount % 5 === 0) {
        currentIndex++;
        const newPosition = points[currentIndex];
        
        // 更新当前位置标记
        const newMarkers = [...that.data.markers.filter(m => m.id === 0)];
        newMarkers[0].latitude = newPosition.latitude;
        newMarkers[0].longitude = newPosition.longitude;
        
        // 计算剩余距离
        const remainingPoints = points.slice(currentIndex);
        const remainingDistance = (remainingPoints.length * 0.01).toFixed(1) + '公里';
        
        that.setData({
          markers: newMarkers,
          longitude: newPosition.longitude,
          latitude: newPosition.latitude,
          distance: remainingDistance
        });
      }
      
      that.refreshCount++;
    }, 500); // 每0.5秒更新一次
  },

  // 标记点点击事件
  onMarkerTap: function(e) {
    const markerId = e.markerId;
    const marker = this.data.markers.find(m => m.id === markerId);
    if (marker) {
      wx.showActionSheet({
        itemList: ['查看详情', '导航到此处'],
        success: (res) => {
          if (res.tapIndex === 0) {
            wx.showModal({
              title: marker.callout.content,
              content: `位置: ${marker.latitude.toFixed(6)}, ${marker.longitude.toFixed(6)}`,
              showCancel: false
            });
          } else if (res.tapIndex === 1) {
            wx.openLocation({
              latitude: marker.latitude,
              longitude: marker.longitude,
              name: marker.callout.content,
              address: ''
            });
          }
        }
      });
    }
  }
});