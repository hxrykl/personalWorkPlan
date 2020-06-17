// miniprogram/pages/list/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planName: '',
    catePicker: ['工作', '生活', '学习'],
    cateIndex: '0',
    level: 'I',
    starDate: '2020-4-25',
    endDate: '2020-4-25',
    starTime: '08:00',
    endTime: '12:30',
    textareaAValue: '',
  },
  catePickerChange (e) {
    console.log(e);
    this.setData({
      cateIndex: e.detail.value
    })
  },
  radioChange (e) {
    console.log(e);
    this.setData({
      level: e.detail.value
    })
  },
  starDateChange(e) {
    this.setData({
      starDate: e.detail.value,
      endDate: e.detail.value
    })
  },
  starTimeChange (e) {
    this.setData({
      starTime: e.detail.value
    })
  },
  endDateChange(e) {
    console.log(e,'e')
    this.setData({
      endDate: e.detail.value
    })
  },
  endTimeChange (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  /* 计划详细 */
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  //获取当日时间
  getNewTime () {
    let day = new Date().getDate() 
      if (day < 10) {
        day = '0' + day
      } else {
        day = '' + day
      }
      let month = new Date().getMonth() + 1
      if (month < 10) {
        month = '0' + month
      } else {
        month = '' + month
      }
      let year = new Date().getFullYear() + ''
      let time = year + '-' + month + '-' + day
      // console.log(time,'tiem')
      return time
  },
  //重置
  retrunData () {

    this.setData({
      planName: '',
      cateIndex: '0',
      level: 'I',
      starDate: this.getNewTime(),
      endDate: this.getNewTime(),
      starTime: '08:00',
      endTime: '12:30',
      textareaAValue: '',
    })
  },
  //提交
  submitData: async function () {
    let timep = new Date().getTime()

    const db = wx.cloud.database()
    let that = this.data
    let date = this.getNewTime()
    let isHas = await db.collection('planlist').where({
      _openid: app.globalData.userId,
      date: date,
    }).count()

    if (!isHas.total) {
      let addDate = await db.collection('planlist').add({
        data:{
          date: date,
          timep: timep,
          arr:[],
        }
      })
      console.log(addDate,'addDate')
    }
    let newPlan = {
      timep: timep,
      planName: that.planName,
      cateName: that.catePicker[that.cateIndex],
      cateIndex: that.cateIndex,
      level: that.level,
      starDate: that.starDate,
      endDate: that.endDate,
      starTime: that.starTime,
      endTime: that.endTime,
      textareaAValue: that.textareaAValue,
      state: '未完成',
    }
    let addPlan = await db.collection('planlist').where({
      _openid: app.globalData.userId,
      date: date,
    }).update({
      data:{
        arr: db.command.push(newPlan),
      }
    })
    .then(res => {
      console.log(res,'提交')
      wx.showToast({
        title: '提交成功',
      })
    })
    .catch(err => {
      wx.showToast({
        title: '提交失败',
      })
    })
    console.log('is',isHas)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(app.globalData,'app',this.getNewTime())
    this.setData({
      starDate: this.getNewTime(),
      endDate: this.getNewTime()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.globalData,'app1')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData,'app3',this.getNewTime())
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