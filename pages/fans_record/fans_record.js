// pages/fans_record/fans_record.js
import config from "../../utils/config.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    shopId:"",
    token:"",
    all_detail:"",
    time_arr:"",
    yeshu:"",
    last: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this 
    
    that.setData({
      shopId: options.shopid,
      
    })
    if (options.shopid == "undefined"){
     
      return false
    }
  },
  getDateDiff: function (dateTimeStamp) {
    var result;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
      if (monthC <= 12)
        result = "" + parseInt(monthC) + "月前";
      else {
        result = "" + parseInt(monthC / 12) + "年前";
      }
    }
    else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else {
      result = "刚刚";
    }

    return result;
  },
  //请求店铺的浏览用户(粉丝浏览记录)的数据
  get_fansRecord:function(){
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    wx.request({
      url: config.fans_list_shop,
      method:"GET",
      data:{
        shopId: that.data.shopId,
        page: that.data.yeshu,
        size: 20
      },
      header:{
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success:function(res){
        if (res.data.code==0){
          wx.hideLoading()

          var show_time = res.data.data.pages.content
          var emptyArr = []

          show_time.forEach((el, index) => {

            emptyArr.push(that.getDateDiff(el.updateTime))

          })

          that.setData({
            all_detail: res.data.data.pages.content,
            time_arr: emptyArr,
            last: res.data.data.pages.last
          })
        }else if (res.data.code == 403) {
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
  //上滑请求更多的店铺的浏览用户(粉丝浏览记录)的数据
  get_new_fansRecord: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    wx.request({
      url: config.fans_list_shop,
      method: "GET",
      data: {
        shopId: that.data.shopId,
        page: that.data.yeshu,
        size: 20
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
        console.log("+++++++++++粉丝浏览记录", res)
        var show_time = res.data.data.pages.content
        var old_show_time = that.data.all_detail
        show_time.forEach((el,index)=>{
          old_show_time.push(el)
        })
        var emptyArr = []      
        show_time.forEach((el, index) => {
          emptyArr.push(that.getDateDiff(el.updateTime))
        })
        var new_timearr = that.data.time_arr
        emptyArr.forEach((el,index)=>{
          new_timearr.push(el)
        })
        console.log("==========emptyArr", emptyArr)
        console.log("==========new_timearr", new_timearr)
        
        that.setData({
          all_detail:old_show_time,
          time_arr: new_timearr,
          last:res.data.data.pages.last
        })
        console.log("================that.data.time_arr", that.data.time_arr)
      }
    })
  },
  // 处理时间的状态
  deal_timeArr:function(){
    var that = this;
    var arr = that.data.time_arr
    console.log(arr)
    arr.forEach((el,index)=>{
      that.data.all_detail[index].watchTime=el
    })
    console.log("======================all_detail", that.data.all_detail)
    that.setData({
      all_detail: that.data.all_detail
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
    var that = this;
    
    that.setData({
      token: wx.getStorageSync('jwtToken') 
    })
    if (app.jwtToken==''){
      
    }else{
      that.get_fansRecord()
      setTimeout(function () {
        that.deal_timeArr()
      }, 500)
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
    var that = this
    that.setData({ yeshu: 0 })
    wx.showNavigationBarLoading();
    that.get_fansRecord();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.last) {
      wx.showToast({
        title: '再滑也没有啦',
        icon: 'none',
      })
      return
    }
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
    that.get_new_fansRecord()
    console.log("--------------------------time_arr",that.data.time_arr)
    setTimeout(function () {
      that.deal_timeArr()
    }, 500)
    console.log("+++++++++++++++++time_arr", that.data.time_arr)
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})