// miniprogram/pages/mine/myCount/myCount.js
const app = getApp()
import * as echarts from '../../../ec-canvas/echarts';

function setOption(chart,data) {

  var option = {
    color: ["#ffda24", "#ccc",],
    title: {
      text: data + '%',
      subtext: '已完成',
      x : 'center',
      y : 'center',
      textStyle:{
          fontSize: 14,
          color: '#666'
      },
      subtextStyle:{
          fontSize: 14,
          color: '#666'
      }
    },
    series: [{
      
      name: '未完成',
      label: {
        show: false,
        normal: {
          fontSize: 14
        }
      },
      labelLine: {
        show: false
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['60%', '85%'],
      data: [{
        value: data,
      }, {
        value: 100-data,
      }]
    }]
  };
  chart.setOption(option);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      // onInit: initChart
      lazyLoad: true
    },
    lineData: [
      {
        color: '#e54d42',
        name: '工作',
        data: 100,
      },
      {
        color: '#f37b1d',
        name: '生活',
        data: 85,
        icon: '',
      },
      {
        color: '#fbbd08',
        name: '学习',
        data: 70,
        icon: '',
      },
      {
        color: '#8dc63f',
        name: '运动',
        data: 80,
        icon: '',
      },
      {
        color: '#39b54a',
        name: '娱乐',
        data: 70,
        icon: '',
      },
      {
        color: '#1cbbb4',
        name: '社交',
        data: 25,
        icon: '',
      },
    ],
    chooseDate: '日',
    showChoose: true,
    dates: [
      {
        name: '日',
      },{
        name: '周',
      },{
        name: '月',
      }],
    newTime: '2020-6-10',
    
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
  //获取当前时间的数据
  async getTimeData (date) {
    let that = this
    const db = wx.cloud.database()
    let dataList = await db.collection('planlist').where({
      _openid: app.globalData.userId,
      date: date,
    }).get()
    console.log(dataList,'计划列表',date)
    let arr = []

    dataList.data[0].arr.map((item, index) => {
      let act = 0
      let boo = arr.some((item1, index1) => {
        item.cateName === item1.name ? act = index1 : ''
        return item.cateName === item1.name
      })
      if (!boo) {
        let a = 0
        item.state === '已完成' ? a = 1 : ''
        let obj = {
          name: item.cateName,
          data: a*100,
          num: 1,
          beNum: a, 
          color: app.globalData.ColorList[arr.length].color,
        }
        arr.push(obj)
      } else {
        arr[act].num++
        item.state === '已完成' ? arr[act].beNum++ : ''
        console.log(boo)

      }
      
    })
    arr.map((item3, index3) => {
      item3.data = (item3.beNum/item3.num*100).toFixed()
    })
    that.setData({
      lineData: arr
    })
    // echarts表数据处理
    let val = {
      num: 0,
      beNum: 0,
      value: 0,
    }
    dataList.data[0].arr.map((item4, index4) => {
      val.num++
      item4.state === '已完成' ? val.beNum++ : ''
    })
    val.value = (val.beNum/val.num*100).toFixed()
    this.init(val.value)
  },

  // 点击按钮后初始化图表
  init: function (data) {
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart, data);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  //下一个时间段
  lastTime () {
    console.log(this.data.newTime,'lasttime')
    let date = this.getNewTimes(this.data.newTime.timep-86400000)
    this.setData({
      newTime: date
    })
    this.getTimeData(date.time)
  },
  //上一个时间段
  nextTime () {
    console.log(this.data.newTime,'nexttime')
    let date = this.getNewTimes(this.data.newTime.timep+86400000)
    this.setData({
      newTime: date
    })
    this.getTimeData(date.time)

  },
   //获取当日时间(传参)
   getNewTimes (date) {
    let timep = 0
    let time = ''
    date ? timep = date : ''
    if (date) {
      let day = new Date(date).getDate() 
      if (day < 10) {
        day = '0' + day
      } else {
        day = '' + day
      }
      let month = new Date(date).getMonth() + 1
      if (month < 10) {
        month = '0' + month
      } else {
        month = '' + month
      }
      let year = new Date(date).getFullYear() + ''
       time = year + '-' + month + '-' + day
    } else {
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
       time = year + '-' + month + '-' + day
      timep = new Date().getTime()
    }
      // console.log(time,'tiem')
      return {
        time,
        timep
      }
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-pie');
    let date = this.getNewTimes()
    this.setData({
      newTime: date,
    })
    this.getTimeData(date.time)
    // this.init()
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