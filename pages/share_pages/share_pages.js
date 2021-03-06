// pages/share_pages/share_pages.js
import config from "../../utils/config.js"
import utils from "../../utils/util.js"
import style from "../../utils/style.js"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true,
    productId:0,
    productSkuId:0,
    payPrice:0,
    buyNum:1,
    realPay:0,
    collage:2,
    collageId:0,
    shopId:0,
    kashishijian:"",
    daojishi:"",
    hours:"",
    mins:"",
    secs:"",
    all_detail:"",
    beShareNickname:"",//被分享的人的名字
  },

  to_confirm_order_pintuan:function(){
    var that= this
    wx.navigateTo({
      url: '../confirm_order_pintuan/confirm_order_pintuan?buynum=' + that.data.buyNum + "&productid=" + that.data.productId + "&skuid=" + that.data.productSkuId + "&price=" + that.data.payPrice + "&realpay=" + that.data.payPrice + "&collage=" + that.data.collage
    })
  },
  to_group_booking:function(){
    var that = this
    wx.navigateTo({
      url: '../group_booking/group_booking?productid=' + that.data.productId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //待付款的倒计时
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  counttime: function () {
    var that = this;
    var starttime = that.data.kashishijian;
    var validtime = that.data.daojishi;
    var timestamp = new Date().getTime();
    var finaltime = []
    finaltime = Number(starttime) + Number(validtime * 1000)
    var daojishi = []
    daojishi = Number(finaltime) - Number(timestamp)
    if (finaltime - timestamp > 0) {
      let time = parseInt((finaltime - timestamp) / 1000)
      let hours = parseInt(time / 3600);
      let mins = parseInt((time - (hours * 3600)) / 60);
      let secs = parseInt(time - (hours * 3600) - (mins * 60));
      that.setData({
        hours: this.timeFormat(hours),
        mins: this.timeFormat(mins),
        secs: this.timeFormat(secs),
        timer: time
      })

    } else {
      return
      that.setData({
        hours: "00",
        mins: "00",
        secs: "00"
      })
    }
  },
  get_sharepages_data:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.promise({
      url: config.confirm_an_order,
      datas: {
        productId: that.data.productId,
        productSkuId: that.data.productSkuId,
        payPrice: that.data.payPrice,
        buyNum: that.data.buyNum,
        moneyPay: that.data.payPrice,
        collage: that.data.collage,
        collageId: that.data.collageId,
      },
      method: 'POST',
      contentType: "application/x-www-form-urlencoded",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        console.log("分享商品详情", res)
        if (res.data.code == 0) {
          wx.hideLoading()
          var paytimes = res.data.data.order.userCollageTime
          var waitCollageEffectiveTime = res.data.data.order.waitCollageEffectiveTime
          var pintuanid = wx.setStorageSync("collageid",res.data.data.order.collageId)
          that.setData({
            all_detail: res.data.data,
            kashishijian: paytimes,
            daojishi: waitCollageEffectiveTime,
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
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
          wx.navigateTo({
            url: '../group_booking/group_booking?shangpin=' + that.data.productId,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })
      .catch((res) => {
        console.log(res)
      })
  },
  
  getUserInfo: function (e) {
    console.log(e)
    
    style.userInfo(e)
    var that = this
    that.setData({
      beShareNickname: e.detail.userInfo.nickName
    })
    let time = setTimeout(function () {
      that.onShow()
    }, 500)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("接受分享拼团里的数据",options)
    var that = this
    that.setData({
      collageId: options.collageId,
      payPrice: options.payPrice,
      productSkuId: options.productSkuId,
      productId: options.shangpin,
      shopId: options.shangpu
      
    })
    wx.setStorageSync('shop_id', options.shangpu)
    wx.getUserInfo({
      success: function (res) {
        console.log(res, "用户信息")
        that.setData({
          beShareNickname: res.userInfo.nickName
        })
      }
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
    setInterval(this.counttime, 1000)
    this.setData({
      isLogin: wx.getStorageSync('isLoginsChange')
    })
    // console.log(wx.getStorageSync('isLoginsChange'))
    if (wx.getStorageSync('jwtToken') == '') {
      console.log("kong")
      this.setData({
        isLogin: ''
      })
    }else{
      this.get_sharepages_data()
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
  
  }
})