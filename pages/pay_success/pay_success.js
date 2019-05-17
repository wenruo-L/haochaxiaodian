// pages/pay_success/pay_success.js
import config from "../../utils/config.js"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    winHeight: 0,
    winwidth:0,
    comeOutAnimation:{},
    mask: true,
    orderId:"",
    token:"",
    ziti:true,
    bestluck:"",
    profit:"",
    productId:"",
    collage:""
  },
  ensureOrder:function(){
    var that = this
    wx.showLoading({
      title: '加载中....',
      mask: true
    })
    app.promise({
      url: config.ensure_shouhuo,
      datas: {
        id: that.data.orderId
      },
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      token: that.data.token
    }).
      then((res) => {
        if (res.data.code == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '收货成功！',
            icon: 'success',
          })
          wx.redirectTo({
            url: '../all_order/all_order',
          })
        } else if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
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
  to_index:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  to_all_order:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../all_order/all_order',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.dingdanId){
      that.setData({
        orderId: options.dingdanId,
        productId: options.productId,
        collage: options.collage,
      })
    } 
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winwidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
  },
  getPaySuccess:function(res){
    var that = this
    wx.showLoading({
      title: '加载中....',
      mask: true
    })
    app.promise({
      url: config.order_money,
      datas: {
        id: that.data.orderId
      },
      method: 'GET',
      contentType: 'application/json',
      token: that.data.token
    }).
      then((res) => {
        
          wx.hideLoading()
        if (res.data.code == 0) {
          var orderId = res.data.data.order.id
          if (res.data.data.order.freightPayType == 1 && res.data.data.order.state==2){
            that.setData({
              ziti: false
            })
          }
          if (res.data.data.userOrderProfit == null){
            that.setData({
              mask:true
            })
          }else{
            that.setData({
              mask: false
            })
            var profit = res.data.data.userOrderProfit.profit
            var bestluck = res.data.data.userOrderProfit.bestLuck
            that.setData({
              profit: profit,
              bestluck: bestluck
            })
          }
        } else if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _token = wx.getStorageSync('jwtToken')
    this.setData({
      token: _token
    })
    this.animation = wx.createAnimation({
      duration:1300,
      timingFunction:"linear"
    })
    var that = this
    if (that.data.orderId!=""){
      that.getPaySuccess()
    }
  },
  close_mask:function(){
    var that = this;
    
    that.setData({
      mask:true
    })
  },
  open:function(res){  
    this.animation.rotateY(360).step()
    this.setData({ 
      comeOutAnimation: this.animation.export()
    })
    var that = this
      wx.navigateTo({
        url: '../../pageA/pages/getLuckyMoneySuccess/getLuckyMoneySuccess?profit=' + that.data.profit + "&bestluck=" + that.data.bestluck + "&productId=" + that.data.productId + "&collage=" + that.data.collage + "&orderId=" + that.data.orderId,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    setTimeout(function(){
      that.setData({
        mask:true
      })
    },1000)
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