// app.js
App({
  // 全局数据
  globalData: {

    selectedPOI: {
      title:'',
      address:'',
      location:{lat:'',lng:''}
    },
    selectedTags: [],
    range: 0

  },
  
  // 提供数据管理方法
  setSelectedTags(tags) {
    this.globalData.selectedTags = tags;
  },
  setSelectedPOI(poi){
    this.globalData.selectedPOI = poi
  },
  setRange(range){
    this.globalData.range = range
  }
  
  
})