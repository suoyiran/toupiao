// miniprogram/pages/rank/rank.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actid:'',
    partList:[]
  },
  toshow(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../show/show?id='+id,
    })
  },
  Req(){
    //wx.showLoading({title:'加载排名~'})
    var tlist = this.data.partList;
    var that = this;
    db.collection('VOTE_PART').where({
      actid:this.data.actid,
      status:'pass'
    }).orderBy('votenum','desc').skip(tlist.length).get().then(res=>{
      console.log(res)
      wx.hideLoading();
      that.setData({
        partList:tlist.concat(res.data)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    console.log(app.globalData.actid)
    this.setData({
      actid:app.globalData.actid || '3dfe72d65fac9c2d00940af8542ddd26'
    },()=>{
      this.Req();
    })
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