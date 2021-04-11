//app.js
const cloud = require('common/core/cloud.js');
const cloudsets = require('common/config/dev.js');
App({
  onLaunch: function(options) {
    //此处需要有对进入小程序方式的处理
    this.InitCloud(); //初始化云服务 / ESC
    this.InitCustom(); //初始化custom所需配置信息
    //Race
    this.globalData.openid = wx.getStorageSync('userinfo').openid;
    //初始化集合只用一次就行
    cloud.InitCollection();
  },

  InitCloud() {
    var that = this;
    that.globalData.userInfo = wx.getStorageSync('wxuserinfo');
    if (cloudsets.UseCloud) {
      console.log('* 云开发 * √' + ' 服务器:' + cloudsets.CloudId)
      if (!wx.cloud) {
        console.log(' -- 不支持云开发 -- ')
      } else {
        wx.cloud.init({
          env: cloudsets.CloudId,
          traceUser: cloudsets.TraceUser
        })
        cloud.CallCloudFunction('openapi',{action:'getOpenData'}).then(res=>{
         // console.log(this.sel_item)
          that.globalData.openid = res.result.openid;
          console.log('你的openid:'+res.result.openid)
          //异步配置缓存
          wx.setStorageSync('userinfo', res.result);
        })
      }
    } else {
      console.log('* 云开发 * X')
    }
  },
  InitCustom(){
    wx.getSystemInfo({
      success: e => {
        //console.log(e)
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        // console.log(custom)
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    userInfo:null,
    openid:''
  },

})