// components/votecard/index.js
const app = getApp();
const timeutil = require('../../common/util/timeutil.js');
const db = wx.cloud.database();
const voteconfig = require('../../common/config/dev');
const _ = db.command;
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      observer:function(newVal,oldVal){
       // console.log(newVal)
        let actid = newVal.actid;
        let voteid = newVal._id;
        let nowdate = timeutil.getformatTime();
        let userid = app.globalData.openid;
        console.log(userid)
        if(voteconfig.DayFresh){
          //如果是每天刷新的话
          db.collection('VOTE_LOG').where({
            voteto:voteid,
            userid:userid,
            time:nowdate
          }).get().then(res=>{
            console.log(res)
            if(res.data.length == 0){
              this.setData({
                voted:false
              })
            }
          })
        }else{
          db.collection('VOTE_LOG').where({
            voteto:voteid,
            userid:userid
          }).get().then(res=>{
            console.log(res)
            if(res.data.length == 0){
              this.setData({
                voted:false
              })
            }
          })
        }
        
       // console.log(nowdate)
        this.setData({
          item:newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    item:null,
    voted:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toshow(e) {
      var id =this.data.item._id;
      console.log(id);
      wx.navigateTo({
        url: '../show/show?id=' + id
      })
    },
   
    vote(e) {
      var that = this;
      let votearr = []
      let time = timeutil.getformatTime();
      if(voteconfig.DayFresh){
       
        votearr = wx.getStorageSync(time+'-votearr') || []

      }else{
        votearr = wx.getStorageSync('votearr') || []
      }
     
      wx.setStorageSync(time+'-votearr',votearr)
      wx.setStorageSync('votearr', votearr)
      if(votearr.length >= voteconfig.VoteLimit){
        wx.showToast({
          title: '已经没有票了',
          icon:'none'
        })
      }
     else{
      votearr.push(this.data.item._id)
      if (e.detail.errMsg == "getUserInfo:ok") {
        console.log('获得授权成功')
        app.globalData.userInfo = e.detail.userInfo;
        var avatar = e.detail.userInfo.avatarUrl;
      
        //console.log(avatarlist)
        var voteid = e.currentTarget.dataset.id;
        //var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name;
       // console.log(index)
        var actid = this.properties.item.actid;
        var vlist = this.properties.item.votedlist;
        console.log(voteid)
        //增加该对应票数
        //配置缓存
  
        wx.showLoading({
          title: '投票中~'
        })
        db.collection('VOTE_ACT').doc(actid).update({
          data: {
            votenum: _.inc(1)
          }
        }).then(ans => {
          console.log(ans)
          let item = this.data.item;
          item.votenum = item.votenum+1
          that.setData({
            item:item
          })
        })
        db.collection('VOTE_PART').doc(voteid).update({
          data: {
            votenum: _.inc(1),
            votelist:_.push(avatar)
          }
        }).then(ans => {
          console.log(ans)
        })
        //记录
        db.collection('VOTE_LOG').add({
          data: {
            voteto: voteid,
            userid: app.globalData.openid,
            votename: name,
            time:timeutil.getformatTime()
          },
          success: res => {
            wx.hideLoading();
            console.log(res)
           // wx.setStorageSync(actid + '-myvote-list', vlist.concat(voteid))
           that.setData({
             voted:true
           })
          },
          fail: res => {
            console.log(res)
          }
        })
        //console.log(e.detail.userInfo)
        //this.triggerEvent('topub', 'helloworld')
      } else {
        console.log('获得授权失败')
      }
     }
      
     
    },
  }
})
