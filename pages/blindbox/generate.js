// pages/blindbox/generate.js
// 引入腾讯地图SDK
var QQMapWX = require('../../qqmap-wx-jssdk.min.js');

Page({
  data: {
    rangeValue: 2.0,
    selectedTags: [],
    userLocation: null,
    isLoading: false
  },

  onLoad() {
    // 页面加载时获取用户位置
    this.getUserLocation();
  },

  // 获取用户位置
  getUserLocation() {
    wx.showLoading({
      title: '获取位置中...'
    });

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
        wx.hideLoading();
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
        console.error('定位失败:', err);
      }
    });
  },

  // 范围滑块变化事件
  onRangeChange(e) {
    this.setData({
      rangeValue: e.detail.value
    })
  },

  // 标签选择切换事件
  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag
    const selectedTags = this.data.selectedTags
    const index = selectedTags.indexOf(tag)
    
    if (index > -1) {
      // 如果已选中，则取消选中
      selectedTags.splice(index, 1)
    } else {
      // 如果未选中，则添加选中
      selectedTags.push(tag)
    }
    
    this.setData({
      selectedTags: selectedTags
    })
  },

  // 生成盲盒按钮点击事件
  generateBlindBox() {
    // 检查是否选择了至少一个标签
    if (this.data.selectedTags.length === 0) {
      wx.showToast({
        title: '请至少选择一个兴趣标签',
        icon: 'none'
      })
      return
    }
    
    // 检查是否已获取用户位置
    if (!this.data.userLocation) {
      wx.showToast({
        title: '请先获取位置信息',
        icon: 'none'
      });
      return;
    }
    
    // 显示加载提示
    this.setData({
      isLoading: true
    });
    
    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: 'KSSBZ-YWRWT-WX2X3-VQ7HA-UCGOO-TKB5T' // 使用项目中已有的密钥
    });
    
    // 随机选择一个标签作为搜索关键词
    const randomTag = this.data.selectedTags[Math.floor(Math.random() * this.data.selectedTags.length)];
    
    // 调用腾讯地图API搜索附近地点
    qqmapsdk.search({
      keyword: randomTag,
      location: {
        latitude: this.data.userLocation.latitude,
        longitude: this.data.userLocation.longitude
      },
      distance: this.data.rangeValue * 1000, // 转换为米
      page_size: 20,
      success: (res) => {
        console.log('搜索成功:', res);
        
        if (res.data.length > 0) {
          // 随机选择一个地点
          const randomIndex = Math.floor(Math.random() * res.data.length);
          const place = res.data[randomIndex];
          
          // 计算距离
          const distance = this.calculateDistance(
            this.data.userLocation.latitude,
            this.data.userLocation.longitude,
            place.location.lat,
            place.location.lng
          );
          
          // 跳转到盲盒详情页，传递参数
          wx.navigateTo({
            url: `/pages/blindbox/blindbox?range=${this.data.rangeValue}&tags=${JSON.stringify(this.data.selectedTags)}&distance=${distance}&place=${JSON.stringify({title: place.title, address: place.address})}`
          });
        } else {
          wx.showToast({
            title: '未找到符合条件的地点',
            icon: 'none'
          });
        }
        
        this.setData({
          isLoading: false
        });
      },
      fail: (err) => {
        console.error('搜索失败:', err);
        wx.showToast({
          title: '搜索地点失败',
          icon: 'none'
        });
        
        this.setData({
          isLoading: false
        });
      }
    });
  },
  
  // 计算两点间距离（单位：米）
  calculateDistance(lat1, lng1, lat2, lng2) {
    const rad = function(d) {
      return d * Math.PI / 180.0;
    };
    
    const radLat1 = rad(lat1);
    const radLat2 = rad(lat2);
    const a = radLat1 - radLat2;
    const b = rad(lng1) - rad(lng2);
    
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10; // 转换为米
    
    return s;
  }
})