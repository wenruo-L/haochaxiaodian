// pages/choose_address/choose_address.js
import config from "../../utils/config.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    id:""//地址id
  },
  // 编辑地址
  redact_address: function (e) {
    wx.navigateTo({
      url: '../add_new_address/add_new_address?id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name + "&phone=" + e.currentTarget.dataset.phone,
      success: function (res) { },

    })
  },
  //删除地址
  delete_address: function (e) {
    var that = this
    that.setData({
      id: e.currentTarget.dataset.id
    })
    wx.request({
      url: config.delete_address,
      method: "POST",
      data: {
        id: that.data.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function (e) {
        if (e.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
        } else if(e.data.code!=0){
          var errmsg = e.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }
        wx.showToast({
          title: '删除成功！',
          icon: "success"
        })
        that.get_chooseAdderss_data()
      }
    })
  },
  // 设置默认地址
  turnAdd1: function (e) {
    var that = this
   
    that.setData({
      id: e.currentTarget.dataset.id
    })

    wx.request({
      url: config.set_default,
      method: "POST",
      data: {
        id: that.data.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function (e) {
        if (e.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
 
        } else if (e.data.code != 0){
       
          var errmsg = e.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }
        wx.showToast({
          title: '设置成功！',
          icon: "success"
        })
        that.get_chooseAdderss_data()
      }
    })
  },
  //获取管理地址的数据
  get_chooseAdderss_data: function () {
    var that = this;
    var _token = wx.getStorageSync('jwtToken')
    that.setData({
      token: _token
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: config.address_list,
      method: "GET",
      data: {

      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function (res) {
        if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
          wx.hideLoading()
        } else if (res.data.code != 0) {
          wx.hideLoading()
          var errmsg = res.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }
        wx.hideLoading()
        that.setData({
          choose_address_list: res.data.data.pages.content
        })
        var obj=[]
        var addlist = res.data.data.pages.content;
        addlist.forEach((el,index)=>{
          obj.push(el.id)
        })
       
      },
    })
  },

  // 把选中的地址带回订单详情
  turnAdd:function(e){
    var that = this
    console.log("选中的地址", e)
    wx.setStorageSync("address", e.currentTarget.dataset.index)
    that.setData({
      id:e.currentTarget.dataset.id
    })
   
    wx.request({
      url: config.set_default,
      method:"POST",
      data:{
        id:that.data.id
      },
      header:{
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success:function(e){
        if (e.data.code == 0){
          wx.navigateBack({
            delta: 1,
          })
        } else if (e.data.code == 403) {
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
      }
    })
  },
  to_add_address:function(){
    wx.navigateTo({
      url: '../add_new_address/add_new_address',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
   
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.get_chooseAdderss_data()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    setTimeout(function(){
      that.get_chooseAdderss_data()
    },500)
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