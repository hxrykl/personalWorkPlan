// miniprogram/pages/mine/cate/cate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [
      {
        name: '工作',
        id: 1,
        color: '#e54d42',
        rgba: '	rgba(229,77,66,0.2)',
      },
      {
        name: '生活',
        id: 2,
        color: '#f37b1d',
        rgba: '	rgba(243,123,29,0.2)',
      },
      {
        name: '学习',
        id: 3,
        rgba: 'rgba(251,189,8,0.2)',
        color: '#fbbd08'
      },
      {
        name: '运动',
        id: 4,
        rgba: '	rgba(141,198,63,0.2)',
        color: '#8dc63f'
      },
      {
        name: '游戏',
        id: 6,
        rgba: 'rgba(57,181,74,0.2)',
        color: '#39b54a'
      },
      {
        name: '社交',
        id: 7,
        rgba: 'rgba(28,187,180,0.2)',
        color: '#1cbbb4'
      },
      {
        name: '竞赛',
        id: 8,
        rgba: 'rgba(0,129,255,0.2)',
        color: '#0081ff'
      },
    ],
    addModel: true,
    addZaoCeng: true,
    planName: '',
  },
  /* 删除类目 */
  toDelCate (e) {
    console.log(e.target.dataset.id,'e')
  },
  /* 添加类目 */
  async addCate () {
    this.setData({
      addModel: true,
      addZaoCeng: true,
    })
    let timep = new Date().getTime()
    const db = wx.cloud.database()
    let isHas = await db.collection('catelist').where({
      _openid: app.globalData.userId,
      timep: timep,
    }).count()
    let newCate = this.data.selfCate.slice()
    newCate.push(this.data.planName)
    if (!isHas.total) {
      let addDate = await db.collection('catelist').add({
        data:{
          timep: timep,
          arr:newCate,
        }
      })
      console.log(addDate,'addDate')
    }

    console.log('add',this.data.planName)
    this.getUserCate()
  },
  /* 取消添加类目 */
  quite () {
    this.setData({
      addModel: true,
      addZaoCeng: true,
    })
  },
  /* 自定义类目 */
  selfCate () {
    this.setData({
      addModel: false,
      addZaoCeng: false,
    })
    
  },
  //获取用户类目
  async getUserCate () {
    const db = wx.cloud.database()
    let defaults = await db.collection('catelist').where({
      who: 'default',
    }).get()
    console.log(defaults,'defaults')

    let dataList = await db.collection('catelist').where({
      _openid: app.globalData.userId,
    }).get()
    console.log(dataList,'dataList')
    this.setData({
      selfCate: dataList.data[0].arr
    })
    let newCate = []

    
    defaults.data[0].arr.map((itme, index) => {
      let boo = newCate.some((item2, index2) => {
        return itme === item2.name
      })
      boo ? '' : newCate.push({
        name: itme,
        color: app.globalData.ColorList[newCate.length].color,
        rgba: app.globalData.ColorList[newCate.length].rgba,
      })
    })
    if (dataList.data.length) {
      dataList.data[0].arr.map((itme, index) => {
        let boo = newCate.some((item2, index2) => {
          return itme === item2.name
        })
        console.log(boo,'boo')
        boo ? '' : newCate.push({
          name: itme,
          color: app.globalData.ColorList[newCate.length].color,
          rgba: app.globalData.ColorList[newCate.length].rgba,
        })
      })
    }
    

    this.setData({
      cateList: newCate
    })


    console.log(newCate,'newcate')

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
    this.getUserCate()
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