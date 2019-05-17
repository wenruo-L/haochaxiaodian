// pages/sreach/sreach.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight:0,
    search_list:[],
    search_result:""
  },
  get_keyWord:function(e){
    var that = this;
    console.log(e)
    that.setData({
      search_result:e.currentTarget.dataset.keyword
    })
    that.to_search_result()
  },
  to_search_result:function(e){
    console.log("==============",e)
    var that = this ;
    if (that.data.search_result != " "){
      var search_list = that.data.search_list;
      if (search_list.includes(that.data.search_result) == false) {
        search_list.push(that.data.search_result)
      }
      app.search_record = search_list;
      wx.redirectTo({
        url: '../search_result/search_result?keyWord=' + that.data.search_result,
      })
    }else{
      wx.showToast({
        title: '请输入关键词',
        icon: 'none',
      })
    }
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  clear_record:function(){
    var that = this;
    var search_list = that.data.search_list;
    search_list.splice(0, search_list.length)
    app.search_record = search_list;
    that.setData({
      search_list: search_list
    })
  },
  search_result:function(e){
    var that = this;
    console.log("失去焦点",e)

  },
  sreach_value:function(e){
    console.log('获取内容', e)
    var that = this;
    var search_result = e.detail.value
    that.setData({
      search_result: search_result
    })
    console.log("that.data.search_result",that.data.search_result)
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      search_list:app.search_record
    })
    console.log("onshow_search_record", app.search_record)
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