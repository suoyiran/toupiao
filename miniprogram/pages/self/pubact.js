// pages/self/pubact.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const timeutil = require('../../common/util/timeutil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sdate:'2020-08-01',
    edate:'2020-08-02',
    actname:'',
    intro:'',
  },
  actpub(){
    //活动信息发布
    var that = this;
    var bdata = that.data;
    //构建查询
    db.collection('VOTE_ACT').where(_.or([
      {
        sdate: _.and(_.gte(bdata.sdate),_.lte(bdata.edate))
      },
      {
        edate: _.and(_.gte(bdata.sdate),_.lte(bdata.edate))
      }
    ])).get().then(res=>{
      console.log(res)
      if(res.data.length!=0)
      {
        wx.showToast({
          title: '该时间段已被占用',
          icon:'none'
        })
      }else
      {
        wx.showLoading({
          title: '发布中~',
          mask:true
        })
        db.collection('VOTE_ACT').add({
          data:{
            userid:app.globalData.openid,
            sdate:bdata.sdate,
            edate:bdata.edate,
            actname:bdata.actname,
            intro:bdata.intro,
            joinnum:0,
            votenum:0,
            exposenum:0
          }
        }).then(res=>{
          console.log(res);
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '上传成功~',
              })
            },
          })
        })
      }
    })
  },
  getintro(e){
    this.setData({
      intro:e.detail.value
    })
  },
  getactname(e){
    this.setData({
      actname:e.detail.value
    })
  },
  sDateChange(e){
    console.log(e)
    this.setData({
      sdate:e.detail.value
    })
  },
  eDateChange(e){
    console.log(e)
    this.setData({
      edate:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前日期
    var tdate = timeutil.getformatTime(new Date());
    this.setData({
      sdate:tdate,
      edate:tdate
    })
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