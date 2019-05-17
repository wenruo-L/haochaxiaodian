// pages/confirm_order /confirm_order .js
import config from "../../utils/config.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiptAddress:"",//用户地址，没有会为null
    address_id:"",
    productId:"",
    productSkuId:"",
    payPrice:"",  
    buyNum:"",
    realPay:"",
    collage:"1",
    collageId:"",
    token:"",
    zhendezonge:'',//这是单独请求地址数据的
    freight:null,
    freightPayType:4,
    payType:2,
    local_address:"",
    ziti:true,
    zongjijine:"",
    luckyMoneyIcon: true,
    NoChangeFreight: "",
    shifu: "",
    shareUserId: "",
    userShareShopId: "",
    userShareProductId: "",
    dingdanId: "",
    luckyMoney: "",
    NoChangeluckyMoney: "",
    noChangeRealpay: 0,
    sendRealpay: "",
    balancePay: 0,
    redBagBalance: 0,//红包余额
    shopProvince: "",
    inProvinceFreight: "",
    outProvinceFreight: "",
    originalPrice:0
  },
  // 限制input的值为0
  get_num_limit: function (res) {
    var that = this;
    // console.log("限制input值为0的函数", res)
    if (res.detail.value == 0 && res.detail.value <= 1) {
      wx.showToast({
        title: '最少选择一件商品哦~',
        icon: 'none'
      })
      that.setData({
        buyNum: 1
      })
      that.gettotal()
    }
  },
  //获取input的值
  get_num: function (res) {
    var that = this;
    // console.log("input的点击事件", res)
    that.setData({
      buyNum: res.detail.value
    })
    that.gettotal()
  },
  jia: function () {
    // 点击加一的按钮
    var that = this;
    var num = that.data.buyNum;
    if (num == 1 || num > 1) {
      num++;
    }
    that.setData({
      buyNum: num
    })
    that.gettotal();
  },
  jian: function () {
    // 点击减一的按钮
    var that = this;
    var num = that.data.buyNum;
    if (num > 1) {
      num--;
    }
    that.setData({
      buyNum: num
    })
    that.gettotal();
    
  },
  // 计算总价
  gettotal: function () {
    var that = this;
    wx.showLoading({
      title: '正在计算总额~',
      mask: true
    })
    var goodnum = that.data.buyNum; //件数
    var goodprice = that.data.payPrice;//单价
    var yunfeia = that.data.freight//运费
    var redBagBalance = that.data.redBagBalance//红包余额所减金额 (提交&&展示/红包大于等于支付金额时为支付金额-1)
    var luckyMoney = that.data.luckyMoney // 红包总金额 /展示
    var zongji = Number(goodprice * goodnum) + Number(yunfeia); //总金额  //忽略红包
    if (that.data.luckyMoneyIcon == false) {
      if (luckyMoney < zongji) {
        zongji = Number(zongji) - Number(luckyMoney)
        that.setData({
          redBagBalance: luckyMoney
        })
      } else {
        zongji = 1
        redBagBalance = Number(goodprice * goodnum) + Number(yunfeia) - 1
        console.log("redBagBalance", Number(zongji))
        that.setData({
          redBagBalance: redBagBalance
        })
      }
    } else {
      zongji = Number(goodprice * goodnum) + Number(yunfeia)
    }
    that.setData({
      realPay: zongji
    })
    wx.hideLoading()
  },
  choose_luckyMoney: function () {
    var that = this;
    var nochangefreight = that.data.NoChangeFreight;//运费
    var buyNum = that.data.buyNum;//个数
    var payPrice = that.data.payPrice;//单价
    var realPays = that.data.realPay;//实付总金额
    var noChangeRealpay = that.data.noChangeRealpay;//实付总金额
    var luckyMoney = that.data.luckyMoney//红包总额
    if (that.data.luckyMoneyIcon == true) {
      that.setData({
        luckyMoneyIcon: false
      })
    } else {
      that.setData({
        luckyMoneyIcon: true,
        realPay: noChangeRealpay,
        redBagBalance: 0
      })
    }
    that.gettotal()
  },
  choose_ziti: function () {
    var that = this;
    if (that.data.ziti == true) {
      that.setData({
        ziti: false,
        freight: 0,
        freightPayType: 1
      })
    } else {
      that.setData({
        ziti: true,
        freight: that.data.NoChangeFreight,
        freightPayType: 4
      })
    }
    that.gettotal()
  },
  to_choose_address: function (e) {
    wx.navigateTo({
      url: '../choose_address/choose_address?id=1'
    })
  },
  // 提交订单
  payment: function (e) {
    // 创建订单的数据
    var that = this;
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    that.noDefaultAddressToChooseAddress()
    if (that.data.address_id != "") {
      console.log(that.data.redBagBalance)
      console.log("========", that.data.realPay)
      wx.request({
        url: config.create_order,
        method: 'POST',
        data: {
          productId: that.data.productId,
          productSkuId: that.data.productSkuId,
          payPrice: that.data.payPrice,
          payType: that.data.payType,
          buyNum: that.data.buyNum,
          moneyPay: that.data.realPay,
          freight: that.data.freight,
          collage: that.data.collage,
          collageId: that.data.collageId,
          receiptAddressId: that.data.address_id,
          freightPayType: that.data.freightPayType,
          shareUserId: that.data.shareUserId,
          userShareShopId: that.data.userShareShopId,
          userShareProductId: that.data.userShareProductId,
          balancePay: that.data.redBagBalance,
          originalPrice: that.data.originalPrice
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
          Authorization: that.data.token
        },
        success: function (res) {
          console.log(res)
          if (res.data.code != 0) {
            wx.hideLoading()
            var errmsg = res.data.msg
            wx.showToast({
              title: errmsg,
              icon: "none"
            })
            if(that.data.collage == "2"){
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
              return
            }
          } else if (res.data.code == 403) {
            wx.setStorageSync('isLoginsChange', '')
            wx.setStorageSync('jwtToken', '')
            wx.navigateTo({
              url: '../welcome/welcome',
            })
            wx.hideLoading()
          } else {
            wx.hideLoading()
            var orderId = res.data.orderId;
            var timeStamp = res.data.data.timeStamp;
            var nonceStr = res.data.data.nonceStr;
            var packages = res.data.data.package;
            var signType = res.data.data.signType;
            var paySign = res.data.data.sign;
            wx.requestPayment({
              timeStamp: timeStamp,
              nonceStr: nonceStr,
              package: packages,
              signType: signType,
              paySign: paySign,
              success: function (e) {
                wx.hideLoading()
                if (e.errMsg == "requestPayment:ok") {
                  wx.redirectTo({
                    url: '../pay_success/pay_success?dingdanId=' + orderId + "&productId=" + that.data.productId + "&collage=" + that.data.collage,
                  })
                }
              },
              fail: function (e) {
                wx.hideLoading()
                if (e.errMsg == "requestPayment:fail cancel") {
                  wx.redirectTo({
                    url: '../all_order/all_order',
                  })
                } else {
                  var err_msg = e.err_desc;

                  wx.setStorageSync('failmsg', err_msg)
                  wx.navigateTo({
                    url: '../pay_fail/pay_fail',
                  })
                }
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '您还没有收货地址，去选择或创建您的收货地址吧',
        icon: 'none',
        duration: 1500,
        mask: true,
        success() {
          setTimeout(() => {
            wx.navigateTo({
              url: '../choose_address/choose_address',
            })
          }, 1000)
        }
      })
    }
  },
  //单独获取地址的数据
  get_address: function () {
    var that = this
    var address_detail = wx.getStorageSync("address")
    console.log("address_detail", address_detail)
    if (address_detail != "") {
      var yunfei = ""
      var bubiandeyunfei = ""
      var shopProvince = that.data.shopProvince.slice(0, 2)//商铺的省
      var userProvince = address_detail.province.slice(0, 2) //用户的省
      if (shopProvince == userProvince) {
        yunfei = that.data.inProvinceFreight
        bubiandeyunfei = that.data.inProvinceFreight
      } else {
        yunfei = that.data.outProvinceFreight
        bubiandeyunfei = that.data.outProvinceFreight
      }
      that.setData({
        receiptAddress: address_detail,
        address_id: address_detail.id,
        freight: yunfei,//运费分
        NoChangeFreight: bubiandeyunfei
      })
    }

  },

  // 获取《确认订单》页面的数据
  get_confirm_order_data: function () {
    var that = this;
    console.log(that.data.realPay)
    var _token = wx.getStorageSync('jwtToken') 
    that.setData({
      token: _token
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: config.confirm_an_order,
      method: 'POST',
      data: {
        productId: that.data.productId,
        productSkuId: that.data.productSkuId,
        payPrice: that.data.payPrice,
        buyNum: that.data.buyNum,
        moneyPay: that.data.realPay,
        collage: that.data.collage,
        collageId: that.data.collageId,
        originalPrice: that.data.originalPrice
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function (res) {
        wx.hideLoading()
        console.log("拼团订单详情",res)
        if (res.data.code != 0) {
          console.log("111")
          var errmsg = res.data.msg
          wx: wx.showModal({
            title: '提示',
            content: errmsg,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
          return
        } else if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
          wx.hideLoading()
        }
        if (res.data.data.receiptAddress == null || !res.data.data.receiptAddress) {
          console.log(1)
          that.setData({
            address_id: ""
          })
        } else {
          console.log(2)
          that.setData({
            receiptAddress: res.data.data.receiptAddress,
            address_id: res.data.data.receiptAddress.id
          })
        }
        var danmai_num1 = res.data.data.product.productSkuSub.price
        var heji_num = res.data.data.realPay
        var address_json = res.data.data.receiptAddress//用户地址
        var price = res.data.data.product.productSkuSub.collagePrice   
        // 把后台返回的数据，去判断用户是省内还是省外
        var yunfei = ""
        var bubiandeyunfei = ""
        var shopProvince = res.data.data.product.shopSub.province.slice(0, 2)//商铺的省
        if (res.data.data.receiptAddress){
          var userProvince = res.data.data.receiptAddress.province.slice(0, 2) //用户的省
        }  
        if (shopProvince == userProvince) {
          yunfei = res.data.data.product.productSkuSub.collageInProvinceFreight
          bubiandeyunfei = res.data.data.product.productSkuSub.collageInProvinceFreight
        } else {
          yunfei = res.data.data.product.productSkuSub.collageOutProvinceFreight
          bubiandeyunfei = res.data.data.product.productSkuSub.collageOutProvinceFreight
        }
        if (res.data.data.userProfit) {
          var luckyMoney = res.data.data.userProfit.balance
        }
        that.setData({
          con_order: res.data.data.product,//确认订单的全部数据信息
          payPrice: price,
          freight: yunfei,//运费分
          NoChangeFreight: bubiandeyunfei,
          luckyMoney: luckyMoney,
          NoChangeluckyMoney: luckyMoney,
          shopProvince: shopProvince,
          inProvinceFreight: res.data.data.product.productSkuSub.collageInProvinceFreight,
          outProvinceFreight: res.data.data.product.productSkuSub.collageOutProvinceFreight
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setStorageSync("productId", options.productid)
    console.log("接受下单页面的六个参数",options)
    that.setData({
      productId: options.productid,
      productSkuId: options.skuid,
      payPrice: options.price,
      originalPrice: options.price,
      buyNum: options.buynum,
      realPay: options.realpay,
      zhendezonge:options.realpay,
      collage: options.collage
    })

    that.setData({
      collageId: wx.getStorageSync("collageid") 
    })
    console.log("that.data.collageId", that.data.collageId)
    console.log("缓存里的collageid", wx.getStorageSync("collageid"))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    var shareUserId = wx.getStorageSync("shareUserId")
    var userShareShopId = wx.getStorageSync("userShareShopId")
    var userShareProductId = wx.getStorageSync("userShareProductId")
    that.setData({
      shareUserId: shareUserId,
      userShareShopId: userShareShopId,
      userShareProductId: userShareProductId
    })
    that.get_confirm_order_data()
    setTimeout(function () {
      that.gettotal()

    }, 800)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    setTimeout(function(){
      that.get_address()
    },800)
   
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
  
  },
  // 判断用户是否默认地址，没有会跳去选择地址页面
  noDefaultAddressToChooseAddress: function () {
    var that = this;
    if (that.data.address_id != '' || that.data.receiptAddress.name != "") {
      return
    } else {
      wx.showToast({
        title: '您还没有收货地址，去选择或创建您的收货地址吧',
        icon: 'none',
        duration: 1500,
        mask: true,
        success() {
          console.log("111")
          setTimeout(() => {
            wx.navigateTo({
              url: '../choose_address/choose_address',
            })
          }, 1000)
        }
      })
    }
  }
})