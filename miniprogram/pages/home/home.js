// miniprogram/pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: [],
    arr: [],
    touchLength: 0,
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    let l = e.touches[0].pageX - this.data.ListTouchStart
    l > 0 ? '' : l = 0 - l
    if (l > 50) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left',
        touchLength: e.touches[0].pageX - this.data.ListTouchStart
      })
    }
    
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    
    if (this.data.ListTouchDirection === 'left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else if (this.data.touchLength > 50) {
      this.setData({
        modalName: null
      })
    }
    
    this.setData({
      ListTouchDirection: null
    })
  },
  //获取今日安排列表
  getPlanList: async function (thats) {
    let that = ''
    thats ? that = thats : that = this
    const db = wx.cloud.database()
    let date = app.getNewTime()
    let dataList = await db.collection('planlist').where({
      _openid: app.globalData.userId,
      date: date,
    }).get()
    console.log(dataList,'计划列表',date)
    if (dataList.data.length) {
      that.setData({
        arr: dataList.data[0].arr
      })
      
      let arr = []
      dataList.data[0].arr.map( (item, index) => {
        // console.log(item,index,'xaing')
        let obj = {
          title: item.planName,
          starTime: item.starTime,
          endTime: item.endTime,
          level: item.level,
          type: item.cateName,
          typeT: app.globalData.ColorList[item.cateIndex].color,
          typeB: app.globalData.ColorList[item.cateIndex].rgba,
          state: item.state,
          _id: item._id,
        }
        arr.push(obj)
      })
      that.setData({
        planList: arr
      })
    }
    
  },
  //完成或未完成
  beComplete (e) {
    
    let that = this
    console.log(e,'eeee',that.data.arr)
    that.setData({
      modalName: null
    })
    // console.log('完成',e)
    const db = wx.cloud.database()
    let state = ''
    let date = app.getNewTime()
    e.currentTarget.dataset.id.state === '已完成' ? state = '未完成' : state = '已完成'
    let upArr = that.data.arr.slice()
    upArr[e.currentTarget.dataset.index].state = state
    db.collection('planlist').where({
      _openid: app.globalData.userId,
      date: date,
    }).update({
      data:{
        arr: upArr,
      }
    })
    .then(res => {
      console.log(res,'完成成功')
      that.getPlanList(that)
      
    })
    .catch(err => {
      wx.showToast({
        title: '修改失败',
      })
    })
  },
  //置顶
  beStick (e) {
    let that = this
    that.setData({
      modalName: null
    })
    console.log('置顶',e)
    let upArr = that.data.arr.slice()
    let item = upArr.splice(e.currentTarget.dataset.index,1)
    upArr.unshift(item[0])
    const db = wx.cloud.database()
    let date = app.getNewTime()
    db.collection('planlist').where({
      _openid: app.globalData.userId,
      date: date,
    }).update({
      data:{
        arr: upArr,
      }
    })
    .then(res => {
      console.log(res,'置顶成功')
      that.getPlanList(that)
      
    })
    .catch(err => {
      wx.showToast({
        title: '修改失败',
      })
    })


  },
  //删除 
  beDelete  (e) {
    let that = this
    that.setData({
      modalName: null
    })
    console.log('删除',e)
    let upArr = that.data.arr.slice()
    upArr.splice(e.currentTarget.dataset.index,1)
    const db = wx.cloud.database()
    let date = app.getNewTime()
    db.collection('planlist').where({
      _openid: app.globalData.userId,
      date: date,
    }).update({
      data:{
        arr: upArr,
      }
    })
    .then(res => {
      console.log(res,'删除成功')
      that.getPlanList(that)
      
    })
    .catch(err => {
      wx.showToast({
        title: '修改失败',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.onGetOpenid()
  
    
    const query = wx.createSelectorQuery().in(this)
    query.select('.topBar').boundingClientRect(function(res){
      console.log(res,'顶部节点')
      app.globalData.topH = res.height
    }).exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPlanList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})