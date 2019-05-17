// pages/ruzhu/ruzhu.js
import config from "../../utils/config.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    userName: undefined,//用户名
    userPhone: undefined,//用户号码
    region: ['', '', ''],//地址
    _latitude:"",//用户经纬度
    _longitude:"",
    multiIndex: [0, 0, 0],
    array: [],
    array2: [{ name: '100元以下', value: '1' }, { name: '100~300元', value: '2' }, { name: '300~500元', value: '3' }],
    array3: [{ name: '1~50平米', value: '1' }, { name: '50~100平米', value: '2' }, { name: '100~200平米', value: '3' }, { name: '200~400平米', value: '4' }, { name: '400~1000平米', value: '5' }],
    multiArray: [[{ name: '', value: "5" }, { name: '工厂 ', value: "1" }, { name: '批发市场 ', value: "2" }], [{ name: '', value: "5" }, { name: '自产 ', value: "3" }, { name: '朋友 ', value: "4" }], [{ name: '', value: "5" }, { name: '其他 ', value: "5" }]],
    main_class:"",//主营品类
    kedanjia:"",//客单价
    shoparea:"",//店铺面积
    nowPurchaseChannel: "",//进货渠道
    stock: "",//进货渠道id
    province:"",
    city:"",
    area:"",
    _address:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  get_tealist() {
    wx.getStorage({
      key: 'login_Uid',
      success: (res) =>{
        
        var jtoken = res.data.token
       
        wx.request({
          url: 'https://lp.apit.haocha.top/category/list',
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'Authorization': jtoken
          },
          success: (e) => {
           
            var pinlei_list = e.data.data.list;
           
            var _array = []
            pinlei_list.forEach((el) => {
              _array.push(el)
           
              this.setData({
                array: _array
              })
            });
          }
        })
      }
    })
  },

  get_tealist:function(){
    var that = this;
    var _token = wx.getStorageSync('token')
    that.setData({
      token: _token
    })
    wx.request({
      url: config.ruzhu_good_list,
      method: 'GET',
    
      header: {
        'content-type': 'application/json',
        'Authorization': that.data.token
      },
      success: function(e){
      
        var pinlei_list = e.data.data.list;
        
        var _array = []
        pinlei_list.forEach((el) => {
          _array.push(el)
         
          that.setData({
            array: _array
          })
        });
      }
    })
  },
  updata:function(){
    var that = this;
    var _token = wx.getStorageSync('token')
    that.setData({
      token: _token
    })
    wx.request({
      url: config.shop_join,
      method: 'POST',
      data: {
        categoryIds: that.data.main_class,
        contactName: that.data.userName,
        contactPhone: that.data.userPhone,
        longitude: that.data._longitude,
        latitude: that.data._latitude,
        province: that.data.province,
        city: that.data.city,
        area: that.data.area,
        address: that.data._address,
        unitPrice: that.data.kedanjia,
        shopAcreage: that.data.shoparea,
        nowPurchaseChannel: that.data.stock
      },

      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': that.data.token
      },
      success: function(e){
       
        wx.showToast({
          title: '申请已提交！',
          icon: 'none',
          duration: 1500,
          mask: true,
          success() {
            setTimeout(() => {
              wx.redirectTo({
                url: '../search_index/search_index',
              })
            }, 800)
          }
        })
      }
    })
  },
  // 地址
 
  bindRegionChange: function (e) {
   
    this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2]
    })
    let _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude1 = res.latitude
        var longitude2 = res.longitude
        _this.setData({
          _latitude:res.latitude,
          _longitude:res.longitude
        })
       }
    })
  },
  // 主营品类
  bindPickerChange: function (e) {
    let goodsValue = this.data.array[e.detail.value];
    this.setData({
      index: e.detail.value,
      main_class: goodsValue['id']
    })
  },
  // 客单价
  bindPickerChange2: function (e) {
    let tmp = this.data.array2[e.detail.value];
    this.setData({
      index2: e.detail.value,
      kedanjia: tmp['value']
    })
  },

  // 店铺面积
  bindPickerChange3: function (e) {
    let tmp1 = this.data.array3[e.detail.value]; 
    this.setData({
      index3: e.detail.value,
      shoparea: tmp1['value']
    })
  },
  // 进货渠道
  bindMultiPickerChange: function (e) {
    let tmpArrValue = [],//提交给后台的value
      tmpArrName = []
    e.detail.value.forEach((ele, index) => {
      tmpArrValue.push(this.data.multiArray[index][ele]["value"])
      tmpArrName.push(this.data.multiArray[index][ele]["name"])
    })
    this.setData({
      multiIndex: e.detail.value,
      nowPurchaseChannel: tmpArrName.join(" ").toString(),
      stock: tmpArrValue
    })
  },
  //获取用户名
  userNinput:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  //获取用户电话
  userPinput: function(e){
    this.setData({
      userPhone: e.detail.value
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  var that = this;
  that.get_tealist()
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
  onShareAppMessage: function () {

  }
})