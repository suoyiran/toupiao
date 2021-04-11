//const db = wx.cloud.database();
/**
 * @author:kindear
 * 云环境操作文件
 */
/**
 * 1.初始化云环境函数
 * @param {云环境id} cloudid 
 */
function CloudEnvInit(cloudid){
  if(cloudid==null||typeof(cloudid)!=String){
    console.log('传入的云环境id格式不正确')
  }
  wx.cloud.init({
    env:cloudid
  })
}

/**
 * 云函数调用组件
 * @param {*} funcname 
 * @param {*} data 
 */
async function CallCloudFunction(funcname,data){
  try {
    return await wx.cloud.callFunction({
      name:funcname,
      data
    }) || 0
  } catch (error) {
    return {
      status:'请求异常',
      errcode:error.errCode,
      msg:error
    }
  }
}
function InitCollection(){
  //初始化集合
  CallCloudFunction('initcollection',null);
}
function PreUniDbData(operation,data){
  return {
    operation,
    data
  }
}
module.exports={
  CallCloudFunction,
  PreUniDbData,
  InitCollection
}