// pageA/pages/luckMoneyDel/luckMoneyDel.js
import config from "../../../utils/config.js"
import utils from "../../../utils/util.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:0,
    all_detail:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.orderId){
      that.setData({
        orderId: options.orderId
      })
    }
    
  },
  get_luckymeney_del:function(){
    var that=this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.promise({
      url: config.luckymoneyDel,
      datas: {
        orderId: that.data.orderId
      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        
        console.log("红包详情", res)
        if (res.data.code == 0) {
          wx.hideLoading()
          var ordertimeArr=[]
          var ordertime = res.data.data.myUserOrderProfit.orderTime
          ordertimeArr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          console.log("ordertimeArr", ordertimeArr)
          var successTimeArr = []
          var successTime = res.data.data.myUserOrderProfit.successTime
          successTimeArr.push(utils.formatTime(successTime / 1000, 'Y/M/D h:m:s'))
          if (successTime != 0){
            that.setData({
              jiesuanshijian: successTimeArr
            })
          }
          that.setData({
            all_detail:res.data.data,
            xiadanshijian: ordertimeArr
          })
          console.log("that.data.xiadanshijian",that.data.xiadanshijian)
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
    var that = this
    that.get_luckymeney_del()
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