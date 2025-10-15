// miniprogram/pages/gao_de/gao_de.js
var amapFile = require('../../amap-wx.130');//如：..­/..­/libs/amap-wx.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    center: { latitude: 39.90, longitude: 116.40 },
    markers: [],
    distance: '',
    cost: '',
    polyline: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({key:'41c3b5a14f2c3372bb354ec2d4a01155'});
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        // 授权成功后执行定位

         //获取自己所在地址的定位
    myAmapFun.getRegeo({
      success: function(data){
        //成功回调
        console.log(data[0],1111)
        that.setData({
          'center.latitude': data[0].latitude,
          'center.longitude': data[0].longitude,
          markers: [{
            id: 0,
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            width: 23,
            height: 33
          }],
          longitude: data[0].longitude,
          latitude: data[0].latitude
        })
      },
      fail: function(info){
        //失败回调
        console.log(info)
      }
    })
      }

    })
    
    myAmapFun.getPoiAround({
      success: function(data){
        console.log("poi",data)
        //成功回调
      },
      fail: function(info){
        //失败回调
        console.log(info)
      }
    })
   

    //获取定位地点天气内容
    myAmapFun.getWeather({
      success: function(data){
        //成功回调
      },
      fail: function(info){
        //失败回调
        console.log(info)
      }
    })

    //路线
    myAmapFun.getDrivingRoute({
      origin: '116.481028,39.989643',
      destination: '116.434446,39.90816',
      success: function(data){
        var points = [];
        if(data.paths && data.paths[0] && data.paths[0].steps){
          var steps = data.paths[0].steps;
          for(var i = 0; i < steps.length; i++){
            var poLen = steps[i].polyline.split(';');
            for(var j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            } 
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if(data.paths[0] && data.paths[0].distance){
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if(data.taxi_cost){
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
          
      },
      fail: function(info){

      }
    })

  },
  goDetail: function(){
    wx.navigateTo({
      url: '../navigation_car_detail/navigation'
    })
  },
  goToCar: function (e) {
    wx.redirectTo({
      url: '../navigation_car/navigation'
    })
  },
  goToBus: function (e) {
    wx.redirectTo({
      url: '../navigation_bus/navigation'
    })
  },
  goToRide: function (e) {
    wx.redirectTo({
      url: '../navigation_ride/navigation'
    })
  },
  goToWalk: function (e) {
    wx.redirectTo({
      url: '../navigation_walk/navigation'
    })
  },

})