// pages/show/show.js
const db = wx.cloud.database();
const app = getApp();
const _ = db.command;
Page({
  circle(){
    wx.showToast({
      title: '请使用右上角转发到朋友圈',
      icon:'none'
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [], //数据源
    windowWidth: 0, //页面视图宽度
    windowHeight: 0, //视图高度
    imgMargin: 6, //图片边距: 单位px
    imgWidth: 0, //图片宽度: 单位px
    topArr: [0, 0], //存储每列的累积top
    cardCur: 0,
    videoList:[],
    voted:true,
    joininfo:null,
    rank:-1,
    posterConfig:{
      
    }
  },
  vote(){
    var that = this;
    var voted = that.data.voted;
    var vname = that.data.joininfo.joinername || null;
    if(voted || vname == null){
      wx.showToast({
        title: '已经为ta投过票了哦~',
      })
    }else{
      wx.showLoading({title:'为ta投票~'})
      db.collection('VOTE_LOG').add({
        data:{
          userid:app.globalData.openid,
          voteto:this.data.joinid,
          votename:vname
        }
      }).then(ans=>{
        wx.hideLoading();
        console.log(ans)
        that.setData({
          voted:true
        },()=>{
          db.collection('VOTE_ACT').doc(this.data.joininfo.actid).update({
            data:{
              votenum:_.inc(1)
            }
          }).then(ans=>{
            console.log(ans)
          })
          db.collection('VOTE_PART').doc(this.data.joininfo._id).update({
            data:{
              votenum:_.inc(1)
            }
          }).then(ans=>{
            console.log(ans)
          })
        })
      })
      let vlist =  wx.getStorageSync(app.globalData.actid + '-myvote-list') || []
      console.log(vlist)
      wx.setStorageSync(app.globalData.actid + '-myvote-list', vlist.concat(this.data.joinid))
      
    }
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
  initVideo(vlist){
    var that = this;
    //console.log(vlist)
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
  InitImage(imglist){
    var that = this;
    var tmplist = [];
    for(var i=0;i<imglist.length;i++){
      var obj = {};
      obj.imgurl = imglist[i];
      tmplist.push(obj)
    }
    that.setData({
      dataList:tmplist
    },()=>{
      that.loadMoreImages();
    })
  },
  GetPartInfo(actid){
    var that = this;
    db.collection('VOTE_PART').doc(actid).get().then(res=>{
      console.log(res)
      var imglist = res.data.imglist;
      var videolist = res.data.videolist;
      that.setData({
        videolist,
        imglist,
        joininfo:res.data
      },()=>{
        that.initVideo(videolist);
        that.InitImage(imglist)
      })
    })
  },
  VoteQ(id){
    var that = this;
    db.collection('VOTE_LOG').where({
      userid:app.globalData.openid,
      voteto:id
    }).get().then(res=>{
      console.log(res)
      if(res.data.length!=0){
        that.setData({
          voted:true
        })
      }else{
        that.setData({
          voted:false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getrank(){
    wx.cloud.callFunction({
      name:'clouddb',
      data:{
        OP:'GET_TOP_RANK',
        actid:app.globalData.actid
      },
      success:res=>{
        console.log(res)
        var mid = this.data.joinid;
        var tdata = res.result.data;
        for(var i=0;i<tdata.length;i++){
          if(tdata[i]._id == mid){
            this.setData({
              rank:i+1
            })
            break;
          }
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id || 'b333e0365face29f009333d255fa5dad';
    console.log(id)
    that.GetPartInfo(id);
    that.VoteQ(id);
    that.setData({
      joinid:id
    },()=>{
      this.getrank();
    })
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res)

        var windowWidth = res.windowWidth;
        var imgMargin = that.data.imgMargin;
        //两列，每列的图片宽度
        var imgWidth = (windowWidth - imgMargin * 3) / 2;

        that.setData({
          windowWidth: windowWidth,
          windowHeight: res.windowHeight,
          imgWidth: imgWidth
        }, function () {
          that.loadMoreImages(); //初始化数据
        });
      }
    })
   // let votelist = 
  },
  loadImage: function (e) {

    var index = e.currentTarget.dataset.index; //图片所在索引
    var imgW = e.detail.width,
      imgH = e.detail.height; //图片实际宽度和高度
    var imgWidth = this.data.imgWidth; //图片宽度
    var imgScaleH = imgWidth / imgW * imgH; //计算图片应该显示的高度

    var dataList = this.data.dataList;
    var margin = this.data.imgMargin; //图片间距
    //第一列的累积top，和第二列的累积top
    var firtColH = this.data.topArr[0],
      secondColH = this.data.topArr[1];
    var obj = dataList[index];

    obj.height = imgScaleH;

    if (firtColH < secondColH) { //表示新图片应该放到第一列
      obj.left = margin;
      obj.top = firtColH + margin;
      firtColH += margin + obj.height;
    } else { //放到第二列
      obj.left = margin * 2 + imgWidth;
      obj.top = secondColH + margin;
      secondColH += margin + obj.height;
    }

    this.setData({
      dataList: dataList,
      topArr: [firtColH, secondColH],
    });
  },
  //加载更多图片
  loadMoreImages: function () {
    var imgs = [];

    var tmpArr = [];
    for (let i = 0; i < 22; i++) {
      var index = parseInt(Math.random() * 100) % imgs.length;
      var obj = {
        src: imgs[index],
        height: 0,
        top: 0,
        left: 0,
      }
      tmpArr.push(obj);
      imgs.splice(index, 1);
    }

    var dataList = this.data.dataList.concat(tmpArr)
    this.setData({
      dataList: dataList
    }, function () {
      wx.hideLoading()
    });
  },
  previewImg: function (e) {

    var index = e.currentTarget.dataset.index;
    var dataList = this.data.dataList;
    var currentSrc = dataList[index].imgurl;
    // var srcArr = dataList.map(function (item) {
    //   return item.src;
    // });

    wx.previewImage({
      urls: [currentSrc],
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
    return {
      path:'/pages/show/show?id='+this.data.joinid
    }
  },
  onShareTimeline:function(res){
    return {
      title:'来为我投票吧',
      path:'/pages/show/show?id='+this.data.joinid
    }
  }

})