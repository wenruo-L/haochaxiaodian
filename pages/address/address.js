// pages/address/address.js
var network = require('../../utils/network.js')
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    mypage: 0, //从第几页
    myPageSize: 15,//每页查询条数
    hasMoreData: true, //是否有下一页
    dateList: {},//商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //接收参数：1管理、 2位选择
    if (options.type==1){
      wx.setNavigationBarTitle({ title: app.globalData.title_Address });
    }else{
      wx.setNavigationBarTitle({ title: app.globalData.title_Address2 });
    }
    //请求接口
    that.getAddress('正在加载数据...');
  },

  getAddress: function (message) {
    var that = this;
    //参数
    var data = {
      size: that.data.myPageSize,
      page: that.data.mypage
    }
    network.requestLoading('http://lp.apit.haocha.top/user/receiptaddress/pages', data, message, function (res) {
      var contentlistTem = that.data.dateList//原来的数据
      if (res.code == 0) {//请求成功
        if (res.data.pages.first) {//是否是第一页
           contentlistTem = []
        }
        var contentlist = res.data.pages.content
       
        if (res.data.pages.last) {//不是最后一页
          that.setData({
            dateList: contentlistTem.concat(contentlist),
            mypage: res.data.pages.number + 1,//第几页
            hasMoreData: !res.data.pages.last//是否最后一页
          })
        } else {
          that.setData({
            dateList: contentlistTem.concat(contentlist),
            mypage: res.data.pages.number,
            hasMoreData: !res.data.pages.last//是否最后一页
          })
        }
       
      } else {//请求异常
        wx.showToast({
          title: res.msg,
        })
      }

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })

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
    wx.stopPullDownRefresh()//下拉后弹回顶部
    this.data.mypage = 0
    this.getAddress('正在刷新数据')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getAddress('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }


  
})