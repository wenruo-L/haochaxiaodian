var moment = require('../lib/moment-with-locales');
var Base64 = require('../lib/js-base64/we-base64');
var app = getApp();
import config from "config.js"


function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
} 

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const gettimeofhour = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}
// 判断用户是否拥有店铺id，没有会跳去搜索首页页面
function noLoginSkipToMind() {
  var that = this;
  if (!that.data.shop_id_obj) {
    wx.showToast({
      title: '点击登陆按钮才可以进行后续操作哦~',
      icon: 'none',
      duration: 1500,
      mask: true,
      success() {
        setTimeout(() => {
          wx.redirectTo({
            url: '../mind/mind',
          })
        }, 800)
      }
    })
  } else {
    return
  }
}
// =========================================
      // {
      //   "selectedIconPath": "common/image/index_img/fast_order.png",
      //   "iconPath": "common/image/index_img/order.png",
      //   "pagePath": "pages/fast_order/fast_order",
      //   "text": "下单"
      // },
// =========================================

// post请求格式转化
function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}
function get_token(){
  var that = this
  let app = getApp();
  // wx.getSetting({
  //   success(res){
  //     console.log("=============author",res)
  //     if (!res.authSetting["scope.userInfo"]){
  //       wx.showToast({
  //         title: '请授权获取您的名字信息~',
  //         icon: 'none',
  //         duration: 1500
  //       })
  //       setTimeout(function () {
  //         wx.openSetting({
  //           success(settingdata) {
  //             console.log(settingdata)
  //             if (settingdata.authSetting["scope.userInfo"]) {
                  
  //             } else {
  //               console.log("获取权限失败")
  //             }
  //           }
  //         })
  //       }, 1000)
  //     }
  //   }
  // })
  wx.login({
    success: res => {
      var _code = res.code
      if (res.code) {
        wx.request({
          url: config.get3rdsession,
          method: 'GET',
          data: {
            code: _code
          },
          header: {
            'content-type': 'application/json' // GEt的请求方式为默认 
            // 'Authorization': 'jwttoken'
          },
          success: function (e) {
            var backstage = e.data.code
            // app.globalData.back_stage_code = backstage;
            var _thirdSession = e.data.data.thirdSession
            wx.setStorageSync("local_session", e.data.data.thirdSession)
            if (backstage == 0) {
              wx.getUserInfo({
                success: function (res) {
                  var _encryptedData = res.encryptedData
                  var _iv = res.iv
                  wx.request({
                    url: config.get_token_id,
                    method: 'POST',
                    data: {
                      sessionId: _thirdSession,
                      encryptedData: _encryptedData,
                      iv: _iv
                    },
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded' // POST的请求方式不一样 
                      // 'Authorization': 'jwttoken'
                    },
                    success: function (res) {
                      // console.log(res)
                      if (res.data.code == 0) {
                        // console.log('能否拿到jwtToken  ' + res.data.data.jwtToken)
                        // console.log('能否拿到userId    ' + res.data.data.userId)
                        var _jwtToken = res.data.data.jwtToken
                        var _userId = res.data.data.userId
                        // app.globalData.back_stage_token = _jwtToken;
                        // app.globalData.back_stage_userid = _userId;
                        // console.log(app.globalData.back_stage_userid)
                        wx.setStorageSync('token', res.data.data.jwtToken)//存在本地的token
                        // console.log("-------------111 save toke")
                        // console.log(_jwtToken)
                        wx.setStorageSync('uid', res.data.data.userId)//存在本地的用户id
                        wx.setStorageSync('nickname', res.data.data.userNickName)//存在本地的用户名
                        // wx.hideLoading()
                      }

                      // var obj = {}
                      // obj = {
                      //   "token": _jwtToken,
                      //   "id": _userId
                      // }

                      // wx.setStorage({
                      //   key: "login_Uid",
                      //   data: obj
                      // })
                    },
                    fail: function (res) {

                    }
                  })
                }
              })

            }
          }
        })
      } else {

      }
    }
  })
}
//获取后台返回的session
function myLogin(successFn) {
  let appp = getApp();
  wx.login({

    success(res) {
      successFn(code, res);
      var code = res.code;
      wx.request({
        url: config.get3rdsession,
        method: 'GET',
        data: {
          code: code
        },
        header:{
          'content-type': 'application/json' // GEt的请求方式为默认 
        },
        success:function(res){
          // console.log(res)
         
        if (appp.globalData.back_stage_session && appp.globalData.back_stage_session.length != 0) {return }else{
            // console.log("1111")
            var thirdSession = res.data.data.thirdSession
            // console.log(res.data.data.thirdSession)
            wx.setStorageSync("3rdsession", res.data.data.thirdSession)//保存至本地
            appp.globalData.back_stage_session =res.data.data.thirdSession;//将session更新至全局变量
          }
        }
      })
      wx.getUserInfo({
        withCredentials: true,
        success(res) {
          successFn(code, res);

        }
      })
    },
    fail() {
      wx.showToast({
        title: '登陆失败',
        icon: "none",
        duration: 2000
      })
    }
  })
}
function get_ueriv(){
  let appp = getApp();
  wx.getUserInfo({
    success: function (res) {
      // console.log('能否拿到encryptedData' + res.encryptedData)
      // console.log('能否拿到iv ' + res.iv)
      var _encryptedData = res.encryptedData
      var _iv = res.iv
      wx.setStorageSync("encryptedData", res.encryptedData)
      wx.setStorageSync("iiiiv", res.iv)
    }
  })
}
// 获取用户权限
function get_author(myScope){
  wx.getSetting({
    success(res){
      if (!res.authSetting[myScope]){
        wx.authorize({
          scope: myScope,
          success(res){
            return
          },
          fail(res){
            wx.showModal({
              title: "获取授权",
              content: "请授权，否则相关功能将不可用！",
              showCancel: false,
              success(res) {
                console.log("在警告框确认后弹出openSetting");
                wx.openSetting({
                  success(res) {
                    console.log("用户在opensSetting的授权结果", res);
                    if (res.scope == true) {
                      console.log("用户在opensSetting授权");
                      callBack();
                    } else {
                      console.log("用户在opensSetting未授权")
                    }
                  }
                })
              },
              fail() {
                console.log("未授权，关闭showModal");
              }
            })
          }
        })
      }
    }
  })
}
function getAuthor(myScope, callBack = function () { console.log("哈哈哈！") }) {
  wx.getSetting({
    success(res) {
      // console.log("进入获取用户权限列表", res.authSetting);
      if (!res.authSetting[myScope]) { //没有获取权限
        // console.log("没有获取权限记录，即将调用wx.authorize", myScope);
        wx.authorize({
          scope: myScope,
          success(res) {
            // console.log("通过author获取用户权限成功！", res);
            callBack();
          },
          fail(res) {
            // console.log("没有通过author权限，调出警告！", res)
            wx.showModal({
              title: "获取授权",
              content: "请授权，否则相关功能将不可用！",
              showCancel: false,
              success(res) {
                // console.log(res)
                if (!res.confirm) {
                  return
                };
                console.log("在警告框确认后弹出openSetting");
                wx.openSetting({
                  success(res) {
                    console.log("用户在opensSetting的授权结果", res);
                    if (res.scope == true) {
                      console.log("用户在opensSetting授权");
                      callBack();
                    } else {
                      console.log("用户在opensSetting未授权")
                    }
                  }
                })
              },
              fail() {
                console.log("未授权，关闭showModal");
              }
            })
          }
        })
      } else { //在getSetting中发现已经授权
        console.log("之前已经授权了");
        callBack();
      }
    }
  })
}
//reques请求成功回调函数
// function mySucFn(res, callBack = function (res) { }) {
//   if (res.data.done) {
//     console.log(res)
//     callBack(res);
    
//   } else {
//     try {
//       wx.showToast({
//         title: res.data.error.message,
//         icon: 'none', // loading
//         duration: 2500,
//         mask: true
//       })
//     } catch (e) {
//       wx.showToast({
//         title: e.toString(),
//         icon: 'none', // loading
//         duration: 2500,
//         mask: true
//       })
//     }
//   }
// }
//request的fail回调
function myFailFn() {
  wx.showToast({
    title: '网络错误',
    icon: 'none', // loading
    duration: 1500,
    mask: true
  })
}
function formatTimes(date, formatType) {
  moment.locale('zh_cn');
  formatType = typeof formatType == 'string' ? formatType : 'YYYY年MM月DD日 ';
  var res = moment(date).format(formatType);
  //console.log(res);
  return res;
}
function fromNow(date) {
  moment.locale('zh_cn');
  return moment(date).fromNow();
}
module.exports = {
  formatTime: formatTime,
  myLogin: myLogin,
  getAuthor: getAuthor,
  // mySucFn: mySucFn,
  myFailFn: myFailFn,
  get_ueriv: get_ueriv,
  get_token: get_token,
  gettimeofhour: gettimeofhour,
  get_author: get_author,
  formatTimes: formatTimes,
  fromNow: fromNow,
  Base64: Base64
}


