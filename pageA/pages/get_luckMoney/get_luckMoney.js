// pages/get_luckMoney/get_luckMoney.js
import config from "../../../utils/config.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar:['分享红包','下单红包'],
    currentTab: 0,
    winheight:0,
    totalPages:0,//总页数
    nowPage:0,//当前页
    list:[],
    change:false,//提示信息
    shaerChange:false,//分享海报
    openShareChange:false,//微信、朋友圈
    userLogo:null,
    openRedEnvelopesPopup:false,//打开红包GV
    isopenRotate:false,//是否开放旋转动画
    orderid:null,
    productId:null,
    collageid:0,
    profit:null,
    imgChange:false,
    saveChange: true,//保存图片开关
  },
  
  //moneyClose
  moneyClose:function(){
    this.setData({
      openRedEnvelopesPopup:false,
      isopenRotate: false
    })
  },
  //领取红包
  openRedEnvelopes:function(e){
    console.log(e)
    // console.log(e.currentTarget.dataset.orderid)
    // console.log(e.currentTarget.dataset.productid)
    // 0/3.10
    
   
    var state=e.currentTarget.dataset.state
    var isgot = e.currentTarget.dataset.isgot
    this.setData({
     
      orderid: e.currentTarget.dataset.orderid,
      productId: e.currentTarget.dataset.productid,
      collageid: e.currentTarget.dataset.collageid,
      profit: e.currentTarget.dataset.profit,
      bestLuck: e.currentTarget.dataset.bestluck,
      index: e.currentTarget.dataset.index,

    })
    if (state == 0 ){
      wx.showModal({
        title: '提示',
        content: '订单未付款！',
      })
      return false
    } else if (state == 3 ){
      // wx.showModal({
      //   title: '提示',
      //   content: '红包已领取！',
      // })
      wx.navigateTo({
        url: '../luckMoneyDel/luckMoneyDel?orderId=' +e.currentTarget.dataset.orderid,
      })
      return false
    }else if(state==10){
      wx.showModal({
        title: '提示',
        content: '红包已失效！',
      })
      return false
    } else if (state == 1 && isgot == 1) {
      
      wx.showModal({
        title: '提示',
        content: '红包待结算！',
      })
      return false
    } else if (state == 2 && isgot == 1) {

      wx.showModal({
        title: '提示',
        content: '红包待结算！',
      })
      return false
    }

    this.setData({
      openRedEnvelopesPopup: true,
      // orderid: e.currentTarget.dataset.orderid,
      // productId: e.currentTarget.dataset.productid,
      // collageid: e.currentTarget.dataset.collageid,
      // profit: e.currentTarget.dataset.profit,
      // bestLuck: e.currentTarget.dataset.bestluck,
      // index: e.currentTarget.dataset.index,
      // isopenRotate: true
    })
  },
  loadImg:function(e){
    var that = this
    that.setData({
      // openRedEnvelopesPopup: true,
      // orderid: e.currentTarget.dataset.orderid,
      // productId: e.currentTarget.dataset.productid,
      // collageid: e.currentTarget.dataset.collageid,
      // profit: e.currentTarget.dataset.profit,
      // bestLuck: e.currentTarget.dataset.bestluck,
      // index: e.currentTarget.dataset.index,
      isopenRotate: true
    })


    var num = null;

    if (that.data.collageid == 0) {
      num = 0
    } else {
      num = 1
    }

    let times = setTimeout(function () {


      wx.navigateTo({
        url: '../getLuckyMoneySuccess/getLuckyMoneySuccess?profit=' + that.data.profit + "&bestluck=" + that.data.bestLuck + "&productId=" + that.data.productId + "&collage=" + num + "&orderId=" + that.data.orderid,
        success: function () {
          that.setData({
            openRedEnvelopesPopup: false,
            isopenRotate: false
          })
        }
      })

      clearTimeout(times)
    }, 1000)
  },
  errImg: function (e) {
    this.setData({
      openRedEnvelopesPopup: false,
    })
    wx.showModal({
      title: '提示',
      content: '网络加载领取红包图片失败！',
    })

    console.log("图片加载失败")
  },
  //点击拆红包
  moneyOpen:function(){
    // console.log(config.order_getredbag)
    // this.setData({
    //   isopenRotate: true
    // })
    // var that=this;
    // let times=setTimeout(function(){
    //   var num = null;

    //   if (that.data.collageid == 0) {
    //     num = 0
    //   } else {
    //     num = 1
    //   }

    //   wx.navigateTo({
    //     url: '../getLuckyMoneySuccess/getLuckyMoneySuccess?profit=' + that.data.profit + "&bestluck=" + that.data.bestLuck + "&productId=" + that.data.productId + "&collage=" + num + "&orderId=" + that.data.orderid,
    //   }) 
    //   that.setData({
    //     openRedEnvelopesPopup: false,
    //     isopenRotate: false
    //   })
    //   clearTimeout(times)
    // },1000)
    
   
    
  },
  navbarTap:function(e){
    var that = this
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      nowPage:0,
      list:[]
    })
   
    this.promise()
   
  },
  promise: function () {
   
    var url=null;
    if (this.data.currentTab==0){
      url = config.shareRedPacket
    }else{
      
      url = config.orderRedPacket
    
    }
   
    wx.showLoading({
      title: "加载中....",
      mask: true
    })
    var that = this
    app.promise({
      url: url,
      datas: {
        page: that.data.nowPage
      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        console.log(res)
        
        if (res.data.code == 0) {
          
           wx.hideLoading()
          
         
          for (var i = 0;i < res.data.data.pages.content.length;i++){
            //下单时间
            var orderTime = app.timeFormat(parseInt(res.data.data.pages.content[i].orderTime))
            res.data.data.pages.content[i].orderTime = orderTime
            if (res.data.data.pages.content[i].profit) {
              // var profit=res.data.data.pages.content[i].profit/100
              // res.data.data.pages.content[i].profit = profit
              
             }
            if (res.data.data.pages.content[i].profitTotal){
              var profitTotal = res.data.data.pages.content[i].profitTotal/100
              res.data.data.pages.content[i].profitTotal = profitTotal
            }
          }
          
          
          that.setData({
            list: that.data.list.concat(res.data.data.pages.content),
            totalPages:res.data.data.pages.totalPages,
            userLogo: res.data.data.user.logo
          })
          // console.log(that.data.list.length )
         
          if (that.data.list.length<=0){
           
            that.setData({
              change:true
            })
          }else{
            that.setData({
              change: false
            })
          }
        } else if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../../../pages/welcome/welcome',
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
          var errmsg = res.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }

      })
      .catch((res) => {
        console.log(res)
      })
  },

  openShare:function(){
    this.setData({
      openShareChange:true
    })
  },
  close_share:function(){
    this.setData({
      openShareChange: false,
      shaerChange: false
    })
  },
  strategy:function(){
    wx.navigateTo({
      url: '../strategy/strategy',
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res)
        that.setData({
          winheight:res.screenHeight
        })
      },
    })
    
   this.promise()
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
   
    if(app.code==0){
      // console.log("红包领取成功")
      // console.log(this.data.index)
      var index = this.data.index
      var data=this.data.list
      // data[index].state=3;
      if (data[index].state==2){
        data[index].state = 3;
      }
      data[index].isGot=1;
      this.setData({
        list: data
      })
      app.code=1
    }

   
    
   
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
    this.setData({
      nowPage:0,
      list:[]
    })

    wx.showNavigationBarLoading();
    this.promise()
   
    var time=setTimeout(function(){
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      clearTimeout(time)
    },300)
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(this.data.totalPages)
    if (this.data.nowPage < this.data.totalPages-1){
      this.data.nowPage++
      // console.log(this.data.nowPage)
      this.promise()
    }else{
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  //分享海报
  
  sharePoster: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中.....',
      mask:true
    })

    app.promise({
      url: config.share_shop_poster,
      datas: {
        shopId: wx.getStorageSync('shop_id'),
        shopPosterBaseUrl: "http://image.haocha.top/i1/poster/base/shop_1.jpg?t=" + Math.random()
      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        // console.log(res)
        if(res.data.code==0){
          wx.hideLoading()
          that.setData({
           
            saveImg: res.data.data.userShareShop.poster,
           
            shaerChange: true,
            
          })
        }
       
      })
      .catch((res) => {
        console.log(res)
      })
   
   

  },

  //打开设置
  bindopensetting:function(e){

    console.log(e.detail.authSetting["scope.writePhotosAlbum"])
    if (e.detail.authSetting["scope.writePhotosAlbum"]==true){
     
      this.setData({
        saveChange: true
      })

    }else{
      this.setData({
        saveChange: false
      })
    }
  

  },
  //取消
  cancelEvent:function(){
   
    
    this.setData({
      saveChange: true
    })
  },
  
 

 
  saveShopimage:function(){

    var that=this
     
    wx.downloadFile({
      url: that.data.saveImg,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              shaerChange: false,
              openShareChange: false

            })

          },
          fail: function (err) {
            wx.getSetting({
              success: (res) => {
                if (res.authSetting["scope.writePhotosAlbum"] == true) {

                } else {
                  that.setData({
                    saveChange: false
                  })
                }
              }
            })
          }
        })
      }
    })
   
   
  
    
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (data) {
    var that = this
    var usernickname = wx.getStorageSync('userNickName')
    var userids = wx.getStorageSync('userId')
    if (data.from === 'button') {
     
      return {
        title: usernickname + '推荐' + "#" + wx.getStorageSync("shopname") + "#" + '小店给您！快来拼好茶，拿红包！',
        path: '/pages/index/index?id=' + wx.getStorageSync('shop_id') + "&shareUserId=" + userids,
        
        imageUrl: "http://image.haocha.top/i1/poster/base/shop_share_1.png",
        
        success: function (res) {
          // 转发成功
          wx.showToast({
            title: '转发成功！',
            icon: 'success'
          })
         
        },
        fail: function (res) {


          // 转发失败
         
        }
      }
    }
  }
})