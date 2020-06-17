//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      //云开发初始化
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'pw-cloud-id',
        traceUser: true,
      })
    }
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
		if (capsule) {
		 	this.globalData.Custom = capsule;
			this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		} else {
			this.globalData.CustomBar = e.statusBarHeight + 50;
		}
      }
    })
    const db = wx.cloud.database()
    //
    this.onGetOpenid()

    this.allMonitor()
    this.getCatelist(db)
  },
  //定义获取用户openid方法
  onGetOpenid: function () {
    wx.cloud.callFunction({ // 调用云函数
      name: 'login',
      data: {},
      success: res => {
        console.log('云函数', res)
        this.globalData.userId = res.result.userId //将用户id存起
        let w = res.result.hs.total ? '欢迎回来！' : '新的旅程开始了...'
        wx.showToast({
          title: w,
        })

        // if (res.result.hs.total) { 
        //   wx.switchTab({
        //     url: '/pages/home/home',
        //   })
        // } else {
        //   wx.switchTab({
        //     url: '/pages/mine/mine',
        //   })
        // }
        
      },
      fail: err => {
        console.error('[云函数] 调用失败', err)
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      }
    })

  },
  //全局监控
  allMonitor:async function () {
    const db = wx.cloud.database()

    let has = await db.collection('user').where({
      openid: this.globalData.userId,
    }).count()



    console.log(has,'has')
    return has
  },
  //获取类目
  getCatelist: function (db) {
    db.collection('catelist').where({
      who: 'default',
    }).get().then(res => {
      console.log(res.data[0].arr,'res')
      this.globalData.cateList = res.data[0].arr
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




  globalData: {
    ColorList: [{
        title: '嫣红',
        color: '#e54d42',
        rgba: '	rgba(229,77,66,0.2)',
      },
      {
        title: '桔橙',
        color: '#f37b1d',
        rgba: '	rgba(243,123,29,0.2)',
      },
      {
        title: '明黄',
        rgba: 'rgba(251,189,8,0.2)',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        rgba: '	rgba(141,198,63,0.2)',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        rgba: 'rgba(57,181,74,0.2)',
        color: '#39b54a'
      },
      {
        title: '天青',
        rgba: 'rgba(28,187,180,0.2)',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        rgba: 'rgba(0,129,255,0.2)',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        rgba: 'rgba(103,57,182,0.2)',
        color: '#6739b6'
      },
      {
        title: '木槿',
        rgba: 'rgba(156,38,176,0.2)',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        rgba: 'rgba(224,57,151,0.2)',
        color: '#e03997'
      },
      {
        title: '棕褐',
        rgba: 'rgba(165,103,63,0.2)',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        rgba: 'rgba(170,170,170,0.2)',
        color: '#8799a3'
      },
      {
        title: '草灰',
        rgba: 'rgba(28,187,180,0.2)',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        rgba: 'rgba(51,51,51,0.2)',
        color: '#333333'
      },
    ],
    cateList: ['工作', '生活', '学习'],
  }
})
