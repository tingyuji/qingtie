
Page({
  data: {
    height: 20,
    focus: false, 
    code: '初始化赋值',
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false
  },
  bindButtonTap() {
    this.setData({
      focus: true
    })
  },
  bless(e){
    wx.showToast({
      title: '祝福发送成功',
      icon: 'success',
      duration: 2000
    })

  },
  bindTextAreaBlur(e) {
    console.log(e.detail.value)
  },
  bindFormSubmit(e) {
    console.log(e.detail.value.textarea)
  },
  onShareAppMessage: function (res) {
    //if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    //}
    return {
      title: '我们结婚啦',
      path: '/pages/index/index',
      imageUrl: '/images/IMG_0031.jpg',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })

      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})