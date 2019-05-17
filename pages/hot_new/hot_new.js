// pages/hot_new/hot_new.js
import config from "../../utils/config.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getDataType:0,//0为新品 1为爆款
    currentTab: 0,
    page:0,
    direction: "asc", //asc为顺序 desc为倒序
    last: false,
    top:false,
    index_middle_list:[],
    share_commission:true,
    good_poster_hidden: true,
    redbag: 0,
    choose:0,
    property: "",//空为综合 price为价格
    good_posters:"",
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
          isbindphone: true,
          share_commission:true
        })
        that.get_hot_new_data()
      },
    })
  },
  //点击切换
  clickTab: function (e) {
    console.log("clickTab", e)
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
    // 清空数组再请求其他茶类的数据
    var goodList = that.data.index_middle_list;
    goodList.splice(0, goodList.length);
    that.setData({
      goodList: goodList,
      last: false
    })
    if (e.currentTarget.dataset.idx == 0){
      if (that.data.property == ""){
        that.setData({
          property:"price",
          top: false
        })
      }else{
        that.setData({
          property: "", 
          top: false
        })
      }
      that.get_hot_new_data()
    }
    if (e.currentTarget.dataset.idx == 1){
      if (that.data.direction == "asc") {
        that.setData({
          direction: "desc",
          property: "price",
          top: true
        })
      } else if (that.data.direction == "desc") {
        that.setData({
          direction: "asc",
          property: "price",
          top: false
        })
      }
      that.get_hot_new_data()
    }
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
        console.log("==============res", res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {

            console.log("保存图片到本地", res)

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
            console.log("============================失败的原因", res)
            if (res.errMsg == "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
              console.log("打开设置窗口");
              wx.hideLoading()
              wx.showToast({
                title: '保存失败，请授权保存相册权限',
                icon: 'none',
                duration: 1500
              })
              setTimeout(function () {
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      console.log("获取权限成功，再次点击图片保存到相册")
                    } else {
                      console.log("获取权限失败")
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
              console.log('===============储存图片授权成功', res)
            },
            fail(res) {
              console.log('===============储存图片授权失败', res)
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
      title: '正在生成二维码',
      icon: "loading"
    })
    that.setData({
      close_shop_share: false
    })
    wx.hideLoading()
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
              console.log('===============储存图片授权成功', res)
            },
            fail(res) {
              console.log('===============储存图片授权失败', res)
              wx.showToast({
                title: '拒绝授予权限将无法进行相关权限！',
                icon: 'none'
              })
            }
          })
        }
      }
    })
    if (that.data.choose == 0) {
      that.setData({
        share_type: 0
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
          'content-type': 'application/json', // GEt的请求方式为默认 
          Authorization: that.data.token
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.code != 0) {
            wx.hideLoading()
            console.log(res)
            var errmsg = res.data.msg
            wx.showToast({
              title: errmsg,
              icon: "none"
            })
          }
          console.log("拿回分享商品的海报", res)
          var good_posters = res.data.data.userShareProduct.poster

          that.setData({
            good_poster_hidden: false,
            good_poster: good_posters
          })

        }
      })
      return
    }
    if (that.data.choose != 0) {
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
          'content-type': 'application/json', // GEt的请求方式为默认 
          Authorization: that.data.token
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.code != 0) {
            wx.hideLoading()
            console.log("111")
            var errmsg = res.data.msg
            wx.showToast({
              title: errmsg,
              icon: "none"
            })
          }
          console.log("拿回分享商品的海报", res)
          var good_posters = res.data.data.userShareProduct.poster
          wx.downloadFile({
            url: good_posters,
            success: function (res) {
              console.log("图片的详细信息", res)
              that.setData({
                saveGoogimgPath: res.tempFilePath
              })

            }
          })
          that.setData({
            good_poster_hidden: false,
            good_poster: good_posters
          })
        }
      })
    }

  },
  goRedEnvelopes: function () {
    var that = this;
    console.log("that.data.userBindPhone", that.data.userBindPhone)
    if (that.data.userBindPhone == null || that.data.userBindPhone == "") {
      that.setData({
        isbindphone: false
      })
      return
    }
    wx.navigateTo({
      url: '../../pageA/pages/get_luckMoney/get_luckMoney',
    })
  },
  close_share_commission: function () {
    var that = this;
    that.setData({
      share_commission: true,
      good_poster_hidden: true
    })
  },
  get_hot_new_data:function(){
    var that = this;
    var url = "";
    if (that.data.getDataType == 0){
      url = config.news
    }else{
      url = config.hot
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.promise({
      url: url,
      datas: {
        shopId: wx.getStorageSync('shop_id'),
        page: that.data.page,
        direction: that.data.direction,
        property: that.data.property
      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
      then((res) => {
        console.log("Hot&New", res)
        if (res.data.code == 0) {
          wx.hideLoading()
          if (res.data.data.pages.last == true) {
            that.setData({
              last: false
            })
          }
          var teaContent = that.data.index_middle_list;
          var dataTeaContent = teaContent.concat(res.data.data.pages.content)
          that.setData({
            index_middle_list: dataTeaContent,
            userBindPhone:res.data.data.userBindPhone
          })
          console.log("index_middle_list",that.data.index_middle_list)
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
  to_good_detail: function (e) {


    if (e.currentTarget.dataset.sign == 0) {
      wx.navigateTo({
        url: '../own_buy/own_buy?id=' + e.currentTarget.dataset.goodid + "&redbag=" + e.currentTarget.dataset.redbag
      })
    } else {

      wx.navigateTo({
        url: '../group_booking/group_booking?id=' + e.currentTarget.dataset.goodid + "&redbag=" + e.currentTarget.dataset.redbag
      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    if (options.sign == "news" ){
      wx.setNavigationBarTitle({
        title: '新品推荐',
      })
      that.setData({
        getDataType:0
      })
    } else if (options.sign == "hot") {
      wx.setNavigationBarTitle({
        title: '热销爆款',
      })
      that.setData({
        getDataType: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.get_hot_new_data()
    that.setData({
      token: wx.getStorageSync('jwtToken')
    })
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
    var that = this
    that.setData({
      page: 0
    })
    wx.showNavigationBarLoading();
    // 清空数组再请求其他茶类的数据
    var teaContents = that.data.index_middle_list
    teaContents.splice(0, teaContents.length)
    that.setData({
      index_middle_list: teaContents,
      direction: "asc",
      top:false
    })
    setTimeout(function(){
      that.get_hot_new_data();
    },500)
    wx.hideNavigationBarLoading();
    let time = setTimeout(function () {
      wx.stopPullDownRefresh()
      clearTimeout(time);
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.last) {
      wx.showToast({
        title: '再滑也没有啦',
        icon: 'none'
      })

      return false

    }
    that.setData({
      page: that.data.page + 1
    })
    wx.showLoading({
      title: '正在获取更多动态信息~',
      icon: 'loading',
      duration: 1500
    })
    that.get_hot_new_data()
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    var that = this
    var usernickname = wx.getStorageSync('userNickName')
    var userids = wx.getStorageSync('userId')
    that.setData({
      userid: userids,
      yonghuming: usernickname
    })

    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      let target_id = res.target.id;
      if (target_id == "2") {
        var text = "";
        if (that.data.redbag > 0) {
          text = '我推荐红包商品#'
        } else {
          text = '我推荐商品#'
        }
        if (that.data.choose == 0) {
          console.log("我是单买的")

          return {
            title: text + that.data.goodnames + '#给您！',
            path: '/pages/own_buy/own_buy?shangpin=' + that.data.shangpinIds + "&shangpu=" + that.data.shopId + "&fenxiangzhe=" + that.data.userid + "&redbag=" + that.data.redbag,
            imageUrl: that.data.goodimg.replace("_tiny", "_large"),

            success: function (res) {
              // 转发成功
              wx.showToast({
                title: '转发成功！',
                icon: 'success'
              })
              console.log("转发成功:" + JSON.stringify(res));
            },
            fail: function (res) {
              // 转发失败
              console.log("转发失败:" + JSON.stringify(res));
            }
          }

        } else if (that.data.choose != 0) {
          console.log("我是单买的")
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
              console.log("转发成功:" + JSON.stringify(res));
            },
            fail: function (res) {
              // 转发失败
              console.log("转发失败:" + JSON.stringify(res));
            }
          }

        }

      }
    }
  },
  fenxiangyongjin: function (e) {
    var that = this
    that.setData({
      choose: e.currentTarget.dataset.sign,
      goodimg: e.currentTarget.dataset.shangpintu,
      shangpinIds: e.currentTarget.dataset.shangpinid,
      goodnames: e.currentTarget.dataset.goodname,
      shopId: e.currentTarget.dataset.dianpiid,
      commission: e.currentTarget.dataset.commission,
      share_commission: false,
      redbag: e.currentTarget.dataset.redbag
    })

  },
})