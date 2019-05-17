// pageA/pages/activity/activity.js
import config from "../../utils/config.js"
import style from "../../utils/style.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false
  },
  goDel:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../pages/own_buy/own_buy?id=' + e.currentTarget.dataset.id,
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


    }
  },
  
  getUserInfo: function (e) {
    style.userInfo(e)
    var that = this
    let time = setTimeout(function () {
      that.onShow()
      clearTimeout(time)
    }, 500)
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
     

      var num = Math.random() ;
    
      return {
        title: wx.getStorageSync('userNickName') +'推荐,【好茶】中秋礼盒装，特惠专场（8.15~9.15）' ,
        // XX推荐，【好茶】中秋礼盒装，特惠专场（8.15~9.15）
        // path: '/pages/index/index?id=' + wx.getStorageSync('shop_id'),
        path: '/pages/activity/activity',
        imageUrl: "https://image.haocha.top/i1/activity/midautumn/share.png?t="+num,
        success: function (data) {
          // 转发成功
          wx.showToast({
            title: '转发成功！',
            icon: 'success'
          })
          // console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (err) {


          // 转发失败

        }
      }

     
    }

  }
})