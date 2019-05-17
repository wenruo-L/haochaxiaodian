// pages/group_booking/group_booking.js
import config from "../../utils/config.js"
import utils from "../../utils/util.js"
import style from "../../utils/style.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    indicator_dots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    goodid: "",
    token: "",
    produceTime: "",
    good_detailsssss: "",
    imgUrls: [],
    years: "",
    price: "",//拼团价
    price_byone: "",//单买价
    sale: "",
    collage: "1",
    all_details: "",
    pintuan_details: "",
    notlike: null,
    like: null,
    shopId: "",
    productId: "",
    commission: null,//佣金！
    kashishijian: "", //下单时间
    daojishi: "",  //待付款的有效时间
    timer: [],
    arr: [],
    Time: [],
    userid: "",
    showModal: true,
    errmsg: "",
    goodimg: "",
    goodnames: "",
    shangpinIds: "",
    testNum: 0,
    options: "",
    myTimer: null,
    _thirdSessions: "",
    share__enter: true,
    collageInProvinceFreight: '',
    shareUserId:"",
    userShareProductId: "",
    share_commission: true,
    good_poster_hidden: true,
    winWidth: 0,
    winHeight: 0,
    share_type: "",
    isLogin: true,
    isLike: 0,
    display_multiple_items:2,
    redbag:0,
    code:"",
    discountPrice:null,
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
        that.get_good_data()
      },
    })
  },
  open_share: function (e) {
    var that = this
    // console.log("分享！")

    that.setData({
      goodimg: e.currentTarget.dataset.shangpintu,
      shangpinIds: e.currentTarget.dataset.shangpinid,
      goodnames: e.currentTarget.dataset.goodname,
      commission: e.currentTarget.dataset.commission,
      share_commission: false
    })
  },
  // 点击保存图片！
  clickKeepimage: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    wx.downloadFile({
      url: that.data.good_poster,
      success: function (res) {
        // console.log("==============res", res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {

            // console.log("保存图片到本地", res)

            wx.hideLoading()
            wx.showToast({
              title: '保存成功！',
              icon: 'success'
            })
            that.setData({
              share_commission: true,
              good_poster_hidden: true
            })

          },
          fail: function (res) {
            // console.log("============================失败的原因", res)
            if (res.errMsg == "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
              // console.log("打开设置窗口");
              wx.hideLoading()
              wx.showToast({
                title: '保存失败，请授权保存相册权限',
                icon: 'none',
                duration: 1500
              })
              setTimeout(function () {
                wx.openSetting({
                  success(settingdata) {
                    // console.log(settingdata)
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      // console.log("获取权限成功，再次点击图片保存到相册")
                    } else {
                      // console.log("获取权限失败")
                    }
                  }
                })
              }, 1000)
            }
            if (res.errMsg === "saveImageToPhotosAlbum:fail cancel") {

              wx.hideLoading()
              wx.showToast({
                title: '取消保存',
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },
  //获取分享商品的海报
  showShareWithFriends: function () {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              //console.log('===============储存图片授权成功', res)
            },
            fail(res) {
             // console.log('===============储存图片授权失败', res)
              wx.showToast({
                title: '拒绝授予权限将无法进行相关权限！',
                icon: 'none'
              })
            }
          })
        }
      }
    })
    that.setData({
      share_type: 1
    })
    wx.showLoading({
      title: '正在生产分享海报',
      icon: "loading"
    })
    wx.request({
      url: config.shop_poster,
      method: 'GET',
      data: {
        productId: that.data.shangpinIds,
        type: that.data.share_type
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code != 0) {
          wx.hideLoading()
          //console.log(res)
          var errmsg = res.data.msg
          wx.showToast({
            title: errmsg,
            icon: "none"
          })

        } else if (res.data.code == 403) {
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

        //console.log("拿回分享商品的海报", res)
        var good_posters = res.data.data.userShareProduct.poster

        that.setData({
          good_poster_hidden: false,
          good_poster: good_posters
        })

      }
    })
  },
  close_share_commission: function () {
    var that = this;
    that.setData({
      share_commission: true,
      good_poster_hidden: true
    })
  },
  toindex: function () {
    //console.log(111)
    wx.switchTab({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  modalCancel: function () {
    this.setData({
      showModal: true,
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
        that.data.pintuan_details[i].lastTimeChages=false
        // clearInterval(timer);
      }
      that.data.pintuan_details[i].lastTime = str;
    }
    that.setData({
      pintuan_details: that.data.pintuan_details
    })
    // console.log(that.data.pintuan_details)
  },
  // 收藏商品
  collect: function (e) {
    console.log(e)
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.showLoading({
      title: '加载中....',
      mask: true
    })
    app.promise({
      url: config.collect_good,
      datas: {
        shopId: e.currentTarget.dataset.shopid,
        productId: e.currentTarget.dataset.goodsid,
        operate: e.currentTarget.dataset.islike
      },
      method: 'POST',
      contentType: "application/x-www-form-urlencoded ",
      token: that.data.token
    })
      .then((res) => {
        console.log(res)
        if (res.data.code == 0) {
          wx.hideLoading()
          if (e.currentTarget.dataset.islike == 0) {
            wx.showToast({

              title: '收藏成功',

              icon: "none"

            })
          } else {
            wx.showToast({
              title: '取消收藏',
              icon: "none"

            })
          }

          let time = setTimeout(function () {
            that.get_good_data()
          }, 500)

        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000
          })
        }
      })
      .catch((res) => {
        console.log(res)
      })
  },
  to_buy_alone: function (e) {
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../buy_alone/buy_alone?goodid=' + e.currentTarget.dataset.goodid
    })
  },
  to_buy_group_join: function (e) {
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../buy_group_join/buy_group_join?collageid=' + e.currentTarget.dataset.collageid + "&goodid=" + e.currentTarget.dataset.goodid,
    })
  },
  to_buy_group: function (e) {
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../buy_group/buy_group?goodid=' + e.currentTarget.dataset.goodid,
    })
  },
  // 获取商品的数据
  get_good_data: function () {
    var that = this;

    that.setData({
      testNum: 101
    })
    var _token = wx.getStorageSync('jwtToken')
    that.setData({
      token: _token
    })
    that.setData({
      testNum: 102
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
    
      url: config.goods_detail,
      method: 'GET',
      data: {
        id: that.data.goodid,
        collage: that.data.collage,
        shareUserId: that.data.shareUserId,
        userShareProductId: that.data.userShareProductId,
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function (res) {
       that.setData({
         code: res.data.code
       })
        wx.hideLoading()
        
        if(res.data.code==0){

          if (app.saveShopId) {
            wx.setStorageSync("shop_id", res.data.data.product.shopId)
          } else {
            app.saveShopId = true
          }
          if (res.data.data.limitBuy) {
            that.setData({
              limitBuy: res.data.data.limitBuy.buyNum
            })
          }
          var dianpuid = res.data.data.product.shopId
          var all_detail = res.data.data
          var pintuan_detail = res.data.data.collagingOrderList;
          var produceTimes = res.data.data.product.produceTime
          var year = new Date(parseInt(res.data.data.product.produceTime)).getFullYear();
          var price_list = res.data.data.productSkuList
          var priceArr = [] //拼团价
          var price_alone = [] //单买价
          var saleArr = []
          var good_id = []
          var commission_num = []
          var collageInProvinceFreight_num = []
          var waitCollageEffectiveTime = []
          var shareGoodImg = res.data.data.productMainImageList["0"].path
          var discountPriceArr = [];
          price_list.forEach((el, index) => {
            if (el.discountPrice && el.discountPrice != 0) {
              discountPriceArr.push(el.discountPrice / 100)
            }
          })
          var ordertime = []
          pintuan_detail.forEach((el, index) => {
            ordertime.push(el.orderTime)
          })
          // console.log("----------------------ordertime", ordertime)
          that.setData({
            kashishijian: ordertime,
            discountPrice:discountPriceArr
          })
          console.log("discountPrice",that.data.discountPrice)
          pintuan_detail.forEach((el, index) => {
            waitCollageEffectiveTime.push(el.waitCollageEffectiveTime)
          })
          // pintuan_detail = ("timearr", that.data.arr)

          // console.log("waitCollageEffectiveTime", waitCollageEffectiveTime)
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
            console.log(el.collageLuckRedBag)
            that.setData({
              redbag: el.collageLuckRedBag
            })
            priceArr.push(el.collagePrice / 100)
          })
          price_list.forEach((el, index) => {
            price_alone.push(el.price / 100)
          })
          price_list.forEach((el, index) => {
            saleArr.push(el.collageSaleNum)
          })
          price_list.forEach((el, index) => {
            good_id.push(el.productId)
          })
          price_list.forEach((el, index) => {
            commission_num.push(el.collageLuckRedBag)
          })
          price_list.forEach((el, index) => {
            collageInProvinceFreight_num.push(el.collageInProvinceFreight)
          })
          console.log(res.data.data)
          // console.log(year)
          // console.log(produceTimes)
          var goodname = res.data.data.product.title
          var shareGoodImg = res.data.data.productMainImageList["0"].path
          var shangpinId = res.data.data.product.id
          var pintuanlist = res.data.data.collagingOrderList.length
          if (pintuanlist < 2) {
            that.setData({
              display_multiple_items: 1
            })
          }
          that.setData({

            own_buy_top_data: res.data.data.product,//拼团顶部的数据
            pintuan_data: res.data.data.productSkuList,//sku数据
            imgUrls: res.data.data.productMainImageList,//商品轮播图
            good_detailsssss: res.data.data.productDetailImageList,//商品参数
            years: year,
            price: priceArr,//拼团价
            price_byone: price_alone,
            sale: saleArr,
            all_details: all_detail,
            pintuan_details: pintuan_detail,
            shopId: dianpuid,
            productId: good_id,
            commission: commission_num,
            collageInProvinceFreight: collageInProvinceFreight_num,
            daojishi: waitCollageEffectiveTime,
            goodimg: shareGoodImg,
            goodnames: goodname,
            shangpinIds: shangpinId,
            isLike: res.data.data.product.isLike,
            userBindPhone: res.data.data.userBindPhone
          })
          console.log("price_byone", that.data.price_byone)
        } else if (res.data.code == 403){
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          that.setData({
            isLogin: wx.getStorageSync('isLoginsChange')
          })
          wx.hideLoading()
        }else{
          wx.hideLoading()
          console.log(res)
          var errmsg = res.data.msg
          wx.showToast({
            title: errmsg,
            icon: "none"
          })
          if (that.data.share__enter == true) {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 800)
          }
        }
        // console.log("-----------------------pintuan_details",that.data.pintuan_details)
      }
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
    if (options.redbag){
      this.setData({
        redbag: options.redbag
      })
    }
    
    // console.log("options",options)
    //喜欢页面进来不保存shipID
    if (options.change == 1) {
      this.setData({
        change: true
      })
    }

    var op = options
    var msgg = JSON.stringify(op)
    that.setData({
      options: msgg
    })
    // console.log("接收商品id", options)
    //正常进入商品页的id
    if (options.id) {
      that.setData({
        goodid: options.id
      })
    }
    //再次购买进入的商品页的id
    if (options.productid) {
      that.setData({
        goodid: options.productid
      })
    }
    //分享进入的id
    if (options.shangpin) {
      that.setData({
        goodid: options.shangpin,
        share__enter: false
      })
      // that.get_good_data()
    }
    if (options.fenxiangzhe) {
      that.setData({
        shareUserId: options.fenxiangzhe
      })
      wx.setStorageSync("shareUserId", options.fenxiangzhe)
    }
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      if (scene.substring(0, 2) == "2=") {
        var productId = scene.substring(2);
        // console.log("我进来了")
        that.setData({
          goodid: productId,
          share__enter: false
        })
      }
      if (scene.substring(0, 3) == "12=") {
        var productId = scene.substring(3);
        // console.log("我进来了")
        wx.setStorageSync("userShareProductId", productId)
        that.setData({
          userShareProductId: productId,
          share__enter: false
        })
      }
    }

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
    // console.log(wx.getStorageSync('isLoginsChange'))
    if (wx.getStorageSync('jwtToken') == '') {
      console.log("kong")
      that.setData({
        isLogin: ''
      })

      var i = setInterval(function () {
        that.setData({
          testNum: that.data.testNum++
        })
        var _token = wx.getStorageSync('jwtToken')
        if (_token) {
          that.setData({
            token: _token
          })
          clearInterval(i);

          that.get_good_data()
        }
      }, 1000)
    } else if (that.data.good_detailsssss == '') {
      that.get_good_data()
      console.log("you")
    }
    console.log("that.data.code",that.data.code)
    if (that.data.code == 0 || that.data.code == ""){  
      let count_time = setTimeout(function () {
        that.counttime()
      }, 500)
      setInterval(function () {    
        that.counttime()
      }, 1000)
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

    var that = this
    var userids = wx.getStorageSync("userId")
    that.setData({
      userid: userids,
    })
    if (res.from === 'button') {
      let target_id = res.target.id;
      var text = "";
      if (that.data.redbag > 0) {
        text = '我推荐红包商品#'
      } else {
        text = '我推荐商品#'
      }
      if (target_id == "2") {
        return {
          title: text + that.data.goodnames + '#给您！',
          path: '/pages/group_booking/group_booking?shangpin=' + that.data.shangpinIds + "&shangpu=" + that.data.shopId + "&fenxiangzhe=" + that.data.userid + "&redbag=" + that.data.redbag,
          imageUrl: that.data.goodimg.replace("_tiny", "_large"),

          success: function (res) {
            // 转发成功
            wx.showToast({
              title: '转发成功！',
              icon: 'success'
            })
            // console.log("转发成功:" + JSON.stringify(res));
          },
          fail: function (res) {
            // 转发失败
           // console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
    }
  },
  collageUserList:function(){
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../collageUserList/collageUserList?productId=' + that.data.productId,
    })
  },
  goRedEnvelopes: function () {
    var that = this;
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../../pageA/pages/get_luckMoney/get_luckMoney',
    })
  }
})