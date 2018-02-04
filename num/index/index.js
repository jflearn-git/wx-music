// num/index/index.js
var app = getApp().globalData;
Page({
  
  data: {
    isPlay: true,
    nextSong: app.nextSong,
    songName: '位子歌曲',
    songer: '位置歌手',
    imgUrl:'../../images/play/author.png'
  },
  play:function(){
    console.log('我要播放')

    app.isPlay = true;
   //改变数据setData
    this.setData({
      isPlay: app.isPlay
    })
    wx.playBackgroundAudio({
      dataUrl: app.musicUrl,//(必要)音乐链接，目前支持的格式有 m4a, aac, mp3, wav
      title: '',//音乐标题
      coverImgUrl: '',//封面URL
      
    })
   
  },
  nowPlay: function () {

   let name = app.songNam;
   let author = app.songer;
   let icon = app.imgUrl;
   let index = app.index;

    wx.navigateTo({
      url: '../../num/bendi/bendi?name=' + name + '&icon=' + icon + '&author=' + author + '&index=' + index,
    })

    wx.playBackgroundAudio({
      dataUrl: app.musicUrl,//(必要)音乐链接，目前支持的格式有 m4a, aac, mp3, wav
      title: '',//音乐标题
      coverImgUrl: '',//封面URL

    })

  },
  pause:function(){
    console.log('我要暂停')

    app.isPlaly = false;
    this.setData({
      isPlay: false
    })
    wx.pauseBackgroundAudio()
  },
  change:function(ev){
    const that = this;
    let name = ev.currentTarget.dataset.name;
    let icon = ev.currentTarget.dataset.icon;
    let author = ev.currentTarget.dataset.author;
    let index = ev.currentTarget.dataset.index;


    
    app.musicUrl = ev.currentTarget.dataset.url;
    app.songNam = name;
    app.songer = author;
    app.imgUrl = icon;
    app.index = index;
  
    that.setData({
      songName: app.songNam,
      songer: app.songer,
      imgUrl: app.imgUrl,
      index: app.index
    })

  
       wx.navigateTo({
         url: '../../num/bendi/bendi?name=' + name + '&icon=' + icon + '&author=' + author+'&index=' + index,
        
       })
  }
  ,
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
      
    })
    
  },
  search:function(){
    //获取歌曲列表
    let that = this;
    wx.request({
      // n = 15获取15条数据
      url: 'http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=30&aggr=1&cr=1&loginUin=123456&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w=' + this.data.inputValue, //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let list = res.data.data.song.list;
        // let data = res.data.data.song.list[0].f.split("|");
        let musicNames = [];
        let author = [];
        let musicIcon = [];
        let musicURI = [];
        let musicIds = [];
        let len = list.length;
        let lrcs = [];
        //储存所有解析后的歌词
        let arrlrc =[];
//循环获取数据开始
        for (i in list) {
          list[i].f.replace(/[\;]/g, '')
        }
        console.log(res.data.data.song.list[0].f)


        for(var i = 0;i < len;i ++){
          let data = res.data.data.song.list[i].f.split("|");
          console.log(666)

          let img = data[22];
          let musicId = data[20];
          let lrcMo = data[0];

          let lrc = 'http://music.qq.com/miniportal/static/lyric/' + lrcMo % 100 + '/' + lrcMo + '.xml';
          lrcs.push(lrc);
          console.log(data[1])
          musicNames.push(data[1].replace(/[\;]/g,''));
          
          
          author.push(data[3]);
          musicIds.push(musicId);
          musicIcon.push('http://imgcache.qq.com/music/photo/mid_album_90/' + img.charAt(img.length - 2) + '/' + img.charAt(img.length - 1) + '/' + img + '.jpg');

        }

//循环获取数据结


        for(var i = 0;i < list.length;i++){  
          arrlrc.push(getLrc(lrcs[i]));
          if (i == list.length-1){      
            that.setData({
              arrlrc:arrlrc
            })
            app.arrlrc = arrlrc;
            // console.log(arrlrc)
          } 
        } 
//对歌词进行解析
        function getLrc(lrcs){
          var arr2 = [];
         
          wx.request({
            url: lrcs, //仅为示例，并非真实的接口地址
            data: {
            },
            header: {
              // 'content-type': 'application/json',
              // 'charset': 'utf-8'
               'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 
               // 默认值
            },
            success: function (res) {
              let lrcStr =  JSON.parse(decodeURIComponent(JSON.stringify(res.data)))
             // let lrcStr = res.data;
              

              // var ll = lrcStr.substring(lrcStr.indexOf('[[') + 1, lrcStr.indexOf(']]'));
                //去掉头部只有歌词
              var str = lrcStr.substring(lrcStr.indexOf('[offset:0]') + 10, lrcStr.indexOf(']]'));
              var arr = str.split('[');
           
              for (var i = 1; i < arr.length; i++) {
                var t = arr[i].split(']');
                t[0] = t[0].substring(0, t[0].indexOf('.'))
                var c = t[0].split(':');
                //定义t[2]为索引
            
                t[2] = i;
                t[0] = parseInt(c[0] * 60) + parseInt(c[1]);
                arr2.push(t);

              }
            
              
              //找到每一个歌
            }
          })
          return arr2;
        }
        
        
        that.setData({
          list:list,
          musicNames: musicNames,
          author: author,
          musicIcon: musicIcon
        })


        //第二次请求开始
        wx.request({
          url: 'http://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=123456', //仅为示例，并非真实的接口地址
          data: {
          },
          dataType: "json",
          header: {
            'content-type': 'json' // 默认值
          },
          success: function (res) {
            var mode = res.data;
            //动态获取的key
            var key2 = mode.slice(13, mode.length - 2);
            var nowKey = JSON.parse(key2).key
            let musicURIs = [];
            for(let i = 0;i < len; i ++){
              musicURIs.push('http://ws.stream.qqmusic.qq.com/C200' + musicIds[i] + '.m4a?vkey=' + nowKey + '&guid=123456&fromtag=30');
            }
         
            that.setData({
              musicURIs: musicURIs,
              
            })

          }


        })

        //第二次请求结束
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this)
    // const backgroundAudioManager = wx.getBackgroundAudioManager();
    // const obj = backgroundAudioManager
    // const that = this;


    // wx.onBackgroundAudioPlay(function () {
    //   console.log('开始播放了');
    //   app.isPlay = true;
    //   that.setData({
    //     isPlay: app.isPlay 
    //   })
    
    // })
    // wx.onBackgroundAudioPause(function(){
    //   console.log('停止播放');
    //   app.isPlay = false;
    //   that.setData({
    //     isPlay: app.isPlay
    //   })
    // })
    // obj.onTimeUpdate(
    //   function(){

    //     // 歌词数据
    //     let arr = that.data.lrcsArr;
        
    //     let duration = parseInt(obj.duration);
    //     let currentTime = parseInt(currentTime);
   
    //     for (var i = 0; i < app.lrcArr.length;i ++){
              
    //     }

    //   }
    // )
    

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