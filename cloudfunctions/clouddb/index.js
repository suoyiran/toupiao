// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  //获取当前日期
  switch(event.OP){
    case 'GET_NOW_ACT':{
      return await db.collection('VOTE_ACT').where({
        sdate:_.lte(event.date),
        edate:_.gte(event.date)
      }).get();
    }
    case 'GET_TOP_RANK':{
      return await db.collection('VOTE_PART').where({
        actid:event.actid,
        status:'pass'
      }).orderBy('votenum','desc').limit(99).get();
    }
  }
}