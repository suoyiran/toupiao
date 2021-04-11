// pages/self/myvote.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    votelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  show(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../show/show?id='+id,
    })
  },
  Req(){
    var actid = app.globalData.actid;
    var userid = app.globalData.openid;
    var vlist = this.data.votelist;
    db.collection('VOTE_LOG').where({
      userid:userid
    }).skip(vlist.length).get().then(res=>{
      console.log(res)
      this.setData({
        votelist:this.data.votelist.concat(res.data)
      })
    })
  },
  onLoad: function (options) {
    var that = this;
    that.Req();
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
    var that = this;
    that.Req();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})