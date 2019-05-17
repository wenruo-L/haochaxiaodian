// pages/text/text.js
import config from "../../utils/config.js";
const app = getApp()
Page({
  data: {
    navbar: ['全部', '待付款', '待分享', '待发货', '待自提', '已发货', '已完成', '未成团', '已退款'],
    // tab切换  
    currentTab: 0,
    token: "",
    state: " ",
    main_class: null,
    yeshu: 0,
    last: false,
    all_detail_datas: "",
    array: [{
      name: '我不想买了',
      value: '1'
    }, {
      name: '信息填写错误，重新拍',
      value: '2'
    }, {
      name: '卖家缺货',
      value: '3'
    }, {
      name: '同城见面交易',
      value: '4'
    }, {
      name: '其他原因',
      value: '5'
    }],
    index: ""
  },
  // 选项卡切换
  navbarTap: function(e) {
    var that = this

    if (e.currentTarget.dataset.idx == 0) {
      that.setData({
        state: " ",
        yeshu: 0
      })
      that.get_allorder_data()
    }
    if (e.currentTarget.dataset.idx == 1) {
      that.setData({
        state: 0,
        yeshu: 0
      })
      that.get_allorder_data()
    }
    if (e.currentTarget.dataset.idx == 2) {
      that.setData({
        state: 1,
        yeshu: 0
      })
      that.get_allorder_data()
    }
    if (e.currentTarget.dataset.idx == 3) {
      that.setData({
        state: 3,
        yeshu: 0
      })
      that.get_allorder_data()
    }
    if (e.currentTarget.dataset.idx == 4) {
      that.setData({
        state: 2,
        yeshu: 0
      })
      that.get_allorder_data()
    }
    if (e.currentTarget.dataset.idx == 5) {
      that.setData({
        state: 4,
        yeshu: 0
      })
      that.get_allorder_data()
    }
    if (e.currentTarget.dataset.idx == 6) {
      that.setData({
        state: 5,
        yeshu: 0
      })
      that.get_allorder_data()
    }
    if (e.currentTarget.dataset.idx == 7) {
      that.setData({
        state: 7,
        yeshu: 0
      })
      that.get_allorder_data()
    }
    if (e.currentTarget.dataset.idx == 8) {
      that.setData({
        state: 8,
        yeshu: 0
      })
      that.get_allorder_data()
    }
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
    })

  },
  // 取消订单的 取消 触发状况
  cancelTheCancel: function(e) {
    var that = this;

    wx.showToast({
      title: '我知道你手滑了',
    })
  },
  // 取消订单 按钮
  bindPickerChange: function(e) {
    var that = this;

    let goodsValue = that.data.array[e.detail.value];

    that.setData({
      index: e.detail.value,
      main_class: goodsValue['name']
    })

    wx.showLoading({
      title: '正在取消',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    var id = e.currentTarget.dataset.id
    wx.request({
      url: config.cancel_order,
      method: 'POST',
      data: {
        id: id,
        reason: that.data.main_class
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function(e) {
        if (e.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
          wx.hideLoading()
        } else if (e.data.code != 0) {
          wx.hideLoading()
          var errmsg = e.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }
        wx.hideLoading()
        wx.showToast({
          title: '取消成功！',
        })
        that.get_allorder_data()
      }
    })
  },
  // 确认收货
  ensure_shouhuo: function(res) {
    var that = this;
    var id = res.currentTarget.dataset.id
    var index = res.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: config.ensure_shouhuo,
            method: 'POST',
            data: {
              id: id
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
              Authorization: that.data.token
            },
            success: function(res) {


              if (res.data.code == 0) {
                var list = that.data.all_detail_datas
                list.splice(index, 1);
                that.setData({
                  all_detail_datas: list
                })
                wx.showToast({
                  title: '确认收货成功！',
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
            }
          })
        }
      },
    })
  },
  // 删除订单
  delete_order: function(res) {
    var that = this;
    var id = res.currentTarget.dataset.id
    var index = res.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否确认删除订单',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: config.delete_order,
            method: 'POST',
            data: {
              id: id
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
              Authorization: that.data.token
            },
            success: function(res) {

              if (res.data.code == 0) {


                var list = that.data.all_detail_datas
                list.splice(index, 1);
                that.setData({
                  all_detail_datas: list
                })
                wx.showToast({
                  title: '删除成功！',
                  icon: "success"
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
            }
          })
        }
      },
    })

  },
  // 再次购买 
  buy_again: function(e) {
    if (e.currentTarget.dataset.mark == 0) {
      wx.redirectTo({
        url: '../own_buy/own_buy?productid=' + e.currentTarget.dataset.productid,
      })
    }
    if (e.currentTarget.dataset.mark != 0) {
      wx.redirectTo({
        url: '../group_booking/group_booking?productid=' + e.currentTarget.dataset.productid,
      })
    }
  },
  // 联系门店
  to_contact_shop: function(e) {

    wx.redirectTo({
      url: '../contact_shop/contact_shop?shopid=' + e.currentTarget.dataset.shopid,
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 取消订单
  cancel_order: function(res) {
    var id = res.currentTarget.dataset.id
    var that = this;
    wx.request({
      url: config.cancel_order,
      method: 'POST',
      data: {
        id: id,
        reason: ""
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function(res) {

        if (res.data.code == 0) {
          wx.showToast({
            title: '正在取消',
            icon: 'loading',
            mask: true,
            success: function() {
              setTimeout(function() {
                wx.showToast({
                  title: '取消成功！',
                  icon: 'success'
                })
                wx.hideToast()
              }, 500)
            }
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
      }
    })
  },
  // 立即付款
  sub_at_once: function(e) {

    var id = e.currentTarget.dataset.id
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: config.pay_immediately,
      method: 'POST',
      data: {
        id: id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function(res) {
        // wx.hideLoading()
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
          success: function(e) {

            if (e.errMsg == "requestPayment:ok") {
              wx.hideLoading()
              wx.showToast({
                title: '支付成功！',
              })
              wx.reLaunch({
                url: '../pay_success/pay_success',
              })
            }
          },
          fail: function(e) {

            wx.hideLoading()
            if (e.errMsg == "requestPayment:fail cancel") {
              wx.showToast({
                title: '您取消了支付',
              })
              wx.redirectTo({
                url: '../all_order/all_order',
              })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '支付失败(｡•́︿•̀｡)',
              })
              var err_msg = e.err_desc;


              wx.setStorageSync('failmsg', err_msg)
              wx.navigateTo({
                url: '../pay_fail/pay_fail',
              })
            }
          }
        })
      }
    })
  },

  to_order_detail_danmai: function(e) {
    var that = this
    console.log("跳转详情的点击事件", e)
    console.log("that.data.currentTab", that.data.currentTab)
    wx.navigateTo({
      url: '../text_order_detail/text_order_detail?id=' + e.currentTarget.dataset.id + "&state=" + that.data.currentTab + "&sign=" + e.currentTarget.dataset.sign
    })

  },
  // 查看物流
  to_order_detail_chakanwuliu: function(e) {
    wx.navigateTo({
      url: '../order_detail_chakanwuliu/order_detail_chakanwuliu?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 获取全部订单的数据
  get_allorder_data: function() {
    var that = this;
    var _token = wx.getStorageSync('jwtToken')
    that.setData({
      token: _token,
    })
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading',
      duration: 1500
    })


    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: config.all_order,
      method: 'GET',
      data: {
        state: that.data.state,
        page: that.data.yeshu,
        size: 10
      },
      header: {
        'content-type': 'application/json', // GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function(e) {
        console.log("全部订单状态的数据", e)
        if (e.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
          wx.hideLoading()
        } else if (e.data.code != 0) {
          wx.hideLoading()
          var errmsg = e.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }
        wx.hideLoading()
        var all_detail_data = e.data.data.pages.content //全部的订单数据
        var daifukuan_arr = [] //-待付款的订单详情

        var daifahuo_deteilArr = [] //待发货的订单详情

        var daifenxiang_arr = [] //待分享的订单详情  只有拼团

        var daiziti_deteilArr = [] //-待自提的订单详情

        var yifahuo_deteilArr = [] //-已发货的订单详情

        var yiwancheng_deteilArr = [] //-已完成的订单详情

        var yituikuan_deteilArr = [] //-已取消的订单详情

        var pintuanshibaiArr = [] //拼团失败的订单详情
        all_detail_data.forEach((el, index) => {
          // ===================待付款======================
          if (el.state == 0) {
            daifukuan_arr.push(el)
          }
          // ===================待付款======================
          //================== 待分享===================
          if (el.state == 1) {
            daifenxiang_arr.push(el)
          }
          // ====================待分享=========================
          // ===================待发货======================
          if (el.state == 3) {
            daifahuo_deteilArr.push(el)
          }
          // ===================待发货======================
          // ===================待自提======================
          if (el.state == 2) {
            daiziti_deteilArr.push(el)
          }
          // ===================待自提======================
          // ===================已发货======================
          if (el.state == 4) {
            yifahuo_deteilArr.push(el)
          }
          // ===================已发货======================
          // ===================已完成======================
          if (el.state == 5) {
            yiwancheng_deteilArr.push(el)
          }
          // ===================已完成======================
          // ===================拼团失败======================
          if (el.collageId != 0 && el.state == 7) {
            pintuanshibaiArr.push(el)
          }
          // ===================拼团失败======================
          // ===================已退款======================
          if (el.state == 8) {
            yituikuan_deteilArr.push(el)
          }
          // ===================已退款======================
        })

        that.setData({
          last: e.data.data.pages.last,
          all_detail_datas: all_detail_data, //全数据！！！
          daifukuan: daifukuan_arr, //待付款
          daifenxiang: daifenxiang_arr, //待分享
          daifahuo: daifahuo_deteilArr, //待发货
          daiziti: daiziti_deteilArr, //待自提
          yifahuo: yifahuo_deteilArr, //已发货
          yiwancheng: yiwancheng_deteilArr, //已完成
          pintuanshibai: pintuanshibaiArr, //拼团失败
          yituikuan: yituikuan_deteilArr //已退款
        })

        wx.hideToast()
      },
      fail: function(e) {
        console.log(e)
      }
    })

  },
  onLoad: function(options) {

    var that = this;
    if (options.index) {
      var that = this;
      that.setData({
        currentTab: Number(options.index) + 1,
        state: options.index
      })
      that.get_allorder_data()
    }

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function(res) {
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
  onReady: function() {
    var that = this

    that.get_allorder_data()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    console.log("==========app.reflashOrderState", app.reflashOrderState)
    if (1 == app.reflashOrderPages) {
      app.reflashOrderPages = 0;
      console.log("==========app.reflashOrderState", app.reflashOrderState)
      that.setData({
        state: app.reflashOrderState
      })
      that.get_allorder_data()
    }
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
    wx.showNavigationBarLoading();
    that.setData({
      yeshu: 0
    })
    that.get_allorder_data();
    wx.hideNavigationBarLoading();
    let time = setTimeout(function() {
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
      return
    }
    var YeShu = that.data.yeshu;
    YeShu = Number(YeShu) + 1
    that.setData({
      yeshu: YeShu
    })
    wx.showLoading({
      title: '正在获取更多订单信息~',
      icon: 'loading',
      duration: 1500
    })
    that.get_new_allorder_data()
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    var userids = wx.getStorageSync("userId")
    that.setData({
      userid: userids,
    })
    console.log("点击分享", res)
    that.setData({
      productSkuId: res.target.dataset.index.orderSnapshotList["0"].productSkuId,
      payPrice: res.target.dataset.index.orderSnapshotList["0"].payPrice,
      collageId: res.target.dataset.index.collageId
    })
    if (res.from === 'button') {
      if (res.target.id == "1") {
        var goodnames = res.target.dataset.goodnames
        var shangpin = res.target.dataset.shangpin
        var goodimg = res.target.dataset.goodimg
        var shangpu = res.target.dataset.shangpu
        return {
          title: '我已发起拼团' + "#" + goodnames + "#",
          path: '/pages/share_pages/share_pages?shangpin=' + shangpin + "&shangpu=" + shangpu + "&productSkuId=" + that.data.productSkuId + "&payPrice=" + that.data.payPrice + "&collageId=" + that.data.collageId,
          imageUrl: goodimg.replace("_tiny", "_large"),

          // // title: '我推荐' + that.data.goodnames + '给您！',
          // title: '我推荐给您！',
          // // path: '/pages/group_booking/group_booking?datas=' + shareParams,
          // path: '/pages/own_buy/own_buy?shangpin=123abc&shangpu=011113&fenxiangzhe=ooooo',
          // // imageUrl: that.data.goodimg,
          // imageUrl: 'http://image.haocha.top/i1/poster/base/shop_share.png',

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
      if (res.target.id == "2") {
        var goodnames = res.target.dataset.goodnames
        var shangpin = res.target.dataset.shangpin
        var goodimg = res.target.dataset.goodimg
        var shangpu = res.target.dataset.shangpu
        return {
          title: '我已发起拼团' + "#" + goodnames + "#",
          path: '/pages/share_pages/share_pages?shangpin=' + shangpin + "&shangpu=" + shangpu + "&productSkuId=" + that.data.productSkuId + "&payPrice=" + that.data.payPrice + "&collageId=" + that.data.collageId,
          imageUrl: goodimg.replace("_tiny", "_large"),

          // // title: '我推荐' + that.data.goodnames + '给您！',
          // title: '我推荐给您！',
          // // path: '/pages/group_booking/group_booking?datas=' + shareParams,
          // path: '/pages/own_buy/own_buy?shangpin=123abc&shangpu=011113&fenxiangzhe=ooooo',
          // // imageUrl: that.data.goodimg,
          // imageUrl: 'http://image.haocha.top/i1/poster/base/shop_share.png',

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


    }
  },
  // 获取全部订单的数据
  get_new_allorder_data: function() {
    var that = this;
    var _token = wx.getStorageSync('jwtToken')
    that.setData({
      token: _token,
    })
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading',
      duration: 1500
    })

    wx.request({
      url: config.all_order,
      method: 'GET',
      data: {
        state: that.data.state,
        page: that.data.yeshu,
        size: 10
      },
      header: {
        'content-type': 'application/json', // GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function(e) {
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
        var new_all_detail_data = e.data.data.pages.content //下拉加载新的订单数据
        var all_detail_data = that.data.all_detail_datas //原有的数据详情

        new_all_detail_data.forEach((el, index, arr) => {
          all_detail_data.push(el)
        })

        that.setData({
          last: e.data.data.pages.last,
          all_detail_datas: all_detail_data, //全数据！！！
        })

        wx.hideToast()
      }
    })

  }
})