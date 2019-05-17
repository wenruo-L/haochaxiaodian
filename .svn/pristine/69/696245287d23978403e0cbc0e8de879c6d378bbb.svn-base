// pages/books_record/books_record.js
import config from "../../utils/config.js"
import utils from "../../utils/util.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  // 请求我的红包的页面数据
  get_booksRecord_data: function () {
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
      url: config.luck_money,
      method: 'GET',
      contentType: 'application/json',
      token: that.data.token
    })
      .then((res) => {
        if (res.data.code == 0) {
          wx.hideLoading()
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
    this.setData({
      isLogin: wx.getStorageSync('isLoginsChange')
    })
    var that = this
    if (wx.getStorageSync('jwtToken') == '') {
   
      this.setData({
        isLogin: ''
      })
    } else {
      that.get_booksRecord_data()
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