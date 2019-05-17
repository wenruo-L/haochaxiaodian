// pages/search_index/search_index.js
import config from "../../utils/config.js"
import utils from "../../utils/util.js"
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    _latitude: "",//用户经纬度
    _longitude: "",
    token: "",
    shop_img: "",
    backStage_session: "",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winWidth: 0,
    winHeight: 0,
    showModal: true,
    near_shop_list: "",
    yeshu: "0",
    shop_julis: "",
    latitudeChange: true,
    last:false,
    name:""
  },
  search_result: function (e) {
    var that = this;
    console.log("失去焦点", e)
    if (e.detail.value == " ") {
      wx.showToast({
        title: '请输入店铺名',
        icon: 'none',
      })
      return
    } else {
      that.setData({
        name: e.detail.value
      })
    }
  },
  To_ad: function () {
    wx.navigateTo({
      url: '../AD/AD',
    })
  },
  get_location: function () {
    var that = this;

  },
  // 组件跳转tabbar不可传参，需把所传参数缓存
  to_own_shop: function (res) {
    app.shop_id = res.currentTarget.dataset.id
    wx.setStorageSync("shop_id", app.shop_id)
    wx.switchTab({
      url: '../index/index'
    })
  },
  to_ruzhu: function (e) {
    wx.navigateTo({
      url: '../ruzhu/ruzhu'
    })
  },
  getCity: function (latitude, longitude) {
    var that = this;
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var params = {
      ak: "bUvpE27RUZW8GmHebrXkjAG0NPGtL1Zk",//免费去百度地图上申请一个
      output: "json",
      location: latitude + "," + longitude
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        wx.setStorageSync("sheng", res.data.result.addressComponent.province)
        wx.setStorageSync("shi", res.data.result.addressComponent.city)
        wx.setStorageSync("qu", res.data.result.addressComponent.district)
        that.setData({
          nowlocation: res.data.result.formatted_address,
        })
      }
    })
  },
  //获取用户经纬度保存本地并提交
  getuser_location: function () {
    this.setData({
      yeshu:0
    })
    if (this.data._longitude != '') {
      let _this = this
      var _token = wx.getStorageSync('jwtToken')
      _this.setData({
        token: _token
      })
      wx.showLoading({
        title: '正在拼命加载！',
        icon: 'none'
      })


      wx.request({
        url: config.get_near_shop,
        method: 'GET',
        data: {
          // 经纬度参数
          longitude: _this.data._longitude,
          latitude: _this.data._latitude,
          name: _this.data.name,
          page: _this.data.yeshu,
          size: 10
        },
        header: {
          'content-type': 'application/json',// GEt的请求方式为默认 
          Authorization: _this.data.token
        },
        success: function (e) {
          console.log(e)
          var juli_data = e.data.data.pages.content
          var shop_juli = []
          juli_data.forEach((el, index) => {
            shop_juli.push((el.juli / 1000).toFixed(1))
          })
          _this.setData({
            near_shop_list: e.data.data.pages.content,
            shop_julis: shop_juli,
            last: e.data.data.pages.last
          })

          wx.hideLoading()

        },
        fail: function (e) {

        }
      })
    }


  },
  get_new_shopList: function () {
    var _this = this
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: config.get_near_shop,
      method: 'GET',
      data: {
        // 经纬度参数
        longitude: _this.data._longitude,
        latitude: _this.data._latitude,
        name: _this.data.name,
        page: _this.data.yeshu,
        size: 10
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: _this.data.token
      },
      success: function (res) {
        
        wx.hideLoading()
        console.log("新",res)
        if (res.data.data.pages.totalPages == _this.data.yehsu) {
          var pages = _this.data.yeshu
          pages = 0
          _this.setData({
            yeshu: pages
          })
          return
        }
        var shoplist = res.data.data.pages.content;
        var allshoplist = _this.data.near_shop_list
        shoplist.forEach((el, index) => {
          allshoplist.push(el)
        })
        var juli_data = res.data.data.pages.content
        var shop_juli = []
        juli_data.forEach((el, index) => {
          shop_juli.push((el.juli / 1000).toFixed(1))
        })
        var old_shop_julis = _this.data.shop_julis;
        shop_juli.forEach((el, index) => {
          old_shop_julis.push(el)
        })
        _this.setData({
          near_shop_list: allshoplist,
          shop_julis: old_shop_julis,
          last: res.data.data.pages.last
        })

      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var that = this;

    wx.getSystemInfo({
      success: function (res) {

        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getCity(latitude, longitude);
        that.setData({
          _latitude: res.latitude,
          _longitude: res.longitude,
        })
        that.getuser_location()
      }
    })
  },
  modalCancel: function () {
    this.setData({
      showModal: true,
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLaunch: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this






  },
  showPopup: function () {
    this.openConfirm()
    
  },

  openConfirm: function () {
    var that = this

    that.setData({
      latitudeChange: false
    })

  },
  cancelEvent: function () {
    this.setData({
      latitudeChange: true
    })
  },
  bindopensetting: function (e) {

    if (e.detail.authSetting["scope.userLocation"] == true) {
      this.setData({
        latitudeChange: true
      })
      wx.showLoading({
        title: '加载中',

      })
      var that = this
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          that.getCity(latitude, longitude);
          that.setData({
            _latitude: res.latitude,
            _longitude: res.longitude,
          })
          that.getuser_location()
        }
      })

    } else {
      this.setData({
        latitudeChange: false
      })
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
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '请求数据中',
    })

    that.setData({
      yeshu: 0
    })
    that.getuser_location();
    wx.hideNavigationBarLoading();

    let time = setTimeout(function () {
      wx.stopPullDownRefresh()
      clearTimeout(time);
    }, 500)
    wx.hideLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log(222)
    console.log("that.data.last",that.data.last)
    if (that.data.last) {
      wx.showToast({
        title: '再滑也没有啦',
        icon: 'none'
      })
      return false
    }
    that.setData({
      yeshu: that.data.yeshu + 1
    })
    wx.showLoading({
      title: '正在获取更多动态信息~',
      icon: 'loading',
      duration: 1500
    })
    that.get_new_shopList()
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})