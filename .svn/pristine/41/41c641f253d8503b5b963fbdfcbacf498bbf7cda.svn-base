// pages/own_buy/own_buy.js
import config from "../../utils/config.js"
import utils from "../../utils/util.js"
import style from "../../utils/style.js"

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    goodid: "",
    token: "",
    produceTime: "",
    good_detail: "",
    imgUrls: [],
    years: "",
    price: "",
    notlike: null,
    like: null,
    shopId: "",
    productId: "",
    commission: null, //佣金！
    goodimg: "",
    goodnames: "",
    collage: "0",
    shangpinIds: "",
    options: "",
    userid: "",
    showModal: true,
    testNum: 0,
    share__enter: ""
  },
  toSearchIndex: function() {

    wx.redirectTo({
      url: '../search_index/search_index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  to_buy_alone: function(e) {

    wx.navigateTo({
      url: '../buy_alone/buy_alone?goodid=' + e.currentTarget.dataset.goodid,
    })
  },
  // 收藏商品
  collect: function(e) {

    var that = this;
    that.setData({
      notlike: true,
      like: false
    })
    wx.request({
      url: config.collect_good,
      method: 'POST',
      data: {
        shopId: that.data.shopId,
        productId: that.data.productId,
        operate: 0
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function(res) {
        if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
          wx.hideLoading()
        } else if (res.data.code != 0) {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000
          })
        }
        wx.showToast({
          title: '收藏成功！',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  // 取消收藏
  cancel_collect: function(e) {
    var that = this;
    that.setData({
      notlike: false,
      like: true
    })
    wx.request({
      url: config.collect_good,
      method: 'POST',
      data: {
        shopId: that.data.shopId,
        productId: that.data.productId,
        operate: 1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function(res) {
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
        wx.showToast({
          title: '不要人家了嘛QAQ',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 获取商品的数据
  get_good_data: function() {
    var that = this;
    var _token = wx.getStorageSync('token')
    that.setData({
      token: _token
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.show_good_scan,
      method: 'GET',
      data: {
        id: that.data.goodid,
      },
      header: {
        'content-type': 'application/json', // GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function(res) {
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
        var dianpuid = res.data.data.product.shopId
        app.shop_id = res.data.data.product.shopId
        wx.setStorageSync("shop_id", app.shop_id)
        var produceTimes = res.data.data.product.produceTime
        var year = new Date(parseInt(res.data.data.product.produceTime)).getFullYear();
        var price_list = res.data.data.productSkuList
        var priceArr = []
        var good_id = []
        var commission_num = []
        var inProvinceFreight_num = []
        if (res.data.data.product.isLike == 1) {
          that.setData({
            notlike: true,
            like: false
          })
        }
        if (res.data.data.product.isLike == 0) {
          that.setData({
            notlike: false,
            like: true
          })
        }
        price_list.forEach((el, index) => {

          priceArr.push(el.price / 100)
        })
        price_list.forEach((el, index) => {
          good_id.push(el.productId)
        })
        price_list.forEach((el, index) => {
          commission_num.push(el.commission)
        })
        price_list.forEach((el, index) => {
          inProvinceFreight_num.push(el.inProvinceFreight)
        })

        var goodname = res.data.data.product.title
        var shareGoodImg = res.data.data.productMainImageList["0"].path
        var shangpinId = res.data.data.product.id
        that.setData({
          own_buy_top_data: res.data.data.product, //单买顶部的数据
          imgUrls: res.data.data.productMainImageList, //商品轮播图
          good_detail: res.data.data.productDetailImageList, //商品参数
          years: year,
          price: priceArr,
          shopId: dianpuid,
          productId: good_id,
          commission: commission_num,
          inProvinceFreight: inProvinceFreight_num,
          goodimg: shareGoodImg,
          goodnames: goodname,
          shangpinIds: shangpinId
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    //正常进入商品页的id
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var shopId = scene.substring(4);

      that.setData({
        goodid: shopId
      })
    }



    var op = options
    var msgg = JSON.stringify(op)
    that.setData({
      options: msgg
    })






  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    if (that.data.token == "") {
      // utils.get_token();

      var i = setInterval(function() {
        that.setData({
          testNum: that.data.testNum++
        })
        var _token = wx.getStorageSync('token')
        if (_token) {
          that.setData({
            token: _token
          })
          clearInterval(i);

          that.get_good_data()
        }
      }, 1000)
    } else {
      wx.hideLoading()
      that.get_good_data()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this


    this.setData({
      isLogin: wx.getStorageSync('isLoginsChange')
    })

    if (wx.getStorageSync('jwtToken') == '') {



      this.setData({
        isLogin: ''
      })
    } else {
      that.get_good_data()

    }
  },
  getUserInfo: function(e) {
    style.userInfo(e)
    var that = this
    let time = setTimeout(function() {
      that.onShow()
    }, 500)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    var userids = wx.getStorageSync('uid')
    that.setData({
      userid: userids,
    })

    if (res.from === 'button') {

      return {
        title: '我推荐' + that.data.goodnames + '给您！',
        path: '/pages/own_buy/own_buy?shangpin=' + that.data.shangpinIds + "&shangpu=" + that.data.shopId + "&fenxiangzhe=" + that.data.userid,
        imageUrl: that.data.goodimg,



        success: function(res) {
          // 转发成功
          wx.showToast({
            title: '转发成功！',
            icon: 'success'
          })

        },
        fail: function(res) {
          // 转发失败

        }
      }


    }
  },


})