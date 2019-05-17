// pages/pinhaocha/pinhaocha.js
import config from "../../utils/config.js"
import style from "../../utils/style.js"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    shop_id_obj:"",
    pintuan_nums:null,
    danmai_nums:null,
    haocha_dynamic_list:[],
    header_list:[],
    yeshu: 0,
    index_middle_list: "",
    isLogin:true
  },
  get_token: function(){
    var that = this;
    var _token = wx.getStorageSync('jwtToken')
    var shop_id = wx.getStorageSync('shop_id')
    that.setData({
      token: _token,
      shop_id_obj: shop_id
    })
    wx.showLoading({
      title: '加载中',
    })
    // 拿拼好茶的数据
    wx.request({
      url: config.pinhaocha_data,
      method:'GET',
      data:{
        shopId: that.data.shop_id_obj
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success:function(res){
        if(res.data.code==0){
          wx.hideLoading()

          var pintuan_num = res.data.data.pages.content;
          var zanshi_pintuan_num = []
          var zanshi_danmai_num = []
          var pintuan_member_list = res.data.data;
          pintuan_num.forEach((el, index) => {
            zanshi_pintuan_num.push(el.productSkuSub.collagePrice / 100)
          })
          pintuan_num.forEach((el, index) => {
            zanshi_danmai_num.push(el.productSkuSub.price / 100)
          })
          that.setData({
            haocha_dynamic_list: res.data.data.pages.content,
            header_list: pintuan_member_list,
            pintuan_nums: zanshi_pintuan_num,
            danmai_nums: zanshi_danmai_num
          })

          console.log(that.data.haocha_dynamic_list)
        } else if (res.data.code==403){
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          that.setData({
            isLogin: wx.getStorageSync('isLoginsChange')
          })
          wx.hideLoading()
        }
      }
    })
 
  },
  _play_num:function(el) {
    return el > 1000? (el / 1000): el
  },
  get_new_group_list:function(){
    var that  = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.pinhaocha_data,
      method: 'GET',
      data: {
        shopId: that.data.shop_id_obj,
        page: that.data.yeshu,
        size: 10
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function (res) {
        wx.hideLoading()
       
        if (res.data.data.pages.last == true) {
         
          wx.showToast({
            title: '再滑也没有新的啦！',
            icon: 'none'
          })
          var pages = that.data.yeshu
          pages = pages - 1
          that.setData({
            page: pages
          })
          return
        }
        var grouplist = res.data.data.pages.content;

        var allgrouplist = that.data.haocha_dynamic_list

        grouplist.forEach((el,index)=>{
          allgrouplist.push(el)
        })
       
        that.setData({
          haocha_dynamic_list: allgrouplist,

        })
      }
    })
  },
  
  to_group_booking: function (e) {
    // redbag
    wx.navigateTo({
      url: '../group_booking/group_booking?id=' + e.currentTarget.dataset.id + "&redbag=" + e.currentTarget.dataset.redbag
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    
    
    if (options.shop_id){
      wx.setStorageSync('shop_id', options.shop_id)
    }

    
    

  },
  
  loadImg:function(e){
    // console.log(e.currentTarget.dataset.id)
        wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    style.setTabItem(wx.getStorageSync('shop_id'))
    if (wx.getStorageSync('shop_id') =="1138850301499932672"){
      wx.setNavigationBarTitle({
        title: '中秋特惠专场',
      })
      // wx.showLoading({
      //   title: '加载中........',
      // })
    }else{
      wx.setNavigationBarTitle({
        title: '拼团',
      })
    } 
    
    this.setData({
      isLogin: wx.getStorageSync('isLoginsChange'),
      shop_id: wx.getStorageSync('shop_id')
    })
    var that = this
    if (wx.getStorageSync('jwtToken') == '') {
    
      this.setData({
        isLogin: ''
      })


    } else {
      this.get_token()
    
    }

   
  },
  getUserInfo: function (e) {
    style.userInfo(e)
    var that = this
    let time = setTimeout(function () {
      that.onShow()
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
    
    var that = this
    wx.showNavigationBarLoading();
    if (wx.getStorageSync('shop_id') == "1138850301499932672") {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      return false
    }
    that.get_token();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (wx.getStorageSync('shop_id') == "1138850301499932672"){
      return false
    }
    var that = this;
    var YeShu = that.data.yeshu;
    YeShu = Number(YeShu) + 1
    that.setData({
      yeshu: YeShu
    })
   
    wx.showLoading({
      title: '正在获取更多动态信息~',
      icon: 'loading',
      duration: 1500
    })
    that.get_new_group_list()
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button' && wx.getStorageSync('shop_id') =="1138850301499932672") {
      // 来自页面内转发按钮


      var num = Math.random();

      return {
        title: wx.getStorageSync('userNickName') + '推荐,【好茶】中秋中高端茶礼,特惠专场（8.15~9.15）',
        
        path: '/pages/pinhaocha/pinhaocha?shop_id=1138850301499932672' ,
        imageUrl: "https://image.haocha.top/i1/activity/midautumn/share.png?t=" + num,
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
  },


  //中秋功能------------------------------------------
  goDel: function (e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../pages/own_buy/own_buy?id=' + e.currentTarget.dataset.id,
    })
  },
})