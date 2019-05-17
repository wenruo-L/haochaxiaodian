
const utils = require("util.js")
function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}

function requestLoading(url, params, message, success, fail) {
  utils.get_uid()
  wx.getStorage({
    key: 'login_Uid',//取出token
    success: (res) => {
      var jtoken = res.data.token
      console.log("-----合法token:\n" + res.data.token)
      wx.showNavigationBarLoading()
      if (message != "") {
        wx.showLoading({
          title: message,
        })
      }
      wx.request({
        url: url,
        data: params,
        header: {
          //'Content-Type': 'application/json'
          // 'content-type': 'application/x-www-form-urlencoded'
          'authorization': jtoken
        },
        method: 'GET',
        success: function (res) {
          console.log("服务器返回 -> code值:" + res.data.code + " -> msg提示：" + res.data.msg + " -> data数据：->\n" + res.data.data)
          wx.hideNavigationBarLoading()
          if (message != "") {
            wx.hideLoading()
          }
          if (res.statusCode == 200) {
            success(res.data)
          } else {
            fail()
          }
        },
        fail: function (res) {
          wx.hideNavigationBarLoading()
          if (message != "") {
            wx.hideLoading()
          }
          fail()
        },
        complete: function (res) { },
      }) 
    },
    fail: function (res) {
      //wx.hideNavigationBarLoading()
      console.log("token不存在" )
    }
  })
}

module.exports = {
  request: request,
  requestLoading: requestLoading,
}