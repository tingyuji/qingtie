const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    userInfo: {},
    hasUserInfo: false,
    windowWidth: '',
    posterHeight: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const poster = {
      "with": 375,
      "height": 587
    }
    const systemInfo = wx.getSystemInfoSync()
    let windowWidth = systemInfo.windowWidth
    let windowHeight = systemInfo.windowHeight
    let posterHeight = parseInt((windowWidth / poster.with) * poster.height)
    this.setData({
      windowWidth: windowWidth,
      posterHeight: posterHeight
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    let userInfo = e.detail.userInfo
    console.log('userInfo', userInfo)
    // 更新用户信息
    // api.post('更新用户信息的url', userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  generateImage: function(){
    console.log('20190620',this.data)
    const that = this
    // 图片路径
    const imagePath = '../../static/image/common/'
    let bgimgPromise = new Promise(function (resolve, reject) {
      console.log('data', that.data)
      wx.getImageInfo({
        src: imagePath + "base.png",
        success: function (res) {
          resolve(res);
        }
      })
    });

    var windowWidth = this.data.windowWidth;
    var posterHeight = this.data.posterHeight;
    bgimgPromise.then(res => {
      console.log('Promise.all', res)
      const ctx = wx.createCanvasContext('shareImg')
      ctx.width = windowWidth
      ctx.height = posterHeight
      console.log(this.data)
      // 背景图
      ctx.drawImage('../../' + res.path, 0, 0, windowWidth, posterHeight, 0, 0)
      // 头像
      ctx.drawImage(that.data.userInfo.avatarUrl, 48, 182, 58, 58, 0, 0)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#000')
      ctx.setFontSize(22)
      // ctx.fillText('分享文字2：stark.wang出品', 88, 414)
      ctx.fillText('欢迎参加我们的婚礼', 155, 414)
      ctx.stroke()
      ctx.draw()
    }) 
  },
  saveImage: function(){
    var that = this
    wx.showLoading({
      title: '正在制作海报。。。'
    })
    new Promise(function (resolve, reject) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 444,
        height: 500,
        destWidth: 555,
        destHeight: 666,
        canvasId: 'starkImg',
        success: function (res) {
          console.log(res.tempFilePath);
          that.setData({
            prurl: res.tempFilePath,
            hidden: false
          })
          wx.hideLoading()
          resolve(res)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }).then(res => {
      console.log(res)
      this.save(res)
    })
  },
  save: function(data){
    wx.getSetting({
      success: res => {
        console.log(res);     
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.saveImageToPhotosAlbum({
            filePath: data.tempFilePath,
            success(result) {
              console.log(result)
            }
          })
        }else if(!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success(result) {
                  console.log(result)
                }
              })
            }
          })
        }
      }
    })
  }
})