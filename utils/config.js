//测试环境地址
//host 提现最低30元
var domain_with_host = 'https://lp.api.haocha.top' //正式环境
// var domain_with_host = 'https://lp.apit.haocha.top' //测试环境
// var domain_with_host = 'http://localhost:80'
//host_user
var domain_with_host_user = domain_with_host+'/user'
//host_browse
var domain_with_host_browse = domain_with_host +'/browse'
//host_like
var domain_with_host_like = domain_with_host +'/like'
//host_shop
var domain_with_host_shop = domain_with_host +'/shop'
//host_product
var domain_with_host_product = domain_with_host +'/product'
//host_order
var domain_with_host_order = domain_with_host +'/order'

export default{
  // 店铺首页-商品分页
  shop_page: domain_with_host_shop +"/home/productpages",
  // 商品海报(分享商品)
  shop_poster: domain_with_host_user +"/share/product/poster",
  //授权获取session
  get3rdsession: domain_with_host +"/weixin/applet/get3rdsession",
  // 获取微信用户信息
  get_token_id: domain_with_host +"/weixin/applet/userinfo",
  // 附近的小店
  get_near_shop: domain_with_host_shop +"/near",
  // 店铺入驻
  shop_join: domain_with_host_shop+"/enter",
  // 商品类目 (公共)
  ruzhu_good_list: domain_with_host +"/category/list",
  // 店铺海报(分享店铺)
  share_shop_poster: domain_with_host_user+"/share/shop/poster",
  // 店铺首页
  shop: domain_with_host_shop+"/home",
  //门店地址
  shop_address: domain_with_host_shop + "/contact",
  // 商品类目
  goods_list:domain_with_host+"/list",
  // 拼好茶数据
  pinhaocha_data: domain_with_host_product +"/collage/pages",
  // 商品数据
  goods_detail: domain_with_host_product+"/",
  // 商品信息(单独购买|发起拼团 | 去拼团)
  good_info: domain_with_host_order +"/product",
  // 确认商品(下单-提交)
  confirm_an_order: domain_with_host_order + "/product/confirm",
  // 立即支付
  pay_immediately: domain_with_host_order + "/pay",
  // 创建订单(提交订单)
  create_order: domain_with_host_order + "/create",
  // 全部订单
  all_order: domain_with_host_order + "/pages",
  // 订单详情
  order_detail: domain_with_host_order + "/detail",
  // 物流详情
  logistics_detail: domain_with_host_order + "/detail/delivery",
  // 取消订单
  cancel_order: domain_with_host_order + "/cancel",
  // 删除订单
  delete_order: domain_with_host_order + "/delete",
  // 确认收货
  ensure_shouhuo: domain_with_host_order + "/signing",
  // 列表
  address_list: domain_with_host_user +"/receiptaddress/pages",
  // 收货地址
  take_good_address: domain_with_host_user + "/receiptaddress",
  // 设置默认地址
  set_default: domain_with_host_user + "/receiptaddress/setdefaultuse",
  // 删除地址
  delete_address: domain_with_host_user + "/receiptaddress/delete",
  // 添加|修改地址
  add_amend_address: domain_with_host_user + "/receiptaddress/edit",
  // 点赞店铺
  collect_shop: domain_with_host_like + "/shop",
  // 点赞商品
  collect_good: domain_with_host_like + "/product",
  // 用户的喜欢店铺(喜欢小店)
  user_like_shop: domain_with_host_like + "/user/shops",
  // 用户的喜欢商品(喜欢商品)
  user_like_good: domain_with_host_like + "/user/products",
  // 商品(扫码进入展示)
  show_good_scan: domain_with_host_product +"/show",
  // 店铺的浏览用户(粉丝浏览记录)
  fans_list_shop: domain_with_host_browse +"/shop/users",
  // 个人中心
  mind_content: domain_with_host_user +"/center",
  //浏览商品记录
  browse_the_goods: domain_with_host_browse + "/user/products",
  //浏览小店记录
  browse_the_shop: domain_with_host_browse + "/user/shops",
  //删除浏览店铺记录
  cancel_the_shop: domain_with_host_browse +"/cancelshop",
  //删除商品浏览记录
  cancel_the_goods: domain_with_host_browse+"/cancelproduct",
  // 省市区
  choose_city: domain_with_host +"/address",
  //获取所有拼团数据
  allCollage: domain_with_host_order +"/collaging/pages",
  //分享红包
  shareRedPacket:domain_with_host_user +"/order/profit/share/pages",
  //下单红包
  orderRedPacket: domain_with_host_user +"/order/profit/buy/pages",
  //我的收益(我的红包)
  luck_money: domain_with_host_user +"/profit/my",
  // 订单红包
  order_money: domain_with_host_order +"/redbag",
  // 订单商品-分享
  order_share: domain_with_host_order + "/productforshare",
  // 领取红包
  order_getredbag: domain_with_host_user + "/order/profit/getredbag",
  //  未提现总额
  weitixian: domain_with_host_user +"/profit/unwithdrawcash",
  // 提现
  tixian: domain_with_host_user + "/profit/withdrawcash",
  //  流水记录
  record: domain_with_host_user + "/order/profit/flowrecord",
  // 发送短信
  sendText: domain_with_host +"/smscode/send",
  // 绑定手机
  bindingPhone: domain_with_host_user +"/bind/phone",
  // 红包详情
  luckymoneyDel: domain_with_host_user +"/order/profit/detail",
  //红包排行
  ranking:domain_with_host_user+"/profit/ranking/pages",
  // 下单（快速下单）
  fast_order: domain_with_host_product + "/category/pages",
  // 商品的正在拼团的订单
  oedering: domain_with_host_product + "/collagingorders",
  // 店铺小程序码
  shopPoster: domain_with_host + "/appletqrcode/shop",
  // 新品推荐
  news: domain_with_host_product + "/new/pages",
  // 热销爆款
  hot: domain_with_host_product + "/hot/pages",
  // 搜索
  search: domain_with_host_product + "/search",
}