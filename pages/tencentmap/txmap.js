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
        
        // 更新POI标记
        _this.setData({
          poiMarkers: poiMarkers
        });
        
        // 合并所有标记（用户位置+POI点）
        const allMarkers = [..._this.data.markers, ...poiMarkers];
        _this.setData({
          markers: allMarkers
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