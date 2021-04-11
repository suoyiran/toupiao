// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    request({
      url: event.URL,
      method: "GET",
      json: true,
      headers: {
        "content-type": "application/json",
      },
    }, function (error, response, body) {
      //console.log(body)
      if (!error && response.statusCode == 200) {
        resolve(body)
      }
    })
  })

}