// pages/order_detail_pintuan/order_detail_pintuan.js
import config from "../../utils/config.js"
import utils from "../../utils/util.js"
let app = getApp();
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    id: "",
    token: "",
    input_value: 1,
    danmai_fen: null,//单品价格分单位
    zongji: null,//总计价格分单位
    yunfei: null,
    kashishijian: "", //下单时间
    daojishi: "", //待付款的有效时间
    array: [{ name: '我不想买了', value: '1' }, { name: '信息填写错误，重新拍', value: '2' }, { name: '卖家缺货', value: '3' }, { name: '同城见面交易', value: '4' }, { name: '其他原因', value: '5' }],
    diandanid: "",
    danmai_detail: "",
    timer: "",
    // 分享所需参数
    shangpinIds: "",
    goodimg: "",
    shopId: "",
    userid: "",
    realPay:"",
   // 分享所需参数
    state: 0,//判断页面从哪个状态进来
    orderState: 0,//判断页面返回后请求哪种状态的数据
    // 待分享的参数
    productId: "",
    productSkuId: "",
    payPrice: "",
    collageId: ""
  },
  // 复制按钮
  copy_num: function (e) {
    var that = this;
    var copy_the_nums = that.data.id
    wx.setClipboardData({
      data: copy_the_nums,
      success: function (e) {

        if (e.errMsg == "setClipboardData:ok") {
          wx.getClipboardData({
            success: function (e) {

              wx.showToast({
                title: '复制成功！'
              })
            }
          })

        }
      }
    })
  },
  // 取消订单的 取消 触发状况
  cancelTheCancel: function (e) {
    var that = this;

    wx.showToast({
      title: '我知道你手滑了',
    })
  },
  // 取消订单 按钮
  bindPickerChange: function (e) {
    var that = this;
    let goodsValue = that.data.array[e.detail.value];

    that.setData({
      index: e.detail.value,
      main_class: goodsValue['name']
    })

    wx.showToast({
      title: '正在取消订单~',
    })

    wx.request({
      url: config.cancel_order,
      method: 'POST',
      data: {
        id: that.data.diandanid,
        reason: that.data.main_class
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function (e) {
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
        wx.showToast({
          title: '取消成功！',
        })
        wx.redirectTo({
          url: '../all_order/all_order',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  // 联系门店
  to_contact_shop: function (e) {

    wx.redirectTo({
      url: '../contact_shop/contact_shop?shopid=' + e.currentTarget.dataset.shopid,
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
// 立即支付
  sub_at_once: function () {
    var that = this;
    wx.showLoading({
      title: '正在调起付款接口',
      mask: true,
    })
    wx.request({
      url: config.pay_immediately,
      method: 'POST',
      data: {
        id: that.data.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
        Authorization: that.data.token
      },
      success: function (res) {

        if (res.data.code != 0) {
          wx.hideLoading()

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

            if (e.errMsg == "requestPayment:ok") {
              wx.hideLoading()
              wx.redirectTo({
                url: '../pay_success/pay_success',
              })
            }
          },
          fail: function (e) {

            if (e.errMsg == "requestPayment:fail cancel") {
              wx.hideLoading()
              wx.redirectTo({
                url: '../all_order/all_order',
              })
            } else {
              wx.hideLoading()
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
  //查看物流
  check_wuliu: function (e) {
    wx.navigateTo({
      url: '../order_detail_chakanwuliu/order_detail_chakanwuliu?id=' + e.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 再次购买
  buy_again: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.sign == 0){
      wx.redirectTo({
        url: '../own_buy/own_buy?productid=' + e.currentTarget.dataset.productid,
      })
    }else{
      wx.redirectTo({
        url: '../group_booking/group_booking?productid=' + e.currentTarget.dataset.productid,
      })
    }
  },
  // 确认收货
  ensure_shouhuo: function (res) {
    var that = this;
    var id = res.currentTarget.dataset.id
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      showCancel: true,
      success: function (res) {
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
            success: function (res) {
              wx.hideLoading()

              if (res.data.code == 0) {
                wx.showToast({
                  title: '确认收货成功！',
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../all_order/all_order',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }, 500)
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
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 删除订单
  delete_order: function (res) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除订单',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: config.delete_order,
            method: 'POST',
            data: {
              id: that.data.id,

            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
              Authorization: that.data.token
            },
            success: function (res) {

              if (res.data.code == 0) {
                wx.showToast({
                  title: '删除成功！',
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../all_order/all_order',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }, 500)
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
  //待付款的倒计时
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  // 倒计时处理
  counttime: function () {
    var that = this;
    var starttime = that.data.kashishijian;
    var validtime = that.data.daojishi;
    var timestamp = new Date().getTime();
    var finaltime = []
    finaltime = Number(starttime) + Number(validtime * 1000)


    let obj = null;
    if (finaltime - timestamp > 0) {
      let time = parseInt((finaltime - timestamp) / 1000)

      let hours = parseInt(time / 3600);
      let mins = parseInt((time - (hours * 3600)) / 60);
      let secs = parseInt(time - (hours * 3600) - (mins * 60));
      that.setData({
        hours: this.timeFormat(hours),
        mins: this.timeFormat(mins),
        secs: this.timeFormat(secs),
        timer: time
      })

    } else {
      that.setData({
        hours: "00",
        mins: "00",
        secs: "00"
      })

    }


  },
  // 获取订单详情的数据
  get_pintuan_order_detail: function () {
    var that = this;
    var _token = wx.getStorageSync('jwtToken')
    that.setData({
      token: _token
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.order_detail,
      method: 'GET',
      data: {
        id: that.data.id
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: that.data.token
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        // 当状态失效时，用户返回特定的页面
        if (res.data.code != 0) {
          app.reflashOrderPages = 1;
          if (that.data.state == 0) {
            app.reflashOrderState = ''
            console.log("返回全部")
          } else {
            app.reflashOrderState = that.data.orderState
            console.log("返回特定状态")
          }
          wx.hideLoading()
          console.log(res)
          var errmsg = res.data.msg
          wx.showToast({
            title: errmsg,
            icon: "none"
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
        } else{
          // 进去页面时的状态和后台返回的状态不一致时，用户返回特定的页面
          if (that.data.orderState != res.data.data.order.state){
            app.reflashOrderPages = 1;
            if (that.data.state == 0) {
              app.reflashOrderState = ''
              console.log("返回全部")
            } else {
              app.reflashOrderState = that.data.orderState
              console.log("返回特定状态")
            }
          }
        }
        that.setData({
          all_data: res.data.data,
          danmai_detail: res.data.data.order,
          input_value: res.data.data.order.buyNum,
          yunfei: res.data.data.order.freight,
          realPay: res.data.data.order.realPay
        })
        // 待付款
        if (res.data.data.order.state == 0){
          var orderTimearr = []
          var ordertime = res.data.data.order.orderTime
          orderTimearr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          // console.log("下单时间",orderTimearr)
          var waitPayEffectiveTime = res.data.data.order.waitPayEffectiveTime
          console.log("下单时间", ordertime)
          console.log("倒计时", waitPayEffectiveTime)
          var orderId = res.data.data.order.id
          var danmai_fendanwei = res.data.data.order.orderSnapshotList
          var fen_arr = []
          danmai_fendanwei.forEach((el, index) => {
            fen_arr.push(el.payPrice)
          })
          that.setData({
            xiadanshijian: orderTimearr,
            daojishi: waitPayEffectiveTime,
            kashishijian: ordertime,
            diandanid: orderId,
            danmai_fen: fen_arr,
          })
        }
        // 待分享
        else if (res.data.data.order.state == 1){
          var orderTimearr = []
          var ordertime = res.data.data.order.orderTime
          orderTimearr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          var payTimearr = []
          var paytime = res.data.data.order.payTime
          payTimearr.push(utils.formatTime(paytime / 1000, 'Y/M/D h:m:s'))
          var waitCollageEffectiveTime = res.data.data.order.waitCollageEffectiveTime
          var paytimes = res.data.data.order.payTime
          var goodname = res.data.data.order.orderSnapshotList[0].title
          // var shangpinId = res.data.data.order.id
          var shangpinId = res.data.data.order.orderSnapshotList[0].productId
          var shareGoodImg = res.data.data.order.productImageSub.path
          var dianpuid = res.data.data.order.shopSub.id
          var danmai_fendanwei = res.data.data.order.orderSnapshotList
          var fen_arr = []
          danmai_fendanwei.forEach((el, index) => {
            fen_arr.push(el.payPrice)
          })
          var m = res.data.data.collagingUserList.slice(1);
          // 去拼团页面的四个参数
          var productId = res.data.data.order.orderSnapshotList["0"].productId
          var productSkuId = res.data.data.order.orderSnapshotList["0"].productSkuId
          var payPrice = res.data.data.order.orderSnapshotList["0"].payPrice
          var collageId = res.data.data.order.collageId
          that.setData({
            xiadanshijian: orderTimearr,
            daojishi: waitCollageEffectiveTime,
            fukuanshijian: payTimearr,
            kashishijian: paytimes,
            goodnames: goodname,
            shangpinIds: shangpinId,
            goodimg: shareGoodImg,
            shopId: dianpuid,
            pinzhuHeader2: res.data.data.collagingUserList,
            joinHeader: m.slice(0, 2),
            danmai_fen: fen_arr,
            productId: productId,
            productSkuId: productSkuId,
            payPrice: payPrice,
            collageId: collageId
          })
        }
        // 待自提
        else if (res.data.data.order.state == 2){
          var orderTimearr = []
          var ordertime = res.data.data.order.orderTime
          orderTimearr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          var payTimearr = []
          var paytime = res.data.data.order.payTime
          payTimearr.push(utils.formatTime(paytime / 1000, 'Y/M/D h:m:s'))
          var waitGetMyselfEffectiveTime = res.data.data.order.waitGetMyselfEffectiveTime
          var danmai_fendanwei = res.data.data.order.orderSnapshotList
          var fen_arr = []
          danmai_fendanwei.forEach((el, index) => {
            fen_arr.push(el.payPrice)
          })
          that.setData({
            xiadanshijian: orderTimearr,
            fukuanshijian: payTimearr,
            daojishi: waitGetMyselfEffectiveTime,
            kashishijian: ordertime,
            danmai_fen: fen_arr
          })
        }
        // 待发货
        else if (res.data.data.order.state == 3){
          var orderTimearr = []
          var ordertime = res.data.data.order.orderTime
          orderTimearr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          var payTimearr = []
          var paytime = res.data.data.order.payTime
          payTimearr.push(utils.formatTime(paytime / 1000, 'Y/M/D h:m:s'))
          var waitDeliveryEffectiveTime = res.data.data.order.waitDeliveryEffectiveTime
          var danmai_fendanwei = res.data.data.order.orderSnapshotList
          var fen_arr = []
          danmai_fendanwei.forEach((el, index) => {
            fen_arr.push(el.payPrice)
          })
          that.setData({
            xiadanshijian: orderTimearr,
            fukuanshijian: payTimearr,
            daojishi: waitDeliveryEffectiveTime,
            kashishijian: paytime,
            danmai_fen: fen_arr,
          })
        }
        // 已发货
        else if (res.data.data.order.state == 4){
          var orderTimearr = []
          var ordertime = res.data.data.order.orderTime
          orderTimearr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          var payTimearr = []
          var paytime = res.data.data.order.payTime
          payTimearr.push(utils.formatTime(paytime / 1000, 'Y/M/D h:m:s'))
          var deliverytimearr = []
          var deliverytime = res.data.data.order.deliveryTime
          deliverytimearr.push(utils.formatTime(deliverytime / 1000, 'Y/M/D h:m:s'))
          var danmai_fendanwei = res.data.data.order.orderSnapshotList
          var fen_arr = []
          danmai_fendanwei.forEach((el, index) => {
            fen_arr.push(el.payPrice)
          })
          that.setData({
            xiadanshijian: orderTimearr,
            fukuanshijian: payTimearr,
            fahuoshijian: deliverytimearr,
            danmai_fen: fen_arr,
          })
        }
        // 已完成
        else if (res.data.data.order.state == 5){
          var orderTimearr = []
          var ordertime = res.data.data.order.orderTime
          orderTimearr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          var payTimearr = []
          var paytime = res.data.data.order.payTime
          payTimearr.push(utils.formatTime(paytime / 1000, 'Y/M/D h:m:s'))
          var deliverytimearr = []
          var deliverytime = res.data.data.order.deliveryTime
          deliverytimearr.push(utils.formatTime(deliverytime / 1000, 'Y/M/D h:m:s'))
          var signingtimearr = []
          var signingtime = res.data.data.order.signingTime
          signingtimearr.push(utils.formatTime(signingtime / 1000, 'Y/M/D h:m:s'))
          var danmai_fendanwei = res.data.data.order.orderSnapshotList
          var fen_arr = []
          danmai_fendanwei.forEach((el, index) => {
            fen_arr.push(el.payPrice)
          })
          that.setData({
            xiadanshijian: orderTimearr,
            fukuanshijian: payTimearr,
            fahuoshijian: deliverytimearr,
            qianshoushijian: signingtimearr,
            danmai_fen: fen_arr,
          })
        }
        // 已取消
        else if (res.data.data.order.state == 6){
          var orderTimearr = []
          var ordertime = res.data.data.order.orderTime
          orderTimearr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          var updatetimearr = []
          var updatetime = res.data.data.order.cancelTime
          updatetimearr.push(utils.formatTime(updatetime / 1000, 'Y/M/D h:m:s'))
          var danmai_fendanwei = res.data.data.order.orderSnapshotList
          var fen_arr = []
          danmai_fendanwei.forEach((el, index) => {
            fen_arr.push(el.payPrice)
          })
          that.setData({
            xiadanshijian: orderTimearr,
            pintuanshibai: updatetimearr,
            danmai_fen: fen_arr,
          })
        }
        // 未成团 （拼团失败）||已退款
        else if (res.data.data.order.state == 7 || res.data.data.order.state == 8){
          var orderTimearr = []
          var ordertime = res.data.data.order.orderTime
          orderTimearr.push(utils.formatTime(ordertime / 1000, 'Y/M/D h:m:s'))
          var refundtimearr = []
          var refundtime = res.data.data.order.refundTime
          refundtimearr.push(utils.formatTime(refundtime / 1000, 'Y/M/D h:m:s'))
          var payTimearr = []
          var paytime = res.data.data.order.payTime
          payTimearr.push(utils.formatTime(paytime / 1000, 'Y/M/D h:m:s'))
          var danmai_fendanwei = res.data.data.order.orderSnapshotList
          var fen_arr = []
          danmai_fendanwei.forEach((el, index) => {
            fen_arr.push(el.payPrice)
          })
          that.setData({
            xiadanshijian: orderTimearr,
            pintuanshibai: refundtimearr,
            fukuanshijian: payTimearr,
            danmai_fen: fen_arr,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      state: options.state,
      orderState: options.sign
    })
    // orderState为页面过来时带来的订单状态
    console.log("options.state", options.state)
    console.log("options.orderState", options.sign)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.get_pintuan_order_detail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    setInterval(that.counttime, 1000)
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
    var userids = wx.getStorageSync('uid')
    that.setData({
      userid: userids,
    })

    if (res.from === 'button') {
      if (res.target.id == "1") {
        return {
          title: '我已发起拼团' + "#" + that.data.goodnames + "#",
          path: '/pages/share_pages/share_pages?shangpin=' + that.data.shangpinIds + "&shangpu=" + that.data.shopId + "&productSkuId=" + that.data.productSkuId + "&payPrice=" + that.data.payPrice + "&collageId=" + that.data.collageId,
          imageUrl: that.data.goodimg.replace("_tiny", "_large"),
          success: function (res) {
            // 转发成功
            wx.showToast({
              title: '转发成功！',
              icon: 'success'
            })

          },
          fail: function (res) {
            // 转发失败

          }
        }
      }
      if (res.target.id == "2") {
        return {
          title: '我已发起拼团' + "#" + that.data.goodnames + "#",
          path: '/pages/share_pages/share_pages?shangpin=' + that.data.shangpinIds + "&shangpu=" + that.data.shopId + "&productSkuId=" + that.data.productSkuId + "&payPrice=" + that.data.payPrice + "&collageId=" + that.data.collageId,
          imageUrl: that.data.goodimg.replace("_tiny", "_large"),

          success: function (res) {
            // 转发成功
            wx.showToast({
              title: '转发成功！',
              icon: 'success'
            })

          },
          fail: function (res) {
            // 转发失败

          }
        }
      }

    }

  }
})