// pages/license/license.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
  },
  cpywx(){
    wx.setClipboardData({
      data: 'D1D1521',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'sync-gitee',
      data:{
        URL:'https://gitee.com/api/v5/repos/Kindear/mvote'
      },
      success:ans=>{
        console.log(ans)
        let res = ans.result
        let starCount = res.stargazers_count
        let forksCount = res.forks_count

        let avatar = res.owner.avatar_url
        console.log(avatar)
        this.setData({
          starCount,
          forksCount,
        
        })
      },
      fail:ans=>{
        console.log(ans)
      }
    })
    /*
    wx.request({
      url: 'https://gitee.com/api/v5/repos/Kindear/mvote',
      success:res=>{
        console.log(res)
        let starCount = res.data.stargazers_count
        let forksCount = res.data.forks_count

        let avatar = res.data.owner.avatar_url
        console.log(avatar)
        this.setData({
          starCount,
          forksCount,
        
        })
      },
      fail:res=>{
        console.log(res)
      }
    })
    */
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