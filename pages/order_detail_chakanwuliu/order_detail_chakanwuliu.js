// pages/order_detail_chakanwuliu/order_detail_chakanwuliu.js
import config from "../../utils/config.js"
import utils from "../../utils/util.js"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    token:""
  },
  // 获取物流详情的数据
  get_danmai_order_detail: function () {
    var that = this;
    var _token = wx.getStorageSync('jwtToken')
    that.setData({
      token: _token
    })
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    wx.request({
      url: config.logistics_detail,
      method: 'GET',
      data: {
        id: that.data.id
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.hideLoading()
          console.log(res)
          var errmsg = res.data.msg
          wx.showToast({
            title: errmsg,
            icon: "none"
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 800)
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
        wx.hideLoading()
        console.log("成功拿回物流详情的数据！", res)
 
    
        // arr.push(utils.formatTime(res.data.data.order.orderTime))
       
        that.setData({
        all_data:res.data.data,
        wiliu_data:res.data.data.deliveryTrack.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("接收待付款传过来的id", options)
    that.setData({
      id: options.id
    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.get_danmai_order_detail()
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