var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    imgSrc:[
      '../img/00.jpg',
      '../img/01.jpg',
      '../img/02.jpg',
      '../img/03.jpg',
       '../img/04.jpg',
      
    ],
   arr :[ //  包含了5张图片里面所有的样式
      { //  1			保存五个位置图片的固有状态
        width: '400rpx',
        top: '0',
        left: '5%',
        opacity: 0.2,
        z: 2,
        id: 1,
     
      },
      { // 2
        width: "500rpx",
        top: '0',
        left: '1%',
        opacity: 0.6,
        z: 3,
        id: 2,
      
      },
      { // 3
        width: '600rpx',
        top: 0,
        left: '10%',
        opacity: 1,
        z: 4,
        id: 3,
     
      },
      { // 4
        width: "500rpx",
        top: '0',
        right: '1%',
        opacity: 0.6,
        z: 3,
        id: 4,
 
      },
      { //5
        width: '400rpx',
        top: 0,
        right: '5%',
        opacity: 0.2,
        z: 2,
        id: 5,

      }
    ],
  },
  //设置定时器，让图片运动到改变后的数组后的位置
  run:function(){
    //h改变数组
    const that = this;
    let changeArr =  this.data.arr;
    setInterval(function(){
      changeArr.push(changeArr.shift())
      that.setData({
        arr: changeArr
      })
    },3000)

  },
  getList:function(q,count,name,skip){
    const that = this;
    // https://api.douban.com/v2/music/search?q=%27%E5%A5%BD%E6%AD%8C%27&count=3
    wx.request({
      url: 'https://api.douban.com/v2/music/search',
      data: { 'q': q, 'count': count,'start':skip},
      header: {},
      success: function(res) {
        let list = res.data.musics;
        let arr = [];

       
        for(let i = 0;i < list.length;i ++){
          let json = {};
          let t = list[i];
          let listImg = t.image;
          let author = t.author[0].name;
          let listname = t.attrs.tracks[0];
          let id = t.id;
         
          json.listImg = listImg;
          json.listname = listname;
          json.author = author;
          json.id = id;


          arr.push(json)
      

        }
      let obj = {};
      obj[name] = arr;
      that.setData(obj);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  read(e){//点击传入不同的数据到页面
    var list = e.currentTarget.dataset.list;
    console.log(list)
    wx.navigateTo({
      url: '../list/list?list='+list,
    })
  },
  getAuthor:function(q,key){
    var This = this;
    var obj = {}
    wx.request({
      url: 'http://39.106.3.69:8288/author', //仅为示例，并非真实的接口地址
      data:{
        q:q
      },
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var arr =  res.data;
        obj[key] = arr;
        This.setData(obj);

      }
    })
  },
  //音乐搜索
  
  onLoad: function () {
    this.getAuthor(1,'hot')

    var that = this;
  //让轮播图运动起来
    this.run()
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})  