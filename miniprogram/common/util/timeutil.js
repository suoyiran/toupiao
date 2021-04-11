function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
};
function getformatTime(date) {
  if(date==undefined){
    var date = new Date();
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
};
module.exports={
  getformatTime
}