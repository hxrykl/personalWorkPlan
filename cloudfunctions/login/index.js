// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
//定义数据库
const db = cloud.database()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * event 参数包含小程序端调用传入的 data
 */
exports.main = async (event, context) => {

  // console.log(event, 'event', context, 'context') // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  // //判断是否新用户，返回在表中查找到的条数
  let hs = await db.collection('user').where({
    openid: wxContext.OPENID, // 填入当前用户 openid
  }).count()
  // //新用户存入openid
  if (hs.total === 0) {
    await db.collection('user').add({
      data: { // data 字段表示需新增的 JSON 数据
        openid: wxContext.OPENID
      }
    })
  }
  // let a = getTodayList()
  return {
    hs,
    userId: wxContext.OPENID,
  }
}


