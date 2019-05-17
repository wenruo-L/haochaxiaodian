// pageA/pages/bindingPhone/bindingPhone.js
import config from "../../../utils/config.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime:60,
    time:"发送验证码",
    disabled:false,
    code: 0, 
    phone:0,
    type:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //验证码倒计时函数
  Code: function (options) {
    var that = this;
    if (that.data.phone ==0 ){
      wx.showToast({
        title: '请输入您的手机号码',
        icon: 'none',
      })
      return
    }else{

    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + '秒'
    })
    var interval 
    interval = setInterval(function () {
      that.setData({
        time: (currentTime - 1) + '秒'
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
    app.promise({
      url: config.sendText,
      datas: {
        phone: that.data.phone,
        type: that.data.type
      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        console.log("获取验证码", res)
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: '已发送验证码，请注意查收',
            showCancel: false,
          })
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
    }
  },
  getCode:function(e) {
    this.Code();
    var that = this
    if(that.data.phone != 0){
      that.setData({
        disabled: true
      })
    }
  },
  thePhone: function (e) {
    var that = this
    that.setData({
      phone: e.detail.value,
    })
    console.log(that.data.phone)
  },
  theCode:function(e){
    var that = this
    that.setData({
      code: e.detail.value,
    })
  },
  sendCode:function(){
    var that = this
    if(that.data.phone == 0){
      wx.showToast({
        title: '请输入您的手机号码',
        icon: 'none',
      })
      return
    }
    if (that.data.code == 0) {
      wx.showToast({
        title: '请输入您的验证码',
        icon: 'none',
      })
      return
    }
    wx.showLoading({
      title: '提交中',
      mask: true,
    })
    app.promise({
      url: config.bindingPhone,
      datas: {
        phone: that.data.phone,
        code: that.data.code
      },
      method: 'POST',
      contentType: "application/x-www-form-urlencoded",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        console.log("绑定手机", res)
        if (res.data.code == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '绑定成功！',
            icon: 'success',
          })
          wx.navigateBack({
            delta: 1,
          })
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