
import config from "../../utils/config.js"
import style from "../../utils/style.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0, 
    userid:"",
    headerimg:"",
    isLogin: true,
    name:"",
    token:"",
    waitPayNum:"",
    collagingNum:"",
    waitSigningNum:"",
    redEnvelopes:null,//红包数据
    userBindPhone: null,
    isbindphone: true
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log("绑定手机", e)
    wx.request({
      url: config.bindingPhone,
      data: {
        phone: "",
        code: "R0123456789",
        sessionId: wx.getStorageSync("thirdSession"),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      method: "POST",
      header: {
        'content-type': "application/x-www-form-urlencoded",
        Authorization: wx.getStorageSync("jwtToken")
      },
      success: function (res) {
        console.log("success", res)
        that.setData({
          isbindphone: true
        })
        app.msgPopupReflash = 1
        that.get_mind_data()
      },
    })
  },
  to_strategy: function () {
    wx.navigateTo({
      url: '../../pageA/pages/strategy/strategy',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  to_get_luckMoney:function(){
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../../pageA/pages/get_luckMoney/get_luckMoney',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  to_books_record:function(){
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../../pageA/pages/record/record',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  to_rankings:function(){
    wx.navigateTo({
      url: '../../pageA/pages/rankings/rankings',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 请求个人中心的页面数据
  get_mind_data:function(){
    var that = this
    var _token = wx.getStorageSync('jwtToken')
    that.setData({
      token: _token
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.promise({
      url: config.mind_content,
      method: 'GET',
      contentType:'application/json',
      token: that.data.token
    })
    .then((res)=>{
      if(res.data.code == 0){
        wx.hideLoading()
        console.log("个人中心的页面数据",res)
        if (res.data.data.user){
          that.setData({
            userid: res.data.data.user.id,
            name: res.data.data.user.nickName,
            headerimg: res.data.data.user.logo,
            userBindPhone: res.data.data.user.phone
          })
        }
        that.setData({
          waitPayNum: res.data.data.orderCountList["0"].waitPayNum,
          collagingNum: res.data.data.orderCountList["0"].collagingNum,
          waitSigningNum: res.data.data.orderCountList["0"].waitSigningNum,
        })
        // console.log(that.data.userid)
        // console.log(that.data.name)
        // console.log(that.data.headerimg)
      } else if (res.data.code == 403) {
        wx.setStorageSync('isLoginsChange', '')
        wx.setStorageSync('jwtToken', '')
        that.setData({
          isLogin: wx.getStorageSync('isLoginsChange')
        })
        

        wx.hideLoading()
      }else {
        wx.hideLoading()
        console.log(res)
        var errmsg = res.data.msg
        wx.showToast({
          title: errmsg,
          icon: "none"
        })

      }
    })
  },
  to_all_order: function (e) {
    wx.navigateTo({
      url: '../all_order/all_order'
    })
  },
  to_address_manage: function (e) {
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../address_manage/address_manage'
    })
  },
  to_about_shop: function (e) {
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../../pageA/pages/about_shop/about_shop'
    })
  },
  to_contact_shop: function (e) {
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../contact_shop/contact_shop'
    })
  },
  to_tixian: function (e) {
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../tixian/tixian'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /** 
     * 获取系统信息 
     */
    
    wx.getSystemInfo({

      success: function (res) {
        
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
  },
 
  
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
   
    var that = this;
    that.setData({ currentTab: e.detail.current });
    if (e.detail.current==1){
      if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
        that.setData({
          isbindphone: false
        })
        return
      }
      that.profit()
    }
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    // console.log(e.target.dataset.current)
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }

    if (e.target.dataset.current==1){
      if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
        that.setData({
          isbindphone: false
        })
        return
      }
      that.profit()
    }
  },
  profit:function(){
   
    // console.log(config.luck_money)
    wx.showLoading({
      title: "加载中....",
      mask:true
    })
    var that=this
    app.promise({
      url: config.luck_money,
      datas: {
       
      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        console.log("红包数据",res)
        
        if(res.data.code==0){
            wx.hideLoading()
         
          var profitTotal = res.data.data.userProfit.profitTotal/ 100
          
          res.data.data.userProfit.profitTotal=profitTotal 
         
            that.setData({
              redEnvelopes:res.data.data
            })
        }
        
      })
      .catch((res) => {
        console.log(res)
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
    wx.hideShareMenu()
    
    style.setTabItem(wx.getStorageSync('shop_id'))  

    this.setData({
      isLogin: wx.getStorageSync('isLoginsChange')
    })
    var that = this
    if (app.msgPopupReflash == 1) {
      that.get_mind_data()
      app.msgPopupReflash == 0
    }
    if (wx.getStorageSync('jwtToken') == '') {
      console.log("kong")
      this.setData({
        isLogin: ''
      })


    } else {
      that.get_mind_data()
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

  goLike:function(e){   
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../../pageA/pages/myLike/myLike?change=' + e.currentTarget.dataset.change
    })
  },
  getUserInfo: function (e) {
    style.userInfo(e)
    var that = this
    let time = setTimeout(function () {
      that.onShow()
    }, 500)
  },
})