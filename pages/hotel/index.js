Page({
  data: {
    latitude: 31.237760,
    longitude: 121.502180,
    markers: [{
      id: 1,
      latitude: 31.237760,
      longitude: 121.502180,
      name: '香格里拉大酒店'
    }],
    covers: [{
      latitude: 31.237760,
      longitude: 121.502180,
      iconPath: '/image/location.png'
    }, {
        latitude: 31.237760,
        longitude: 121.502180,
      iconPath: '/image/location.png'
    }]
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 31.237760,
        longitude: 121.502180,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 31.237760,
        longitude: 121.502180,
      }, {
          latitude: 31.237760,
          longitude: 121.502180,
      }]
    })
  }
})
