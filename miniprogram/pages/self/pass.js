// miniprogram/pages/self/pass.js
const app = getApp();
const actid = '3dfe72d65fac9c2d00940af8542ddd26';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actid: '',
    partlist: []
  },
  pass(e) {
    var that = this;
    var docid = e.currentTarget.dataset.id;
    //console.log(e)
    db.collection('VOTE_PART').doc(docid).update({
      data: {
        status: 'pass'
      }

    }).then(res => {
      console.log(res)
      that.Req();
    })
  },
  refuse(e) {
    var that = this;
    var docid = e.currentTarget.dataset.id;
    //console.log(e)
    db.collection('VOTE_PART').doc(docid).update({
      data: {
        status: 'refused'
      }
    }).then(res => {
      console.log(res)
      that.Req();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  Req() {
    var that = this;
    var actid = actid;
    console.log(app.globalData.actid)
    db.collection('VOTE_PART').where({
      actid: actid,
      status: 'wait'
    }).get().then(res => {
      console.log(res)
      this.setData({
        partlist: res.data
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})