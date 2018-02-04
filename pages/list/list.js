// pages/list/list.js
Page({
  data: {
    currentTab:0,
    songer: []
  },
  swichNav: function (e) {//点击调用的函数，改变数值，根据数值改变样式，以及使用if显示不同页面
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  getListData:function(q){
    var that = this;

    wx.request({
      url: 'http://39.106.3.69:8288/list/?q='+q,
      success:function(data){
        console.log(data)
        var list = data.data;
        that.setData({
          mv:list.mv.data,
          cd:list.cd.data,
          info:list.info.data[0],
          songer:list.songer.data,
          id:list.id.data[0]
        })
      }
    })
    // wx.request({
    //   url: 'http://39.106.3.69:8288/mv',
    //   success: function (res) {
    //     console.log(res)
    //     var data = res.data.data;
    //     that.setData({
    //       mv: data
    //     })
    //   }
    // })

  },
  onLoad: function (options) {
    console.log(options.list);//根据跳转时传过来的id发送不同的请求获取到数据
    //http://localhost:8888/author/?q=2024 用q获取不同数据
      var that = this;
      this.getListData(options.list)
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
  
  }
})