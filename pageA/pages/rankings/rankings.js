// pageA/pages/rankings/rankings.js
import config from "../../../utils/config.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPages:0,
    nowPage:0,
    list:[],
    userProfit:{
      profitTotal:0
    },
    ranking:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onloadData()
  },
  onloadData: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.promise({
      url: config.ranking,
      datas: {

        page: that.data.nowPage

      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
      then((data) => {
        // console.log(data.data.data.ranking)
        var datas = data.data.data.pages.content

        if (data.data.code == 0) {
          wx.hideLoading()
         that.setData({
           list: that.data.list.concat(datas),
           totalPages: data.data.data.pages.totalPages, //
           userProfit: data.data.data.userProfit,
           ranking: data.data.data.ranking
         })
        } else if (data.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../../../pages/welcome/welcome',
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
          var errmsg = data.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }
        // console.log(datas)
      })
      .catch((err) => {
        console.log(err)
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
    this.setData({
      nowPage: 0,
      list: [],
      userProfit: {
        profitTotal: 0
      },
      ranking: 0
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onloadData()
    var time = setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.nowPage < this.data.totalPages - 1) {
      this.data.nowPage++
      this.onloadData()
    } else {
      wx.showToast({
        title: '没有更多数据！',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})