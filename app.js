//app.js
App({
  onLaunch: function () {
    this._getInfo();
    var _this = this;
    wx.showModal({
      showCancel: false,
      title: '温馨提醒',
      content: '需要授权使用您的昵称等个人信息',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this._getUserInfo();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  
  },
  _getInfo: function(){
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=site/session', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
      }
    })
  },
  _getUserInfo: function(){
    // 获取用户信息
    var _this = this;
    wx.getSetting({
      success: res => {
        console.log(res);     
        console.log(JSON.stringify(res));
        //{"errMsg":"getSetting:ok","authSetting":{}}
        if (res.authSetting && res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = res.userInfo;
              _this._gotoMyinfo();
            }
          })
        }else{
          console.log('开始授权');
          wx.navigateTo({
            url: '/pages/userinfo/index',
            success: res => {
              console.log(res);
            },
            fail: err => {
              console.log(err);
            }
          })
        }
      },
      fail: function(err){
        console.log(err);
      }
    })
  },
  _gotoMyinfo: function(){
    wx.navigateTo({
      url: '/pages/myinfo/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  globalData: {
    userInfo: null,
    //如果用户没有授权，无法在加载小程序的时候获取头像，就使用默认头像
    avatarUrlTempPath: "/images/defaultHeader.jpg"
  }
})