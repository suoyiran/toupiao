const app = getApp();
const timeutil = require('../../common/util/timeutil.js');
const db = wx.cloud.database();
const _ = db.command;
const votelimit = require('../../common/config/dev').VoteLimit;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    votedlist: [],
    actid: '',
    TabCur: 0,
    TabList: ['专业组', '业余组'],
    Type: '专业组',
    scrollLeft: 0,
    actinfo: null,
    key:''
  },
  getkey(e){
    this.setData({
      key:e.detail.value
    })
  },
  search(){
    console.log(this.data.key)
    db.collection('VOTE_PART').where(_.or([
      {
        actid:this.data.actid,
        partid:parseInt(this.data.key)
      },
      {
        actid:this.data.actid,
        joinername:this.data.key
      }
    ])).get().then(res=>{
      console.log(res)
      this.setData({
        listData:res.data
      })
    })
  },
  tabSelect(e) {
    var that = this;
    var type = this.data.TabList[e.currentTarget.dataset.id];
    console.log(type)
    
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      Type: type,
      listData: []
    }, () => {
      that.ReqJoiner();
    })
  },
  toshow(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../show/show?id=' + id
    })
  },
 
  joinact(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      console.log('获得授权成功')
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('wxuserinfo', e.detail.userInfo)
      var actid = this.data.actid;
      if (actid != '' && actid != null) {
        wx.navigateTo({
          url: 'joinact?actid=' + this.data.actid,
        })
      }

      //console.log(e.detail.userInfo)
      //this.triggerEvent('topub', 'helloworld')
    } else {
      console.log('获得授权失败')
    }
  },
  ReqJoiner() {
    wx.showLoading({
      title: '加载中~'
    })
    var that = this;
    var actid = that.data.actid;
    //console.log(actid)
    db.collection('VOTE_PART').where({
      actid: actid,
      status: 'pass',
      jointype: this.data.Type
    }).orderBy('votenum', 'desc').skip(that.data.listData.length).get().then(res => {
      // console.log(res)
      //需要处理下对应数据
      wx.stopPullDownRefresh({
        success: (res) => {
          wx.hideLoading();
        },
      })
      //console.log(tmplist)
      that.setData({
        listData: this.data.listData.concat(res.data)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  ReqAct(){
    var that = this;
    //获取当前日期的活动
    var date = timeutil.getformatTime(new Date());
    wx.cloud.callFunction({
      name: 'clouddb',
      data: {
        OP: 'GET_NOW_ACT',
        date: date
      },
      success: res => {
        //获取到活动id
        // console.log(res)
        if (res.result.data.length == 0) {
          wx.showToast({
            title: '今日无活动',
            icon: 'none'
          })
        } else {
          var actid = res.result.data[0]._id;
          // console.log(actid)
          app.globalData.actid = actid;
          var voted = wx.getStorageSync(actid + '-myvote-list') || []

          //console.log(voted)
          this.setData({
            actid: actid,
            votedlist: voted
          }, () => {
            that.ReqJoiner();
            that.InitAct();
            this.expose();
          })
        }

      }
    })
  },
  onLoad: function (options) {
    this.ReqAct();

  },
  expose() {
    var that = this;
    var actid = this.data.actid;
    db.collection('VOTE_ACT').doc(actid).update({
      data: {
        exposenum: _.inc(2)
      }
    }).then(res => {
      console.log('曝光 ++')
    })
  },
  InitAct() {
    var that = this;
    var actid = that.data.actid;
    db.collection('VOTE_ACT').doc(actid).get().then(res => {
      console.log(res)
      that.setData({
        actinfo: res.data
      })
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
  onShow:async function () {
    let actid = this.data.actid;
    //var voted =await wx.getStorageSync(actid + '-myvote-list') || []
    console.log('onshow')
   // console.log(voted)
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
    var that = this;
    wx.showLoading({
      title: '刷新中~',
    })
    that.setData({
      listData: [],
      key:''
    }, () => {
      console.log(this.data.actinfo)
      if(this.data.actinfo!=null){
        that.ReqJoiner();
        that.InitAct();
      }
      else{
        that.ReqAct();
      }
     
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.key==''){
      var that = this;
      that.ReqJoiner();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})