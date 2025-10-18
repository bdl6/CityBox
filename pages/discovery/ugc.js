// pages/discovery/ugc.js
Page({
  data: {
    placeName: '',
    diaryList: []
  },

  onLoad(options) {
    // 从options中获取地点名称等信息
    const placeName = options.placeName ? decodeURIComponent(options.placeName) : '未知地点';
    
    // 模拟从服务器获取该地点的探索日记数据
    const diaryList = this.getMockDiaryList(placeName);
    
    this.setData({
      placeName: placeName,
      diaryList: diaryList
    });
  },

  // 模拟获取地点的探索日记数据
  getMockDiaryList(placeName) {
    // 这里应该从服务器获取数据，现在使用模拟数据
    return [
      {
        avatar: '/images/avatar1.png',
        username: '文艺青年',
        time: '2023-05-15',
        description: `在${placeName}度过了一个美好的下午，这里的氛围真的很好！`,
        photos: ['/images/ugc1.jpg', '/images/ugc2.jpg'],
        likeCount: 12,
        commentCount: 3,
        liked: false
      },
      {
        avatar: '/images/avatar2.png',
        username: '咖啡爱好者',
        time: '2023-05-10',
        description: `${placeName}的咖啡真的很棒，下次还会再来的！`,
        photos: ['/images/ugc3.jpg'],
        likeCount: 8,
        commentCount: 1,
        liked: true
      },
      {
        avatar: '/images/avatar3.png',
        username: '摄影爱好者',
        time: '2023-05-08',
        description: `${placeName}的每个角落都值得记录，拍了很多好照片！`,
        photos: ['/images/ugc4.jpg', '/images/ugc5.jpg', '/images/ugc6.jpg'],
        likeCount: 15,
        commentCount: 5,
        liked: false
      }
    ];
  },

  // 预览图片
  previewImage(e) {
    const photos = e.currentTarget.dataset.photos
    const current = e.currentTarget.dataset.current
    wx.previewImage({
      current: current,
      urls: photos
    })
  },

  // 点赞日记
  likeDiary(e) {
    const index = e.currentTarget.dataset.index
    const diaryList = this.data.diaryList
    const diary = diaryList[index]
    
    // 更新点赞状态和数量
    diary.liked = !diary.liked
    diary.likeCount += diary.liked ? 1 : -1
    
    this.setData({
      diaryList: diaryList
    })
  },

  // 评论日记
  commentDiary(e) {
    const index = e.currentTarget.dataset.index
    wx.showToast({
      title: '评论功能开发中',
      icon: 'none'
    })
  }
})