// pageA/pages/getLuckyMoneySuccess/getLuckyMoneySuccess.js
import config from "../../../utils/config.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  bestluck:"",
  profit:"",
  token:"",
  collage:"0",
  winHeight:"",
  header:"",
  goodimg: "",
  shangpu: "",
  goodnames: "",
  shangpinIds: "",
  good_poster:"",
  productId:"",
  orderId:"",
  fenxiangdianpu: true,
  close_shop_share: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {

        that.setData({
          winwidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
    console.log("==========options",options)
    if (options.profit){
      that.setData({
        profit: options.profit,
        bestluck: options.bestluck
      })
    }
    if (options.productId){
      that.setData({
        productId: options.productId,
        collage: options.collage,
        orderId: options.orderId
      })
    }
  },
  cleanLucky: function (res) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.promise({
      url: config.order_getredbag,
      datas: {
        orderId: that.data.orderId
      },
      method: 'GET',
      contentType: 'application/json',
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        wx.hideLoading()
        if (res.data.code == 0) {
        } else if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../../../pages/welcome/welcome',
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
      })
      .catch((res) => {
        console.log(res)
      })
  },
  getLuckySuccess: function (res) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.promise({
      url: config.order_share,
      datas: {
        productId: that.data.productId
      },
      method: 'GET',
      contentType: 'application/json',
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {       
        if (res.data.code == 0) {
          wx.hideLoading()
          app.code=0;//红包领取成功
          var goodimg = res.data.data.product.productImageSub.path
          var shangpu = res.data.data.product.shopId
          var goodnames = res.data.data.product.title
          var shangpinIds = res.data.data.product.id
          var userHeader = res.data.data.user.logo
          that.setData({
            header:userHeader,
            goodimg: goodimg,
            shangpu: shangpu,
            goodnames: goodnames,
            shangpinIds: shangpinIds
          })
        } else if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../../../pages/welcome/welcome',
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
      })
      .catch((res) => {
        console.log(res)
      })
  },
  close_share_shop: function () {
    var that = this;
    that.setData({
      fenxiangdianpu: true,
      close_shop_share: true
    })
  },
  open_mask:function(){
    var that = this
    that.setData({
      fenxiangdianpu:false
    })
  },
  close_share_shop: function () {
    var that = this;
    that.setData({
      fenxiangdianpu: true,
      close_shop_share: true
    })
  },
  turnBack:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  to_get_luckMoney:function(){
    app.code=1
    wx.navigateTo({
      url: '../get_luckMoney/get_luckMoney',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  to_strategy:function(){
    wx.redirectTo({
      url: '../strategy/strategy',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.getLuckySuccess()
    that.cleanLucky()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
    var userids = wx.getStorageSync('userId')
    that.setData({
      userid: userids,
    })



    if (res.from === 'button') {

  
        if (that.data.collage == 0) {
          // console.log("我是单买的")
          return {
            title: '我推荐' + that.data.goodnames + '给您！',
            path: '/pages/own_buy/own_buy?shangpin=' + that.data.shangpinIds + "&shangpu=" + that.data.shopId + "&fenxiangzhe=" + that.data.userid,
            imageUrl: that.data.goodimg.replace("_tiny", "_large"),

            success: function (res) {
              // 转发成功
              wx.showToast({
                title: '转发成功！',
                icon: 'success'
              })

            },
            fail: function (res) {

            }
          }

        } else if (that.data.collage != 0) {
          
          return {
            title: '我推荐' + that.data.goodnames + '给您！',
            path: '/pages/group_booking/group_booking?shangpin=' + that.data.shangpinIds + "&shangpu=" + that.data.shopId + "&fenxiangzhe=" + that.data.userid,
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
  // 点击保存图片！
  clickKeepimage: function () {
    var that = this;
    // console.log("that.data.good_poster", that.data.good_poster)
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
  showShareShopWithFriends: function () {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              // console.log('===============储存图片授权成功', res)
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
    wx.showLoading({
      title: '加载中.....',
      mask:true
    })
    that.setData({
      close_shop_share: false
    })
   
    if (that.data.collage==2){
      that.setData({
        collage:1
      })
    }
      wx.request({
        url: config.shop_poster,
        method: 'GET',
        data: {
          productId: that.data.productId,
          type: that.data.collage
        },
        header: {
          'content-type': 'application/json', // GEt的请求方式为默认 
          Authorization: wx.getStorageSync('jwtToken')
        },
        success: function (res) {
          wx.hideLoading()
          // console.log(1111)
          // console.log("haipao",res)
          var good_poster=res.data.data.userShareProduct.poster 
          that.setData({
            good_poster: good_poster
          })
          // console.log("that.data.good_poster", that.data.good_poster)
        }
      })
  },
})