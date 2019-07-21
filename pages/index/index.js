//index.js
//获取应用实例
const app = getApp()
console.log('a00');
console.log(app.globalData.userInfo);
Page({
  data: {
    motto: '欢迎您的到来',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onGotUserInfo: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    wx.navigateTo({
      url: '/pages/newhaibao2/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
