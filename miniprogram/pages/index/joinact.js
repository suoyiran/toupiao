// miniprogram/pages/index/joinact.js
const app = getApp();
const db = wx.cloud.database();
const timeutil = require('../../common/util/timeutil.js');
const cwx = require('profunc.js');
const oncelimit = require('../../common/config/dev').OnceLimit;
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partid:0,
    picker: ['专业组', '业余组'],
    pickerindex:0,
    imgList: [],
    realList:[],
    imgid: 0,
    cloudvideoList:[
      
    ],
    videoList: [
    ],
    videoid: 0,
    actid:'',
    //基础信息
    name:'',
    intro:''
  },
  getname(e){
    this.setData({
      name:e.detail.value
    })
  },
  getintro(e){
    this.setData({
      intro:e.detail.value
    })
  },
  upimages(){
    var that = this;
    var _imgid = this.data.imgid;
    wx.showLoading({
      title: '上传中~',
      mask:true
    }) // 这个地方有重复调用，但是不值得去做优化
    cwx.CloudUploadImage(this.data.imgList[_imgid]).then(function(res){
     // console.log(res)
      that.setData({
        imgid:_imgid+1,
        realList: that.data.realList.concat([res.fileID])
      },()=>{
        if (that.data.imgid == that.data.imgList.length){
          //全部上传完成
          //console.log()
          that.uploadinfo();
          console.log(that.data.realList)
          //wx.hideLoading();
        }else{
          that.upimages();
        }
      })
    })
  },
  joinpub(){
    //上传图片
    var that = this;
    that.upimages();
    //增加报名人数
    that.addPart();
  },
  addPart(){
    var that = this;
    var actid = this.data.actid;
    db.collection('VOTE_ACT').doc(actid).update({
      data:{
        joinnum:_.inc(1)
      }
    }).then(res=>{
      console.log(res)
    })
  },
  uploadinfo(){
    var that = this;
    var tdata = that.data;
    //参加者id
    var joinerid = app.globalData.openid;
    var actid = tdata.actid;
    var joinername = tdata.name;
    //获取缓存数据
    let wxsto = wx.getStorageSync('wxuserinfo') || -1
    console.log(wxsto)
    if(wxsto!=-1){
      var nickname = wxsto.nickName;
      var avatar = wxsto.avatarUrl;
    }
    var jointype = tdata.picker[tdata.pickerindex];
    var imglist = tdata.realList;
    var firstimg = tdata.realList[0];
    var votenum = 0;
    var videolist = tdata.cloudvideoList;
    db.collection('VOTE_PART').add({
      data:{
        partid:this.data.partid,
        joinerid,
        actid,
        joinername,
        nickname,
        avatar,
        jointype,
        imglist,
        firstimg,
        votenum,
        videolist,
        name:tdata.name,
        intro:tdata.intro,
        votelist:[],
        status:'wait'
      },
      success:res=>{
        console.log(res)
        wx.hideLoading();
        wx.showToast({
          title: '上传成功~,等待审核',
        })
        wx.navigateBack({
          delta: 0,
        })
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      pickerindex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var actid = options.actid;
    db.collection('VOTE_PART').where({
      actid:actid
    }).count().then(res => {
      this.setData({
        partid:res.total+1
      })
      console.log(res.total)
    })
    
    //console.log(actid)
    this.setData({
      actid:actid
    })
    if(oncelimit){
      console.log('单词投票限制')
      db.collection('VOTE_PART').where({
        actid,
        joinerid:app.globalData.openid
      }).get({
        success:res=>{
          console.log(res)
          if(res.data.length >= 1){
            wx.showModal({
              title:'提醒',
              content:'每个人限制参加一次',
              showCancel:false,
              success:r=>{
                if(r.confirm){
                  wx.navigateBack({
                    delta: 0,
                  })
                }
              }

            })
          }
        }
      })
    }
    //初始化播放列表
    that.initVideo();
  },
  swiperchange(e)
  {
    //console.log(e)
    var id = e.detail.current;
    //这是正在播放的视频组件
    var tlist = this.data.videoList;
    for(var i=0;i<tlist.length;i++)
    {
      if(id!=i){
        tlist[i].mvid.pause();
      }else{
        tlist[i].mvid.play();
      }
    }
    
  },
  initVideo(){
    var that = this;
    var vlist = this.data.cloudvideoList;
    var tmplist = [];
    for(var i=0;i<vlist.length;i++)
    {
      
      var obj = {};
      obj.url = vlist[i];
      obj.mvid = wx.createVideoContext('video'+i)
      tmplist.push(obj)
    }
    //console.log(tmplist)
    that.setData({
      videoList:tmplist
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
   // console.log(app.b)
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

  },
  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        //console.log(res)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  upvideo() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      camera: 'back',
      success:res=>{
        console.log(res)
        var tdate = timeutil.getformatTime(new Date());
        wx.showLoading({title:'上传~'})
        wx.cloud.uploadFile({
          cloudPath:'video/'+'('+tdate+')'+app.globalData.openid+'-'+Math.random().toString(36).substr(3,8)+this.data.videoList.length+'.mp4',
          filePath:res.tempFilePath,
          success:ans=>{
            console.log(ans)
            that.setData({
              cloudvideoList:that.data.cloudvideoList.concat(ans.fileID)
            },()=>{
              wx.hideLoading();
              that.initVideo();
            })
          },
          fail:ans=>{
            console.log(ans)
          }
        })
        
      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
})