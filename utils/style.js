const utils = require("util.js")
import config from "config.js"
import test from "test.js"
const app=getApp()

function userInfo(e){
  // console.log(test.get("a"))
  if (e.detail.errMsg == "getUserInfo:ok") {
    // console.log(app.updateTime)
    var thirdSession
    if (wx.getStorageSync("thirdSession") == '') {
      thirdSession = app.thirdSession
    } else {
      thirdSession = wx.getStorageSync("thirdSession")
    }
    
    // console.log("getStorageSync::style::", wx.getStorageSync("thirdSession"))
    // console.log("app::style::::", app.thirdSession)
    wx.getStorage({
      key: 'thirdSessionTest',
      success: function(res) {
        console.log('1：getStorage>style>',res.data)
        login(res.data, e)
      },
      fail:function(err){
        console.log(err)
        // login(session, e)
        wx.getStorage({
          key: 'thirdSessionTest',
          success: function (res) {
            console.log('2：getStorage>style>', res.data)
            login(res.data, e)
          }
          
        })
        
      }
    })
    wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl)
    
  }else{
    
    console.log("取消登录:" + wx.getStorageSync('isLogin'))
   
  }
  

};
function login(session,e){
 
  wx.request({
    url: config.get_token_id,
    method: 'POST',
    data: {
      sessionId: session,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      updateTime:app.updateTime
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'

    },
    success: function (data) {
      console.log(data)

      if (data.data.code == 0) {
        app.isLoginChange = true


        wx.setStorageSync('jwtToken', data.data.data.jwtToken)
        wx.setStorageSync('userId', data.data.data.userId)
       
        wx.setStorageSync('userNickName', data.data.data.userNickName)
        wx.setStorageSync('isLoginsChange', true)


      }  else {

        wx.showModal({
          title: '提示',
          content: 'code:' + data.data.code + ',' + data.data.msg
        })

      }

    },
    fail: (err) => {
      wx.showModal({
        title: '提示',
        content: '接口请求出错.'
      })
    }
  })
}
function setTabItem(shop_id) {
    if (shop_id =="1138850301499932672"){
      wx.setTabBarItem({
        index: 2,
        text: " 中秋专场",
        selectedIconPath: 'common/image/index_img/activityAc.png',
        iconPath: "common/image/index_img/activity.png"
      })
    }else{
      wx.setTabBarItem({
        index: 2,
        text: " 拼好茶",
        selectedIconPath: 'common/image/index_img/haocha_selectd.png',
        iconPath: "common/image/index_img/haocha_select.png"
      })
    }
  
};

module.exports = {
  userInfo: userInfo,
  setTabItem: setTabItem

}
