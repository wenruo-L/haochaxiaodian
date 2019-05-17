// pages/tixian/tixian.js
import config from "../../utils/config.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    import_sum:undefined,
    unwithdrawCash:0,
    phone:0
  },
  to_tixian_accomplish: function (e) {
    var that = this
    var tixian = parseInt(that.data.import_sum)
    var unwithdrawCash = parseInt(that.data.unwithdrawCash)
    if (that.data.phone == 0) {
      wx.showModal({
        title: '提示',
        content: '您还没绑定号码哦',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../pageA/pages/bindingPhone/bindingPhone',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        }
      })
      return
    }
    if (unwithdrawCash < tixian == true){
      wx.showModal({
        title: '提示',
        content: '余额不足',
        showCancel: false,
      })
      return
    }
    if (that.data.import_sum < 30 ){
      wx.showModal({
        title: '提示',
        content: '最低30元起可提现哦',
        // content: '最低1分钱起可提现哦',
        showCancel: false,
      })
      return
    }
    if (that.data.import_sum == undefined) {
      wx.showToast({
        title: '您还没有输入提现金额',
        icon: 'none',
      })
      return
    }
    if (that.data.import_sum > 10000) {
      wx.showToast({
        title: '单笔最高只可提现金额 1 万哦',
        icon: 'none',
      })
      return
    }
    var num = that.data.import_sum
    var numLength = num.slice(num.indexOf(".")).length - 1
    if (numLength >= 3) {
      wx.showToast({
        title: '提现金额只到分单位哦',
        icon: 'none',
      })
      return
    }
    wx.showLoading({
      title: '提交中',
      mask: true,
    })
    var amount = parseInt(that.data.import_sum * 100)
    app.promise({
      url: config.tixian,
      datas: {
        amount: amount
      },
      method: 'POST',
      contentType: "application/x-www-form-urlencoded",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {

        console.log("提现情况", res)
        if (res.data.code == 0) {
          wx.hideLoading()
          wx.navigateTo({
            url: '../tixian_accomplish/tixian_accomplish'
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
  get_unwithdrawCash:function(){
    var that = this
    wx.showLoading({
      title: '加载中.....',
      mask: true
    })
    app.promise({
      url: config.weitixian,
      datas: {

      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        console.log("提现的数据",res)
        if (res.data.code == 0) {
          wx.hideLoading()
          that.setData({
            unwithdrawCash: res.data.data.userProfit.balance,
            phone: res.data.data.user.phone
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
  sum:function(e){
    var that = this;
    console.log(e)
    var num = e.detail.value
    var numLength = num.slice(num.indexOf(".")).length-1
    if (numLength>=3){
      that.setData({
        import_sum: num
      })
      wx.showToast({
        title: '提现金额只到分单位哦',
        icon: 'none',
      })
      return
    }else{
      that.setData({
        import_sum: num
      })
    }
    console.log(that.data.import_sum)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that = this
    that.get_unwithdrawCash()
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