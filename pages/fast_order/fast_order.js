// pages/fast_order/fast_order.js
import config from "../../utils/config.js"
import style from "../../utils/style.js"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: [{ name:'全部', categoryId:0}],
    // tab切换  
    currentTab: 0,
    winWidth: 0,
    winHeight: 0, 
    vertical:true,
    buyNum:1,
    choose_good:true,
    yeshu:0,
    categoryId:0,
    last:false,
    shopID:0,     
    teaContent:[],
    goodsDetail:"",
    pintuan_details:"",//后台返回的商品数据
    kashishijian:"",
    collagingOrderNum:"",
    daojishi:"",
    display_multiple_items: 2,
    indicator_dots: false,
    autoplay:false,
    isLogin:'',
    userBindPhone: null,
    isbindphone: true
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log("绑定手机", e)
    wx.request({
      url: config.bindingPhone,
      data: {
        phone: "",
        code: "R0123456789",
        sessionId: wx.getStorageSync("thirdSession"),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      method: "POST",
      header: {
        'content-type': "application/x-www-form-urlencoded",
        Authorization: wx.getStorageSync("jwtToken")
      },
      success: function (res) {
        console.log("success", res)
        that.setData({
          isbindphone: true
        })
        app.msgPopupReflash = 1
        that.fast_order_data()
      },
    })
  },
  choseTheMask:function(){
    var that = this;
    that.setData({
      choose_good:true
    })
  },
  //点击加
  jia: function (e) {
    // 点击加一的按钮
    var that = this;
    console.log("加",e)
    var num = that.data.buyNum;
    if (num == 1 || num > 1) {
      num++;
    }
    that.setData({
      buyNum: num,
    })
  },
  //减
  jian: function () {
    // 点击减一的按钮
    console.log("减", e)
    var that = this;
    var num = that.data.buyNum;
    if (num > 1) {
      num--;
    }
    that.setData({
      buyNum: num,
    })
  },
  //获取input的值
  get_num: function (res) {
    var that = this;
    that.setData({
      buyNum: res.detail.value,
    })
 
  },
  // 限制input的值为0
  get_num_limit: function (res) {
    var that = this;

    if (res.detail.value == 0 && res.detail.value <= 1) {
      wx.showToast({
        title: '最少选择一件商品哦~',
        icon: 'none'
      })
      that.setData({
        buyNum: 1
      })
 
    }
  },
  //去拼团
  to_buy_group_join:function(res){
    console.log("去拼团",res)
    var that = this;
    that.setData({
      choose_good: true
    })
    wx.setStorageSync("collageid", res.currentTarget.dataset.collageid)
    wx.navigateTo({
      url: '../confirm_order_pintuan/confirm_order_pintuan?buynum=' + 1 + "&productid=" + that.data.goodsDetail.productSkuSub.productId + "&skuid=" + that.data.goodsDetail.productSkuSub.id + "&price=" + that.data.goodsDetail.productSkuSub.collagePrice + "&realpay=" + that.data.goodsDetail.productSkuSub.collagePrice + "&collage=" + 2
    })
  },
  //发起拼团
  to_confirm_order_pintuan:function(){
    var that = this;
    that.setData({
      choose_good:true
    })
    wx.navigateTo({
      url: '../confirm_order_pintuan/confirm_order_pintuan?buynum=' + 1 + "&productid=" + that.data.goodsDetail.productSkuSub.productId + "&skuid=" + that.data.goodsDetail.productSkuSub.id + "&price=" + that.data.goodsDetail.productSkuSub.collagePrice + "&realpay=" + that.data.goodsDetail.productSkuSub.collagePrice + "&collage=" + 1
    })
  },
  get_goodsOrderList:function(e){
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.promise({
      url: config.oedering,
      datas: {
        id: e
      },
      method: 'GET',
      contentType: 'application/json',
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        wx.hideLoading()
        if (res.data.code == 0) {
          console.log("商品详情",res)
          // console.log("display_multiple_items", that.data.display_multiple_items)  
          var pintuan_detail = res.data.data.collagingOrderList
          // console.log("pintuan_detail.length", pintuan_detail.length)
          if (pintuan_detail.length < 2) {
            that.setData({
              display_multiple_items: 1,
              autoplay: true
            })
            // console.log("display_multiple_items2", that.data.display_multiple_items)
          }else{
            that.setData({
              autoplay: true,
              display_multiple_items: 2,
            })
          }
          var ordertime = []
          pintuan_detail.forEach((el, index) => {
            ordertime.push(el.orderTime)
          })
          var waitCollageEffectiveTime = []
          pintuan_detail.forEach((el, index) => {
            waitCollageEffectiveTime.push(el.waitCollageEffectiveTime)
          })
          that.setData({
            kashishijian: ordertime,
            daojishi: waitCollageEffectiveTime,
            pintuan_details: pintuan_detail,
            collagingOrderNum: res.data.data.collagingOrderNum
          })
        }
      })
      .catch((res) => {
        console.log(res)
      })
  },
  // 去结算界面
  to_confirm_order: function (e) {
    var that = this;
    console.log("去结算页面",e)
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    that.setData({
      goodsDetail: e.currentTarget.dataset.content
    })
    console.log("that.data.goodsDetail", that.data.goodsDetail)
    if (e.currentTarget.dataset.sign == 0){
      wx.navigateTo({
        url: '../confirm_order/confirm_order?buynum=' + 1 + "&productid=" + e.currentTarget.dataset.productid + "&skuid=" + e.currentTarget.dataset.skuid + "&price=" + e.currentTarget.dataset.price + "&realpay=" + e.currentTarget.dataset.price + "&discountPrice=" + e.currentTarget.dataset.discountprice
      })
    }else{
      that.setData({
        choose_good:false
      })
      that.onShow()
      var productid = e.currentTarget.dataset.productid
      that.get_goodsOrderList(productid)
    }
  },
  //点击切换
  clickTab: function (e) {
    // console.log("clickTab",e)
    var that = this;
    var teaContent = that.data.teaContent
    teaContent.splice(0, teaContent.length)
    // 清空数组再请求其他茶类的数据
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      categoryId:e.currentTarget.dataset.categoryid,
      yeshu:0
    })
    that.fast_order_data()
  },
  // 快速下单的选项卡数据
  fast_order_Navdata: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var dianpuID = wx.getStorageSync('shop_id')
    that.setData({
      shopID: dianpuID
    })
    app.promise({
      url: config.fast_order,
      datas: {
        shopId: dianpuID,
        categoryId: that.data.categoryId,
        page: that.data.yeshu,
        size: 10
      },
      method: 'GET',
      contentType: 'application/json',
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        wx.hideLoading()
        if (res.data.code == 0) {
          var navbarList = that.data.navbar
          var teaType = res.data.data.categoryList
          teaType.forEach((el, index) => {
            var a = {
              name: el.categoryName,
              categoryId: el.categoryId
            }
            navbarList.push(a)
          })
          that.setData({
            navbar: navbarList
          })
        }else{
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
  // 快速下单的页面数据
  fast_order_data:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var dianpuID = wx.getStorageSync('shop_id')
    that.setData({
      shopID: dianpuID
    })
    app.promise({
      url: config.fast_order,
      datas: {
        shopId: wx.getStorageSync('shop_id'),
        categoryId: that.data.categoryId,
        page:that.data.yeshu,
        size:10
      },
      method: 'GET',
      contentType: 'application/json',
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        if (res.data.code == 0) {
        wx.hideLoading()
          console.log("快速下单的数据",res)
          var teaContent = that.data.teaContent
          var dataTeaContent = teaContent.concat(res.data.data.pages.content)
          that.setData({
            teaContent: dataTeaContent,
            last: res.data.data.pages.last,
            userBindPhone: res.data.data.userBindPhone
          })
          console.log("that.data.teaContent",that.data.teaContent)
        }else {
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
  collageUserList: function () {
    var that = this
    that.setData({
      choose_good: true
    })
    wx.navigateTo({
      url: '../collageUserList/collageUserList?productId=' + that.data.goodsDetail.productSkuSub.productId,
    })
  },
  //拼团的倒计时
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  counttime: function () {
    var that = this;
    var starttime = that.data.kashishijian;
    var validtime = that.data.daojishi;
    var zong_time = [];
    starttime.forEach(function (v, i) {
      zong_time.push(Number(v) + Number(validtime[i] * 1000))
    })
    var timestamp = new Date().getTime();
    var dao = [];
    zong_time.forEach(function (a, b) {
      dao.push(Number(a) - Number(timestamp))
    })
    // console.log(dao)
    for (var i = 0; i < dao.length; i++) {
      var intDiff = dao[i];
      intDiff = parseInt(intDiff / 1000);
      var hour = 0, minute = 0, second = 0;
      if (intDiff > 0) {
        // console.log(intDiff)
        var hour = parseInt(intDiff / 3600);
        var minute = parseInt((intDiff - (hour * 3600)) / 60);
        var second = parseInt(intDiff - (hour * 3600) - (minute * 60));
        zong_time[i]--;
        that.data.pintuan_details[i].lastTimeChages = true
        var str = that.timeFormat(hour) + ':' + that.timeFormat(minute) + ':' + that.timeFormat(second);
      } else {
        var str = "已结束！";
        that.data.pintuan_details[i].lastTimeChages = false
        // clearInterval(timer);
      }
      that.data.pintuan_details[i].lastTime = str;
    }
    that.setData({
      pintuan_details: that.data.pintuan_details
    })
    // console.log(that.data.pintuan_details)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /** 
 * 获取系统信息 
 */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;

  },
  getUserInfo: function (e) {
    style.userInfo(e)
    var that = this
    let time = setTimeout(function () {
      that.onShow()
    }, 500)
  },
  /**
   * 生命周期函数--监听页面显示
   */ 

  onShow: function () {
    var that = this;
    this.setData({
      isLogin: wx.getStorageSync('isLoginsChange')
    })
    if (app.msgPopupReflash == 1) {
      that.fast_order_data()
      app.msgPopupReflash == 0
    }
    if (wx.getStorageSync('jwtToken') == '') {
      console.log("kong")
      this.setData({
        isLogin: ''
      })
    }else{
      var localShopID = that.data.shopID
      var cacheShopID = wx.getStorageSync('shop_id')
      var istrue = localShopID != cacheShopID
      if (istrue == true){
        // 店铺ID不同清空数组再请求其他茶类的数据
        var teaContent = that.data.teaContent
        teaContent.splice(0, teaContent.length)
        var nav = that.data.navbar
        nav.splice(1, nav.length)
      }
      if (that.data.navbar.length <= 1 || istrue == true){
      
        that.fast_order_Navdata()
      }
      if (that.data.teaContent == "" || istrue ==true){    
        
        that.fast_order_data()
      }      
      // console.log("that.data.choose_good", that.data.choose_good) 

      if (that.data.choose_good == false){
        let count_time = setTimeout(function () {
          that.counttime()
        }, 500)
        setInterval(function () {
          that.counttime()
        }, 1000)
      }
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
    that.setData({
      yeshu: 0
    })
    wx.showNavigationBarLoading();
    // 清空数组再请求其他茶类的数据
    var teaContents = that.data.teaContent
    teaContents.splice(0, teaContents.length)
    that.setData({
      teaContent: teaContents
    })
    that.fast_order_data();
    wx.hideNavigationBarLoading();
    let time = setTimeout(function () {
      wx.stopPullDownRefresh()
      clearTimeout(time);
    }, 500)
  },
  bbb:function(){
    var that = this
    that.setData({
      yeshu: 0
    })
    wx.showNavigationBarLoading();
    // 清空数组再请求其他茶类的数据
    var teaContent = that.data.teaContent
    teaContent.splice(0, teaContent.length)
    that.fast_order_data();
    wx.hideNavigationBarLoading();
    let time = setTimeout(function () {
      wx.stopPullDownRefresh()
      clearTimeout(time);
    }, 500)
  },
  aaa:function(){
    var that = this;
    console.log("that.data.last", that.data.last)
    if (that.data.last == true) {
      wx.showToast({
        title: '再滑也没有啦',
        icon: 'none'
      })
    } else {
      that.setData({
        yeshu: that.data.yeshu + 1
      })
      wx.showLoading({
        title: '正在获取更多商品信息~',
        icon: 'loading',
        duration: 1500
      })
      that.fast_order_data()
      wx.hideLoading()
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log("that.data.last", that.data.last)
    if (that.data.last == true) {
      wx.showToast({
        title: '再滑也没有啦',
        icon: 'none'
      })
    }else{
      that.setData({
        yeshu: that.data.yeshu + 1
      })
      wx.showLoading({
        title: '正在获取更多商品信息~',
        icon: 'loading',
        duration: 1500
      })
      that.fast_order_data()
      wx.hideLoading()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //去到商品详情
  goDel:function(e){
    //去拼团
    if (e.currentTarget.dataset.id>0){
      wx.navigateTo({
        url: '../group_booking/group_booking?id=' + e.currentTarget.dataset.productid + "&redbag=" + e.currentTarget.dataset.redbag
      })
    }else{
      //去单买
      wx.navigateTo({
        url: '../own_buy/own_buy?id=' + e.currentTarget.dataset.productid + "&redbag=" + e.currentTarget.dataset.redbag
      })
    }
  }
})