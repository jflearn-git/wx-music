// num/bendi/bendi.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeColor:'0',
  },
  
  nexttu:function(){
    let num = parseInt(Math.random() * 30) 
    this.setData({
      imgBg: this.data.imgsBg[num],
      
    })
    
  },
  slider:function(e){
    
    wx.seekBackgroundAudio({
      position: e.detail.value
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.list){
      console.log(options.list)

      wx.request({
        url: 'http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=1&aggr=1&cr=1&loginUin=123456&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w=' + options.list, //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
        }
      })


    }


    const that1 = this;
    this.audioCtx = wx.createAudioContext('myAudio');
    let name = options.name;
    let icon = options.icon;
    let author = options.author;
    let url = app.globalData.musicUrl;
    let index = options.index;
    
   
    let lrcArr = app.globalData.arrlrc[index];

 
    that1.setData({
        lrcArr: lrcArr,
        moveTop:360
    })


    wx.request({
      url: 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord+=&cl=&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&word='+name+'&z=&ic=0&s=&se=&tab=&face=0&istype=2&qc=&nc=1&fr=&step_word=高清&pn=0&rn=30&gsm=1e&1512314841233='
, //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        let imgs = res.data.data;
        let imgsarr = [];
        for(var i =0;i < imgs.length;i++){
          imgsarr.push(res.data.data[i].thumbURL) ;
        }
       
        let img = res.data.data[0].thumbURL;
        // let img = res.data.data[0].middleURL;
        that1.setData({
          imgBg:img,
          imgsBg: imgsarr
        })

      }
    })


    let that = this;
  
    that.setData({
      musicName:name,
      musicIcon:icon,
      author:author,
      musicURI:url
      
    })
    //加载数据后播放音乐

    app.globalData.musicUrl = url;
    app.globalData.songName = name;
    app.globalData.songer = author;
    app.globalData.imgUrl = icon;
  


    wx.playBackgroundAudio({
      dataUrl: that.data.musicURI,
      title: '',
      coverImgUrl: ''
    })

    //监听音乐。播放歌词


   


    wx.onBackgroundAudioPlay(function () {
      console.log('开始播放了');
      app.isPlay = true;
      that1.setData({
        isPlay: app.isPlay
      })
     
    })
    wx.onBackgroundAudioPause(function () {
      console.log('停止播放');
      app.isPlay = false;
      that1.setData({
        isPlay: app.isPlay
      })
    })
    let now = 0;//检测当前秒数是否增加，如果还是同样的秒数，不触发操作



    //监听播放开始
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    const obj = backgroundAudioManager;

    obj.onTimeUpdate(
      function () {
        //歌词起始位置360  每次改变80
        // 歌词数据
        let arr = that.data.lrcArr;

        let duration = parseInt(obj.duration);
        let currentTime = parseInt(obj.currentTime);

        function getnowTime(currentTime) {
          if (currentTime < 60) {
            if (currentTime < 10) {
              return '00:0' + currentTime
            } else {
              return '00:' + currentTime
            }
          } else {
            let c = currentTime % 60;
            if (c < 10) {
              c = '0' + c
            }
            let f = parseInt(currentTime / 60);
            return '0' + f + ':' + c;
          }
        }
        var nowTime = getnowTime(currentTime);
        var endTime = getnowTime(duration);


        that.setData({
          currentTime: currentTime,
          duration: duration,
          nowTime: nowTime,
          endTime: endTime
        })

        for (var i = 0; i < arr.length; i++) {

          //如果有对应的id发生改变
          if (currentTime == arr[i][0]) {


            now = currentTime;
            that1.setData({
              changeColor: currentTime,
              moveTop: 360 - 80 * parseInt(arr[i][2])
            })



          }
        }

      }
    )
      //监听播放结束
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