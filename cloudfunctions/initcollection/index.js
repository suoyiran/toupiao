// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  //发布的活动记录
  await db.createCollection('VOTE_ACT');
  //参与记录
  await db.createCollection('VOTE_PART');
  // 投票记录
  await db.createCollection('VOTE_LOG');
}