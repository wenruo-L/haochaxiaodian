// pages/sreach_result/sreach_result.js
const app = getApp()
import config from "../../utils/config.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    currentTab: 0,
    last: false,
    keyWord: "",
    top:false,
    page: 0,
    direction: "asc", //asc为顺序 desc为倒序
    last: false,
    top: false,
    index_middle_list: [],
    share_commission: true,
    good_poster_hidden: true,
    redbag: 0,
    choose: 0,
    search_list:[],
    property: "",//空为综合 price为价格
    good_posters: "",
    isNew: 0, //是否新品(0=否 1=是)
    isHot: 0,  //是否热销(0=否 1=是)
  },
  alreadySearch:function(){
    var that = this;
    var search_list = app.search_record;
    console.log("b", app.search_list)
    if (search_list.includes(that.data.keyWord) == false) {
      search_list.push(that.data.keyWord)
    }
    app.search_record = search_list;
    console.log("a", app.search_record)
    // 清空数组再请求其他茶类的数据
    var goodList = that.data.index_middle_list;
    goodList.splice(0, goodList.length);
    that.setData({
      index_middle_list: goodList,
      last: false,
      page: 0
    })
    that.goodLise_data()
  },
  search_result: function (e) {
    var that = this;
    console.log("失去焦点", e)
    if (e.detail.value == " ") {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none',
      })
      return
    } else {
      that.setData({
        keyWord:res.detail.value
      })
    }
  },
  binderror: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.goodList;
    console.log("list", list)
    list[index].cover = "../../common/image/img_default.png"
    this.setData({
      goodList: list
    })
  },

  to_goods_detail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: "../goods_detail/goods_detail?commodityId=" + e.currentTarget.dataset.id,
    })
  },

  search_result: function(e) {
    var that = this;
    console.log("失去焦点", e)
    var search_item = e.detail.value
    if (e.detail.value == " ") {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none',
      })
      return
    } else {
      that.setData({
        keyWord: search_item
      })
    }
  },
  //点击切换
  clickTab: function(e) {
    console.log("clickTab", e)
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
    // 清空数组再请求其他茶类的数据
    var goodList = that.data.index_middle_list;
    goodList.splice(0, goodList.length);
    that.setData({
      index_middle_list: goodList,
      last:false,
      page:0
    })
    if (e.currentTarget.dataset.idx == 0) {
      that.setData({
        property:"",
      })
      that.goodLise_data()
    } else if (e.currentTarget.dataset.idx == 1) {
      that.setData({
        isNew:1,
        isHot: 0,
        direction: "asc",
      })
      that.goodLise_data()
    } else if (e.currentTarget.dataset.idx == 2) {
      that.setData({
        isNew: 0,
        isHot:1,
        direction: "asc",
      })
      that.goodLise_data()
    } else {
      if (that.data.direction == "asc") {
        that.setData({
          direction: "desc",
          property:"price",
          isNew: 0,
          isHot: 0,
          top: true
        })
      } else if (that.data.direction == "desc") {
        that.setData({
          direction: "asc",
          property: "price",
          isNew: 0,
          isHot: 0,
          top: false
        })
      }
      that.goodLise_data()
    }
    
  },
  goodLise_data: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.promise({
      url: config.search,
      datas: {
        shopId: wx.getStorageSync('shop_id'),
        keyword: that.data.keyWord,
        isNew: that.data.isNew,
        isHot: that.data.isHot,
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
          if (res.data.data.pages.last == true){
            that.setData({
              last:false
            })
          }
          var teaContent = that.data.index_middle_list;
          var dataTeaContent = teaContent.concat(res.data.data.pages.content)
          that.setData({
            index_middle_list: dataTeaContent
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log("搜索结果参数",options)
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
    if (options.keyWord){
      that.setData({
        keyWord: options.keyWord,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    that.goodLise_data()
    that.setData({
      token: wx.getStorageSync('jwtToken')
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    var that = this
    that.setData({
      yeshu: 0,
      page:0
    })
    wx.showNavigationBarLoading();
    // 清空数组再请求其他茶类的数据
    var teaContents = that.data.index_middle_list
    teaContents.splice(0, teaContents.length)
    that.setData({
      index_middle_list: teaContents
    })
    that.goodLise_data();
    wx.hideNavigationBarLoading();
    let time = setTimeout(function () {
      wx.stopPullDownRefresh()
      clearTimeout(time);
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
    that.goodLise_data()
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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