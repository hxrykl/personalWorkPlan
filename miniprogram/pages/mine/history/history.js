// miniprogram/pages/mine/history/history.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabarH: 60,
    dates: [
      {
        name: '日',
      },{
        name: '周',
      },{
        name: '月',
      }
    ],
    chooseDate: '日',
    showChoose: true,
    dateList:[
      {
        date: '20日',
        dateD: '2020-3',
        num: 5,
        beNum: 1,
        planList:[
          {
            title: '策划项目',
            starTime: '9:30',
            endTime: '11:30',
            level: 'I',
            type: '工作',
            typeT: '#e54d42',
            typeB: 'rgba(229,77,66,0.2)',
            state: '已完成',
          },
          {
            title: '市场调研',
            starTime: '12:30',
            endTime: '17:00',
            level: 'III',
            type: '工作',
            typeT: '#e54d42',
            typeB: 'rgba(229,77,66,0.2)',
            state: '未完成',
          },
          {
            title: '接孩子放学',
            starTime: '17:30',
            endTime: '18:30',
            level: 'III',
            type: '生活',
            typeT: '#f37b1d',
            typeB: 'rgba(243,123,29,0.2)',
            state: '未完成',
          },
          {
            title: '查阅市场数据',
            starTime: '20:30',
            endTime: '21:30',
            level: 'II',
            type: '学习',
            typeT: '#fbbd08',
            typeB: 'rgba(251,189,8,0.2)',
            state: '未完成',
          },
          {
            title: '夜跑',
            starTime: '21:40',
            endTime: '22:10',
            level: 'II',
            type: '运动',
            typeT: '#8dc63f',
            typeB: 'rgba(141,198,63,0.2)',
            state: '未完成',
          },
        ],
      },
      {
        date: '21日',
        dateD: '2020-3',
        num: 6,
        beNum: 2,
        planList:[
          {
            title: '开会（汇报项目方案）',
            starTime: '9:30',
            endTime: '10:30',
            level: 'II',
            type: '工作',
            typeT: '#e54d42',
            typeB: 'rgba(229,77,66,0.2)',
            state: '已完成',
          },
          {
            title: '整理市场数据',
            starTime: '10:40',
            endTime: '11:30',
            level: 'II',
            type: '工作',
            typeT: '#e54d42',
            typeB: 'rgba(229,77,66,0.2)',
            state: '已完成',
          },
          {
            title: '打印数据海报',
            starTime: '11:50',
            endTime: '12:00',
            level: 'II',
            type: '工作',
            typeT: '#e54d42',
            typeB: 'rgba(229,77,66,0.2)',
            state: '未完成',
          },
          {
            title: '接孩子放学',
            starTime: '17:30',
            endTime: '18:30',
            level: 'III',
            type: '生活',
            typeT: '#f37b1d',
            typeB: 'rgba(243,123,29,0.2)',
            state: '未完成',
          },
          {
            title: '查阅相关文献',
            starTime: '20:30',
            endTime: '21:30',
            level: 'II',
            type: '学习',
            typeT: '#fbbd08',
            typeB: 'rgba(251,189,8,0.2)',
            state: '未完成',
          },
          {
            title: '夜跑',
            starTime: '21:40',
            endTime: '22:10',
            level: 'II',
            type: '运动',
            typeT: '#8dc63f',
            typeB: 'rgba(141,198,63,0.2)',
            state: '未完成',
          },
        ],
      },
    ],
    allData:[],
    touchLength: 0,

  },
  showChoose () {
    this.setData({
      showChoose: false,
    })
  },
  //选择排序单位
  chooseItem (e) {
    this.setData({
      chooseDate: e.target.dataset.index,
      showChoose: true,
    })
    console.log(e.target.dataset.index)
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
  //获取年月日
  getTimep (timep) {
    let day = new Date(timep).getDate() 
      if (day < 10) {
        day = '0' + day
      } else {
        day = '' + day
      }
      let month = new Date(timep).getMonth() + 1
      if (month < 10) {
        month = '0' + month
      } else {
        month = '' + month
      }
      let year = new Date(timep).getFullYear() + ''
      let time = year + '-' + month + '-' + day
      
      return {
        time,
        year,
        month,
        day
      }
  },
  //获取历史记录
  async getHistory (thats) {
    let that = ''
    thats ? that = thats : that = this
    const db = wx.cloud.database()
    let dataList = await db.collection('planlist').where({
      _openid: app.globalData.userId,
    }).get()
    console.log(dataList,'计划列表',)
    if (dataList.data.length) {
      that.setData({
        allData: dataList.data
      })
      let historyList = []
      dataList.data.map((item, index) => {
        let dates = that.getTimep(item.timep)
        let obj = {
          date: dates.day + '日',
          dateD: dates.year + '-' + dates.month,
          beNum: 0,
          num: item.arr.length,
          dates: item.date,
          planList: [],
        }
        item.arr.map((item1, index1) => {
          item1.state === '已完成' ? obj.beNum++ : ''
          let obj1 = {
            title: item1.planName,
            starTime: item1.starTime,
            endTime: item1.endTime,
            level: item1.level,
            type: item1.cateName,
            typeT: app.globalData.ColorList[item1.cateIndex].color,
            typeB: app.globalData.ColorList[item1.cateIndex].rgba,
            state: item1.state,
            timep: item1.timep,
          }
          obj.planList.push(obj1)
        })
        historyList.unshift(obj)
      })
      // console.log(historyList,'historyList')
      console.log(historyList,'计划列表23',)
      that.setData({
        dateList: historyList,
      })
    }
  },
  //移除
  async beDelete (e) {
    let that = this
    that.setData({
      modalName: null
    })
    
    let upArr = that.data.allData.slice()
    console.log(e,'移除',upArr)
    let fa = 0
    let ch = 0
    upArr.map((item, index) => {
      item.date === e.currentTarget.dataset.item.dates ? fa = index : ''
      item.arr.map((item1, index1) => {
        item1.timep === e.currentTarget.dataset.id.timep ? ch = index1 : ''
      })
    })
    const db = wx.cloud.database()
    let newArr = upArr[fa]
    let delArr = []
    console.log('111',upArr[fa],fa)
    if (newArr.arr.length === 1) {
      await db.collection('planlist').where({
        _openid: app.globalData.userId,
        date: e.currentTarget.dataset.item.dates,
      }).remove()
      .then(res => {
        console.log('删除成功','res')
        delArr = newArr.arr
      })
    } else {
      delArr = newArr.arr.splice(ch,1)
      console.log('222',app.globalData.userId, e.currentTarget.dataset.item.dates,newArr)
      await db.collection('planlist').where({
        _openid: app.globalData.userId,
        date: e.currentTarget.dataset.item.dates,
      }).update({
        data:{
          arr: newArr.arr,
        }
      })
      .then(res => {
        console.log(res,'删除成功')
        that.getHistory(that)
        
      })
      .catch(err => {
        wx.showToast({
          title: '修改失败',
        })
      })
      // delArr[0]
    }
    console.log("结束")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this,'histhis')
    this.setData({
      tabarH: app.globalData.topH,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHistory()
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