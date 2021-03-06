// pages/add_new_address/add_new_address.js
import config from "../../utils/config.js"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {



    userName: undefined,//用户名
    userPhone: undefined,//用户号码
    // region: ['', '', ''],//地址
    region: [],//地址
    address_detail: undefined,//详细地址
    token:"",
    province: "",
    city: "",
    area: "",
    showplaceholder:false,
    showAddressDetail:true,
    amendAddID:"",
    sign:true,
    value: [0, 0, 0],
    choose_city:true,
    winHeight:0,
    testProvince:null,
    testcity:null,
    testArea: null,
   allCity:null,

  
  },
  get_city:function(){
   
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    app.promise({
      url: config.choose_city,
      datas: {

      },
      method: 'GET',
      contentType: "application/json",
      token: wx.getStorageSync('jwtToken')
    }).
    then((res)=>{
     
      if (res.data.code == 0){
        
        // console.log(res.data.data)
        that.setData({
          allCity: res.data.data,
          testcity: res.data.data[0].list,//设置默认
          
        })    
        wx.hideLoading()
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
    })
  },
  clear:function(){
    var province = this.data.province
    var city = this.data.city
    var area = this.data.area
    this.setData({
      province: province,
      city: city,
      area: area,
      showAddressDetail:true,
      choose_city:true

    })
  },
  open_choose:function(){
    var that = this
    that.setData({
      choose_city:false
    })
  },
  close_choose: function () { 
    var that = this
    that.setData({
      choose_city: true
    })
  },
  YES:function(){
    var that = this;
    var time=setTimeout(function(){
      that.setData({
        showAddressDetail: false,
        choose_city: true
      })


      if (that.data.val == undefined) {
        var val = [0, 0, 0]
        that.setData({
          province: that.data.allCity[val[0]].name
        })

        if (that.data.allCity[val[0]].list != undefined) {
          that.setData({
            city: that.data.allCity[val[0]].list[val[1]].name
          })
        } else {
          that.setData({
            city: ''
          })
        }

        if (that.data.allCity[val[0]].list[val[1]].list != undefined) {

          that.setData({
            area: that.data.allCity[val[0]].list[val[1]].list[val[2]]
          })
        } else {
          that.setData({
            area: ''
          })
        }
      } else {
        var val = that.data.val
        // console.log(this.data.allCity[val[0]].list[val[1]].list[val[2]])
        that.setData({
          province: that.data.allCity[val[0]].name
        })

        if (that.data.allCity[val[0]].list != undefined) {
          that.setData({
            city: that.data.allCity[val[0]].list[val[1]].name
          })
        } else {
          that.setData({
            city: ''
          })
        }
        if (that.data.allCity[val[0]].list[val[1]].list != undefined) {

          that.setData({
            area: that.data.allCity[val[0]].list[val[1]].list[val[2]]
          })
        } else {
          that.setData({
            area: ''
          })
        }
      }
      clearTimeout(time)
    },500)
  },
  bindChange: function (e) {
    // console.log(e)
    // console.log(e.detail.value)
    var that = this
    var val = e.detail.value
    that.setData({
      val : e.detail.value,
      // isChange:true
    })
    // console.log(that.data.showAddressDetail)
    // console.log(that.data.allCity[val[0]].name)
    
    // that.setData({
    //   province: that.data.allCity[val[0]].name
    // })
    
    if (that.data.allCity[val[0]].list != undefined){
      that.setData({
        testcity: that.data.allCity[val[0]].list,
        // city: that.data.allCity[val[0]].list[val[1]].name
      })
      
      // console.log(that.data.allCity[val[0]].list[val[1]].name)
    }else{
      // testcity:null
      that.setData({
        testcity: null,
        // city: ''
      })
    }

    

    if (that.data.allCity[val[0]].list[val[1]].list !=undefined){
      // console.log(that.data.allCity[val[0]].list[val[1]].list[val[2]])
      that.setData({
        // area: that.data.allCity[val[0]].list[val[1]].list[val[2]],
        testArea: that.data.allCity[val[0]].list[val[1]].list
      })
      
      // console.log(that.data.allCity[val[0]].list[val[1]].list)

    }else{
      that.setData({
        // area:'',
        testArea: null
      })
    }

  },
  // 获取用户收货地址
  getuserAssress:function(){
    wx.chooseAddress({
      success:function(res){
        
      }
    })
  },
  get_address: function () {
    var that = this;
    var _token = wx.getStorageSync('jwtToken')
    var shop_id = app.shop_id
    that.setData({
      token: _token,
    })
    wx.showLoading({
      title: '加载中',
    })
    // 拿拼好茶的数据
    wx.request({
      url: config.take_good_address,
      method: 'GET',
      data: {
        id: that.data.amendAddID
      },
      header: {
        'content-type': 'application/json',// GEt的请求方式为默认 
        Authorization: wx.getStorageSync('jwtToken')
      },
      success: function (res) {
        if (res.data.code == 403) {
          wx.setStorageSync('isLoginsChange', '')
          wx.setStorageSync('jwtToken', '')
          wx.navigateTo({
            url: '../welcome/welcome',
          })
          wx.hideLoading()
        } else if (res.data.code != 0){
          wx.hideLoading()
          var errmsg = res.data.msg
          wx.showToast({
            title: errmsg,
            icon: 'none',
          })
        }
        wx.hideLoading()
        
        // console.log("收货地址编辑",res)
        that.setData({
          userName:res.data.data.receiptAddress.name,
          userPhone: res.data.data.receiptAddress.phone,
          address_detail: res.data.data.receiptAddress.street,
          province: res.data.data.receiptAddress.province,
          city: res.data.data.receiptAddress.city,
          area: res.data.data.receiptAddress.area,
          showAddressDetail: false,
          region: [res.data.data.receiptAddress.province, res.data.data.receiptAddress.city, res.data.data.receiptAddress.area]
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("看看我们能拿到什么",options)

    if (options.name && options.phone && options.id){
      this.setData({
        userName: options.name,
        userPhone: options.phone,
        amendAddID: options.id
      })
    }
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        // console.log("==================res", res)
        that.setData({
          winHeight: res.windowHeight
        });
      }
    })
  },
  bindRegionChange: function (e) {
    // console.log(e.detail)
    // console.log(e.detail.value[0])
    // console.log(e.detail.value[1])
    // console.log(e.detail.value[2])
    // console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
      showplaceholder: true,
      showAddressDetail: false
    })
  },
  //获取用户名
  userNinput: function (e) {
    // console.log(this)
    // console.log(e.detail.value)
    this.setData({
      userName: e.detail.value
    })
  },
  //获取用户电话
  userPinput: function (e) {
    // console.log(e.detail.value)
    // console.log(this)
    this.setData({
      userPhone: e.detail.value
    })
  },
  // 获取用户的详细地址
  useradinput: function (e) {
    // console.log(e)
    // console.log(e.detail.value)
    // console.log(this)
    this.setData({
      address_detail: e.detail.value
    })
    // console.log(this.data.useraddress_detail)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  get_token:function(){
    var that = this;
    var _token = wx.getStorageSync('jwtToken')
    that.setData({
      token: _token
    })
  },
 




 
  onReady: function () {
    var that =this

    that.get_token()
    if (that.data.amendAddID){
      that.get_city()
      that.get_address()
      return
    }
    
  },
  update_address:function(e){
    // console.log(e)
    var that = this;
    // console.log(that.data.region)
    if (that.data.userName == " " || that.data.userName == undefined ){
      wx.showToast({
        title: '您还没有输入您的名字~',
        icon:'none'
      })
      // console.log("不让过啊兄呆")
      return
    }
    // if (that.data.userName == " ") {
    //   wx.showToast({
    //     title: '您还没有输入您的名字~',
    //     icon: 'none'
    //   })
    //   console.log("不让过啊兄呆")
    //   return
    // }
    if (that.data.userPhone == "" || that.data.userPhone == undefined) {
      wx.showToast({
        title: '您还没有输入您的电话~',
        icon: 'none'
      })
      
      return
    } 
    if (that.data.userPhone.length < 11 ) {
      wx.showToast({
        title: '请输入正确的手机号码~',
        icon: 'none'
      })
    
      return
    }
    if (that.data.province == "") {
      wx.showToast({
        title: '请选择您的省',
        icon: 'none'
      })
      
      return
    }
    if (that.data.city == "") {
      wx.showToast({
        title: '请选择您的市',
        icon: 'none'
      })
     
      return
    }
    if (that.data.address_detail == "" || that.data.address_detail == undefined) {
      wx.showToast({
        title: '请输入您的详细地址~',
        icon: 'none'
      })
      
      return
    } else{
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      wx.request({
        url: config.add_amend_address,
        method: "POST",
        data: {
          id: that.data.amendAddID,
          name: that.data.userName,
          phone: that.data.userPhone,
          province: that.data.province,
          city: that.data.city,
          area: that.data.area,
          street: that.data.address_detail,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded', // POST的请求方式不一样 
          'Authorization': wx.getStorageSync('jwtToken')
        },
        success: function (res) {
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
          wx.hideLoading()
          wx.showToast({
            title: '编辑成功！',
            icon: 'none',
            duration: 1500,
            mask: true,
            success() {
              // console.log("111")
              setTimeout(() => {
                  wx.navigateBack({
                    delta: 1,
                  })
              }, 800)
            }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that =this
    that.get_city()
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
  
  }
})