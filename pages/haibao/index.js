const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avater: "",
    productCode: "",
    showpost: false,
    imgHeight: 0,
    productCode: "" //二维码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('2019060505');
    console.log(app.globalData);
    this.getAvaterInfo();
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

  },
  //下载产品图片
  getAvaterInfo: function () {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    that.setData({
      showpost: true
    })
    console.log('2019060503');
    console.log(app.globalData.userInfo.avatarUrl);
    var productImage = app.globalData.userInfo.avatarUrl;
    if (productImage) {
      wx.downloadFile({
        url: productImage,
        success: function (res) {
          console.log('2019060501');
          console.log(res);
          wx.hideLoading();
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            that.calculateImg(productSrc, function (data) {
              that.getQrCode(productSrc, data);
            })
          } else {
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                var productSrc = "";
                that.getQrCode(productSrc);
              }
            })
          }
        },
        fail: function(err){
          console.log('2019060502');
          console.log(err);
        }
      })
    } else {
      wx.hideLoading();
      var productSrc = "";
      that.getQrCode(productSrc);
    }
  },

  //下载二维码
  getQrCode: function (productSrc, imgInfo = "") {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    var productCode = 'https://mp.weixin.qq.com/wxopen/qrcode?action=show&type=2&fakeid=3803103711&token=1606205099';
    if (productCode) {
      wx.downloadFile({
        url: productCode,
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode === 200) {
            var codeSrc = res.tempFilePath;
            that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
          } else {
            wx.showToast({
              title: '二维码下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                var codeSrc = "";
                that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
              }
            })
          }
        }
      })
    } else {
      wx.hideLoading();
      var codeSrc = "";
      that.sharePosteCanvas(productSrc, codeSrc);
    }
  },

  //canvas绘制分享海报
  sharePosteCanvas: function (avaterSrc, codeSrc, imgInfo) {
    console.log('2019050606');
    console.log(avaterSrc);
    console.log(codeSrc);
    console.log(imgInfo);
    wx.showLoading({
      title: '生成中...',
      mask: true,
    })
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas', that);
    var width = "";
    const query = wx.createSelectorQuery().in(this);
    query.select('#canvas-container').boundingClientRect(function (rect) {
      var height = rect.height;
      var right = rect.right;
      width = rect.width;
      var left = rect.left;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, rect.width, height);

      //头像
      if (avaterSrc) {
        if (imgInfo) {
          var imgheght = parseFloat(imgInfo);
        }
        ctx.drawImage(avaterSrc, 0, 0, width, imgheght ? imgheght : width);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }

      //产品名称
      that.data.productname = '产品名称';
      if (that.data.productname) {
        const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
        let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.productname).substr(0, 40), CONTENT_ROW_LENGTH);
        ctx.setTextAlign('left');
        ctx.setFillStyle('#000');
        ctx.setFontSize(14);
        let contentHh = 22 * 1;
        for (let m = 0; m < contentArray.length; m++) {
          ctx.fillText(contentArray[m], 15, imgheght + 35 + contentHh * m);
        }
      }


      //产品金额
      that.data.price = '10';
      if (that.data.price || that.data.price == 0) {
        ctx.setFontSize(25);
        ctx.setFillStyle('#F57509');
        ctx.setTextAlign('left');
        var price = that.data.price;
        if (!isNaN(price)) {
          price = "¥" + that.data.price
        }
        ctx.fillText(price, left - 15, imgheght + 110); //电话
      }


      //  绘制二维码
      if (codeSrc) {
        ctx.drawImage(codeSrc, left + 185, imgheght + 10, width / 4, width / 4)
        ctx.setFontSize(10);
        ctx.setFillStyle('#000');
        ctx.fillText("微信扫码或长按保存图片", left + 165, imgheght + 110);
      }
    }).exec()
    setTimeout(function () {
      ctx.draw();
      wx.hideLoading();
    }, 1000)

  },

  textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
    let strLength = 0; // text byte length
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 255) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
  },

  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  that.closePoste();
                  if (res.confirm) { }
                },
                fail: function (res) {
                  console.log(res)
                }
              })
            },
            fail: function (res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        },
        fail: function (err) {
          console.log(err)
        }
      }, that);
    }, 1000);
  },
  //关闭海报
  closePoste: function () {
    this.setData({
      showpost: false
    })
    // detail对象，提供给事件监听函数
    this.triggerEvent('myevent', {
      showVideo: true
    })
  },

  //计算图片尺寸
  calculateImg: function (src, cb) {
    var that = this;
    wx.getImageInfo({
      src: src,
      success(res) {
        wx.getSystemInfo({
          success(res2) {
            var ratio = res.width / res.height;
            var imgHeight = (res2.windowWidth * 0.85 / ratio) + 130;
            that.setData({
              imgHeight: imgHeight
            })
            cb(imgHeight - 130);
          }
        })
      }
    })
  }  
})