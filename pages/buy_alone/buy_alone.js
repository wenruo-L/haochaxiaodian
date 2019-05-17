// pages/buy_alone/buy_alone.js
import config from "../../utils/config.js"

const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodid:"",
    token:"",
    danmai:"0",
    input_value:1,
    danmai_num: null,//单品价格转换成元单位
    danmai_fen: null,//单品价格分单位
    zongji:null,//总计价格分单位
    zongji1: null,//总计价格元单位,
    num:'',
    discountPrice:[]
  },
  // 限制input的值为0
  get_num_limit:function(res){
    var that = this;
    
    if (res.detail.value == 0 && res.detail.value <= 1) {
      wx.showToast({
        title: '最少选择一件商品哦~',
        icon: 'none'
      })
      that.setData({
        input_value: 1
      })
      that.gettotal()
    }
  },
  //获取input的值
  get_num:function(res){
    var that = this;
    

    that.setData({
      input_value: res.detail.value
    })
    that.gettotal()
  },
  // 计算总价
  gettotal: function () {
    var that = this
    var danjia = "";
    if (that.data.discountPrice.length == 0){
      console.log(111)
      danjia = that.data.danmai_num;
    }else{
      danjia = that.data.discountPrice;
      console.log(222)
    }
    console.log("danjia", danjia)
    var shuliang = that.data.input_value;
    var zongjijine = that.data.zongji;
    zongjijine = Number(danjia) * Number(shuliang) 
    that.setData({
      zongji: zongjijine
    })
    
  },
  jia:function(){
    // 点击加一的按钮
    var that = this;
    var num = that.data.input_value;
    if(num==1||num>1){
      num++;
    }
    that.setData({
      input_value: num
    })
    that.gettotal();
  },
  jian: function () {
    // 点击减一的按钮
    var that = this;
    var num = that.data.input_value;
   
    if (that.data.num!=''){
     if (that.data.input_value <= that.data.num) {
       wx.showModal({
         title: '提示',
         content: '购买数量不能少于' + that.data.num
       })
       return false
     }
   }
    if (num > 1) {
      num--;
    }
    that.setData({
      input_value: num
    })
    that.gettotal();
  },  

  to_confirm_order: function (e) {
  console.log(e)
    wx.navigateTo({
      url: '../confirm_order/confirm_order?buynum=' + e.currentTarget.dataset.buynum + "&productid=" + e.currentTarget.dataset.productid + "&skuid=" + e.currentTarget.dataset.skuid + "&price=" + e.currentTarget.dataset.price + "&realpay=" + e.currentTarget.dataset.realpay + "&discountPrice=" + e.currentTarget.dataset.discountprice
    })

  },
  bindButtonTap: function (e) {


      this.setData({
      focus: true,
    })
  },
  bindKeyInput: function (e) {
    var that =this;
    that.setData({
      input_value: e.detail.value
    })
  },
  // 获取单买下单返回的数据
  get_order_data:function(e){
    var that = this;
    var _token = wx.getStorageSync("jwtToken")
    that.setData({
      token: _token
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.good_info,
      method: 'GET',
      data: {
        productId: that.data.goodid,
        collage: that.data.danmai
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success:function(res){
        console.log(res)
        wx.hideLoading()
        if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
          wx.hideLoading()
        } else if (res.data.code != 0){
          wx.hideLoading()
          var errmsg = res.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }
        var pintuan_num = res.data.data.product.productSkuSubList
        var danmai_fen1 =[]
       
        var zanshi_danmai_num=[]//单品价格转换成元单位
        pintuan_num.forEach((el, index) =>{
          zanshi_danmai_num.push(el.price / 100)
        })
        pintuan_num.forEach((el, index) => {
          danmai_fen1.push(el.price)
        })
        var discountPriceArr = [];
        pintuan_num.forEach((el, index) => {
          if (el.discountPrice && el.discountPrice != 0) {
            discountPriceArr.push(el.discountPrice / 100)
          }
        })
        that.setData({
        
         
          danmai_good_details: res.data.data, //页面全数据
          danmai_good_detail: res.data.data.product.productImageSub,//商品图片所在的数据
          danmai_good_name: res.data.data.product,//title
          danmai_good_skuname: res.data.data.product.productSkuSubList,//商品下面的归类名字  skuname
          danmai_num: zanshi_danmai_num, //单买价格的转化
          danmai_fen: danmai_fen1,//单买价格  分单位
          discountPrice:discountPriceArr
        })
        if (res.data.data.minBuyNum){
          that.setData({
            num: res.data.data.minBuyNum,
            input_value: res.data.data.minBuyNum,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
   
    this.setData({
      goodid: options.goodid
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
    this.setData({
      isLogin: wx.getStorageSync('isLoginsChange')
    })
    var that = this
    if (wx.getStorageSync('jwtToken') == '') {  
      this.setData({
        isLogin: ''
      })   
    } else {
      that.get_order_data()
      setTimeout(function () {
        that.gettotal();
      }, 500)
    
    }
   
    setTimeout(function () {
      that.gettotal();
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
  onShareAppMessage: function () {
  
  }

})